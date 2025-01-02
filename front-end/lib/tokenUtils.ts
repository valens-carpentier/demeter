import { ethers } from 'ethers'
import { Safe4337Pack } from '@safe-global/relay-kit'
import FarmToken from '../../build/contracts/FarmToken.json'
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

        // Get token price using provider
        const pricePerToken = await farmToken.pricePerToken()
        const totalCost = pricePerToken * BigInt(amount)

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
                value: totalCost
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
        console.error('Failed to buy tokens:', error)
        throw error
    }
}