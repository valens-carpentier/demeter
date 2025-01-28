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
const ENTRYPOINT_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'

interface SafeTransaction {
    to: string
    data: string
    transactionHash: string
    executionDate: string
    transfers?: {
        from: string
        to: string
        value: string
    }[]
}

export async function loadTransactions(safeAddress: string): Promise<Transaction[]> {
    console.log('Loading transactions for address:', safeAddress)
    if (!safeAddress) return []

    try {
        const farms = await loadFarms()
        console.log('Loaded farms:', farms.length)
        console.log('Farms:', farms.map(farm => farm.token))

        const response = await fetch(
            `${SAFE_API_URL}/v1/safes/${safeAddress}/all-transactions/`
        )
        
        if (!response.ok) {
            throw new Error(`Safe API error: ${response.statusText}`)
        }

        const data = await response.json() as { results: SafeTransaction[] }
        console.log('Safe transactions loaded:', data.results?.length || 0)

        const transactions: Transaction[] = []
        const farmAddressToName = new Map(
            farms.map(farm => [farm.token.toLowerCase(), farm.name])
        )

        for (const tx of data.results || []) {
            try {
                console.log('Processing transaction:', {
                    to: tx.to,
                    data: tx.data,
                    transfers: tx.transfers
                });

                // Check for both transfers and direct calls
                if (tx.transfers) {
                    for (const transfer of tx.transfers) {
                        const toAddress = transfer.to.toLowerCase()
                        const farmName = farmAddressToName.get(toAddress)
                        
                        if (farmName) {
                            // This is a transfer to a farm contract
                            const type = transfer.from.toLowerCase() === safeAddress.toLowerCase() ? 'buy' : 'sell'
                            
                            const farmToken = new ethers.Contract(
                                toAddress,
                                ['function pricePerToken() view returns (uint256)'],
                                new ethers.JsonRpcProvider(RPC_URL)
                            )

                            const pricePerToken = await farmToken.pricePerToken()

                            transactions.push({
                                farmName,
                                date: tx.executionDate,
                                amount: 1,
                                hash: tx.transactionHash,
                                type: type === 'buy' ? 'Buy' : 'Sell',
                                price: Number(pricePerToken)
                            })
                            break
                        }
                    }
                }

                // Also check for direct calls to farm token contracts
                const farmTokenAddresses = Array.from(farmAddressToName.keys());
                if (farmTokenAddresses.includes(tx.to.toLowerCase())) {
                    const farmName = farmAddressToName.get(tx.to.toLowerCase());
                    if (farmName) {
                        // Check transfer direction for sell transactions
                        let type = 'buy';
                        if (tx.transfers) {
                            for (const transfer of tx.transfers) {
                                if (transfer.from.toLowerCase() === safeAddress.toLowerCase() && 
                                    transfer.to.toLowerCase() !== tx.to.toLowerCase()) {
                                    type = 'sell';
                                    break;
                                }
                            }
                        }

                        const farmToken = new ethers.Contract(
                            tx.to,
                            ['function pricePerToken() view returns (uint256)'],
                            new ethers.JsonRpcProvider(RPC_URL)
                        );

                        const pricePerToken = await farmToken.pricePerToken();

                        transactions.push({
                            farmName,
                            date: tx.executionDate,
                            amount: 1, // You might need to decode the actual amount from tx.data
                            hash: tx.transactionHash,
                            type: type === 'buy' ? 'Buy' : 'Sell',
                            price: Number(pricePerToken)
                        });
                    }
                }
            } catch (error) {
                console.log('Error processing transaction:', error)
                continue
            }
        }

        console.log('Total transactions found:', transactions.length)
        return transactions.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )

    } catch (error) {
        console.error('Error loading transactions:', error)
        return []
    }
}
