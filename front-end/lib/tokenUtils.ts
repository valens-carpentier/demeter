import { ethers } from 'ethers'
import { Safe4337Pack } from '@safe-global/relay-kit'
import FarmToken from '../../artifacts/contracts/FarmToken.sol/FarmToken.json'
import { RPC_URL, BUNDLER_URL } from './constants'
import { PasskeyArgType } from '@safe-global/protocol-kit'

export async function buyFarmTokens(
    farmTokenAddress: string,
    safeAddress: string,
    amount: number,
    passkey: PasskeyArgType
): Promise<string> {
    try {
        // Initialize Safe with the passkey
        const safe4337Pack = await Safe4337Pack.init({
            provider: RPC_URL,
            signer: passkey,
            bundlerUrl: BUNDLER_URL,
            options: {
                owners: [],
                threshold: 1,
                salt: BigInt('0x' + passkey.rawId)
            }
        })

        // Get the signer's address
        const signerAddress = await safe4337Pack.protocolKit.getAddress()

        // Reinitialize with correct owner
        const safe4337PackWithOwner = await Safe4337Pack.init({
            provider: RPC_URL,
            signer: passkey,
            bundlerUrl: BUNDLER_URL,
            options: {
                owners: [signerAddress],
                threshold: 1,
                salt: BigInt('0x' + passkey.rawId)
            }
        })

        // Create provider to read contract data
        const provider = new ethers.JsonRpcProvider(RPC_URL)
        const farmToken = new ethers.Contract(
            farmTokenAddress,
            FarmToken.abi,
            provider
        )

        // Add debug logs to verify contract and function
        console.log('Contract ABI:', FarmToken.abi)
        console.log('Contract address:', farmTokenAddress)
        console.log('Available methods:', Object.keys(farmToken.interface.format()))
        console.log('All contract functions:', farmToken.interface.format())
        console.log('Contract functions:', farmToken.interface.fragments)

        // Try to get the function directly
        const calculateETHFunction = farmToken.interface.getFunction('calculateETHAmount')
        console.log('calculateETHAmount function details:', calculateETHFunction)

        // Get token price and calculate total cost in USD cents
        const pricePerToken = await farmToken.pricePerToken()
        console.log('Price per token (cents):', pricePerToken.toString())
        const totalCostInUsd = pricePerToken * BigInt(amount)
        console.log('Total cost (cents):', totalCostInUsd.toString())
        
        // Add try-catch specifically for calculateETHAmount
        let totalCostInWei
        try {
            // First check ETH price feed
            console.log('Checking ETH price feed...')
            const priceFeedAddress = await farmToken.ETH_USD_PRICE_FEED()
            console.log('Price feed address:', priceFeedAddress)
            
            // Try to get latest price
            try {
                const [price, timestamp] = await farmToken.getLatestETHPrice()
                console.log('ETH Price:', price.toString())
                console.log('Timestamp:', new Date(Number(timestamp) * 1000).toISOString())
            } catch (priceError: any) {
                console.error('Price feed error:', {
                    message: priceError.message,
                    data: priceError.data,
                    reason: priceError.reason
                })
            }

            // Now try calculateETHAmount
            totalCostInWei = await farmToken.calculateETHAmount(totalCostInUsd)
            console.log('Successfully calculated ETH amount:', totalCostInWei.toString())
        } catch (error: any) {
            console.error('Error details:', {
                message: error.message,
                data: error.data,
                reason: error.reason,
                args: totalCostInUsd.toString()
            })
            throw error
        }

        // Try direct call first
        try {
            // Gas parameters (copied from deployment.ts)
            const verificationGasLimit = BigInt('0x3d3d94')  // ~4,000,000
            const preVerificationGas = BigInt('0x2e8b5')    // ~190,000
            const callGasLimit = BigInt('0x27867')          // ~160,000
            const maxFeePerGas = BigInt('0x149b0d')         // ~1,350,000
            const maxPriorityFeePerGas = BigInt('0x149970') // ~1,350,000

            // Create the transaction with gas parameters
            const safeOperation = await safe4337PackWithOwner.createTransaction({
                transactions: [{
                    to: farmTokenAddress,
                    data: farmToken.interface.encodeFunctionData('buyTokens', [amount]),
                    value: totalCostInWei
                }],
                options: {
                    maxFeePerGas: maxFeePerGas.toString(),
                    maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
                    gasLimit: callGasLimit.toString(),
                    verificationGasLimit: verificationGasLimit.toString(),
                    preVerificationGas: preVerificationGas.toString(),
                    paymasterAndData: '0x'
                }
            })

            // Sign the operation
            const signedSafeOperation = await safe4337PackWithOwner.signSafeOperation(safeOperation)

            // Execute the transaction
            const userOperationHash = await safe4337PackWithOwner.executeTransaction({
                executable: signedSafeOperation
            })

            return userOperationHash
        } catch (error) {
            console.error('Error calculating ETH amount:', error)
            // Fallback calculation if direct call fails
            try {
                const [ethPrice] = await farmToken.getLatestETHPrice()
                const ethPriceInCents = (ethPrice * BigInt(100)) / BigInt(1e8)
                const ethPriceWithMargin = (ethPriceInCents * BigInt(105)) / BigInt(100)
                const totalCostInWei = (totalCostInUsd * BigInt(1e18)) / ethPriceWithMargin
                
                // Create the transaction with calculated value
                const safeOperation = await safe4337PackWithOwner.createTransaction({
                    transactions: [{
                        to: farmTokenAddress,
                        data: farmToken.interface.encodeFunctionData('buyTokens', [amount]),
                        value: totalCostInWei
                    }],
                    options: {
                        maxFeePerGas: maxFeePerGas.toString(),
                        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
                        gasLimit: callGasLimit.toString(),
                        verificationGasLimit: verificationGasLimit.toString(),
                        preVerificationGas: preVerificationGas.toString(),
                        paymasterAndData: '0x'
                    }
                })
                
                // Sign the operation
                const signedSafeOperation = await safe4337PackWithOwner.signSafeOperation(safeOperation)

                // Execute the transaction
                const userOperationHash = await safe4337PackWithOwner.executeTransaction({
                    executable: signedSafeOperation
                })

                return userOperationHash
            } catch (fallbackError) {
                console.error('Fallback calculation failed:', fallbackError)
                throw new Error('Failed to calculate ETH amount required for purchase')
            }
        }
    } catch (error) {
        console.error('Failed to buy tokens:', error)
        throw error
    }
}

export async function sellFarmTokens(
    farmTokenAddress: string,
    safeAddress: string,
    amount: number,
    passkey: PasskeyArgType
): Promise<string> {
    try {
        // Initialize Safe with the passkey
        const safe4337Pack = await Safe4337Pack.init({
            provider: RPC_URL,
            signer: passkey,
            bundlerUrl: BUNDLER_URL,
            options: {
                owners: [],
                threshold: 1,
                salt: BigInt('0x' + passkey.rawId)
            }
        })

        // Get the signer's address
        const signerAddress = await safe4337Pack.protocolKit.getAddress()

        // Reinitialize with correct owner
        const safe4337PackWithOwner = await Safe4337Pack.init({
            provider: RPC_URL,
            signer: passkey,
            bundlerUrl: BUNDLER_URL,
            options: {
                owners: [signerAddress],
                threshold: 1,
                salt: BigInt('0x' + passkey.rawId)
            }
        })

        // Create provider to read contract data
        const provider = new ethers.JsonRpcProvider(RPC_URL)
        const farmToken = new ethers.Contract(
            farmTokenAddress,
            FarmToken.abi,
            provider
        )

        // Gas parameters
        const verificationGasLimit = BigInt('0x3d3d94')  // ~4,000,000
        const preVerificationGas = BigInt('0x2e8b5')    // ~190,000
        const callGasLimit = BigInt('0x27867')          // ~160,000
        const maxFeePerGas = BigInt('0x149b0d')         // ~1,350,000
        const maxPriorityFeePerGas = BigInt('0x149970') // ~1,350,000

        // Create the transaction
        const safeOperation = await safe4337PackWithOwner.createTransaction({
            transactions: [{
                to: farmTokenAddress,
                data: farmToken.interface.encodeFunctionData('sellTokens', [amount]),
                value: 0
            }],
            options: {
                maxFeePerGas: maxFeePerGas.toString(),
                maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
                gasLimit: callGasLimit.toString(),
                verificationGasLimit: verificationGasLimit.toString(),
                preVerificationGas: preVerificationGas.toString(),
                paymasterAndData: '0x'
            }
        })

        // Sign and execute the transaction
        const signedSafeOperation = await safe4337PackWithOwner.signSafeOperation(safeOperation)
        const userOperationHash = await safe4337PackWithOwner.executeTransaction({
            executable: signedSafeOperation
        })

        return userOperationHash
    } catch (error) {
        console.error('Failed to sell tokens:', error)
        throw error
    }
}