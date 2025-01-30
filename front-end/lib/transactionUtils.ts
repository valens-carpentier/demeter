import { ethers } from 'ethers'
import { RPC_URL } from './constants'
import loadFarms from './farmsUtils'

export interface Transaction {
    farmName: string
    date: string
    amount: number  
    hash: string
    type: 'Buy' | 'Sell'
    price: number  // Price per token in cents
}

const SAFE_API_URL = 'https://safe-transaction-base-sepolia.safe.global/api'

interface SafeTransaction {
    to: string
    data: string
    transactionHash: string
    executionDate: string
    transfers?: {
        from: string
        to: string
        value: string
        tokenInfo?: {
            decimals: number
        }
    }[]
}

export async function loadTransactions(safeAddress: string): Promise<Transaction[]> {
    if (!safeAddress) return []

    try {
        const farms = await loadFarms()

        const response = await fetch(
            `${SAFE_API_URL}/v1/safes/${safeAddress}/all-transactions/`
        )
        
        if (!response.ok) {
            throw new Error(`Safe API error: ${response.statusText}`)
        }

        const data = await response.json() as { results: SafeTransaction[] }

        const transactions: Transaction[] = []
        const processedHashes = new Set<string>() // Track processed transaction hashes
        const farmAddressToName = new Map(
            farms.map(farm => [farm.token.toLowerCase(), farm.name])
        )

        for (const tx of data.results || []) {
            try {
                // Skip if we've already processed this transaction hash
                if (processedHashes.has(tx.transactionHash)) {
                    continue
                }

                let transactionProcessed = false

                // Check for transfers
                if (tx.transfers) {
                    for (const transfer of tx.transfers) {
                        const toAddress = transfer.to.toLowerCase()
                        const farmName = farmAddressToName.get(toAddress)
                        
                        if (farmName) {
                            const type = transfer.from.toLowerCase() === safeAddress.toLowerCase() ? 'buy' : 'sell'
                            
                            // Find the farm token transfer
                            const farmTokenTransfer = tx.transfers.find(t => 
                                t.tokenInfo && farmAddressToName.has(t.tokenInfo.address?.toLowerCase())
                            )
                            
                            if (farmTokenTransfer) {
                                const tokenDecimals = farmTokenTransfer.tokenInfo?.decimals || 6
                                const amount = Number(ethers.formatUnits(farmTokenTransfer.value, tokenDecimals))
                                
                                const farmToken = new ethers.Contract(
                                    toAddress,
                                    ['function pricePerToken() view returns (uint256)'],
                                    new ethers.JsonRpcProvider(RPC_URL)
                                )

                                const pricePerToken = await farmToken.pricePerToken()
                                const priceInCents = Number(pricePerToken) // Keep as cents

                                transactions.push({
                                    farmName,
                                    date: tx.executionDate,
                                    amount,
                                    hash: tx.transactionHash,
                                    type: type === 'buy' ? 'Buy' : 'Sell',
                                    price: priceInCents
                                })
                                processedHashes.add(tx.transactionHash)
                                transactionProcessed = true
                                break
                            }
                        }
                    }
                }

                // Only check for direct calls if we haven't processed this transaction yet
                if (!transactionProcessed) {
                    const farmTokenAddresses = Array.from(farmAddressToName.keys())
                    if (farmTokenAddresses.includes(tx.to.toLowerCase())) {
                        const farmName = farmAddressToName.get(tx.to.toLowerCase())
                        if (farmName) {
                            let type = 'buy'
                            let amount = 0
                            
                            if (tx.transfers) {
                                // Find the farm token transfer
                                const farmTokenTransfer = tx.transfers.find(t => 
                                    t.tokenInfo && farmAddressToName.has(t.tokenInfo.address?.toLowerCase())
                                )
                                
                                if (farmTokenTransfer) {
                                    const tokenDecimals = farmTokenTransfer.tokenInfo?.decimals || 6
                                    amount = Number(ethers.formatUnits(farmTokenTransfer.value, tokenDecimals))
                                    
                                    if (farmTokenTransfer.from.toLowerCase() === safeAddress.toLowerCase() && 
                                        farmTokenTransfer.to.toLowerCase() !== tx.to.toLowerCase()) {
                                        type = 'sell'
                                    }
                                }
                            }

                            const farmToken = new ethers.Contract(
                                tx.to,
                                ['function pricePerToken() view returns (uint256)'],
                                new ethers.JsonRpcProvider(RPC_URL)
                            )

                            const pricePerToken = await farmToken.pricePerToken()
                            const priceInCents = Number(pricePerToken) // Keep as cents

                            transactions.push({
                                farmName,
                                date: tx.executionDate,
                                amount,
                                hash: tx.transactionHash,
                                type: type === 'buy' ? 'Buy' : 'Sell',
                                price: priceInCents
                            })
                            processedHashes.add(tx.transactionHash)
                        }
                    }
                }
            } catch (error) {
                console.error('Error processing transaction:', error)
                continue
            }
        }

        return transactions.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )

    } catch (error) {
        console.error('Error loading transactions:', error)
        return []
    }
}
