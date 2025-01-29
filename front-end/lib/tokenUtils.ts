import { ethers } from 'ethers'
import { Safe4337Pack } from '@safe-global/relay-kit'
import FarmToken from '../../artifacts/contracts/FarmToken.sol/FarmToken.json'
import { RPC_URL, BUNDLER_URL, USDC_CONTRACT_ADDRESS } from './constants'
import { PasskeyArgType } from '@safe-global/protocol-kit'

// Add USDC ABI with the required functions
const USDC_ABI = [
    // Read functions
    "function balanceOf(address owner) view returns (uint256)",
    "function allowance(address owner, address spender) view returns (uint256)",
    // Write functions
    "function approve(address spender, uint256 amount) returns (bool)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)"
];

export async function buyFarmTokensWithUSDC(
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

        // Get contracts with correct ABI
        const provider = new ethers.JsonRpcProvider(RPC_URL)
        const farmToken = new ethers.Contract(farmTokenAddress, FarmToken.abi, provider)
        const usdc = new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, provider)

        // Calculate USDC amount needed
        const pricePerToken = await farmToken.pricePerToken()
        const totalCostInUsd = pricePerToken * BigInt(amount)
        const usdcAmount = totalCostInUsd * BigInt(10_000)

        // Gas parameters with higher limits for batch transaction
        const verificationGasLimit = BigInt('0x7d3d94')  // Doubled from ETH transaction
        const preVerificationGas = BigInt('0x4e8b5')    // Doubled
        const callGasLimit = BigInt('0x4c4b40')         // Increased for two transactions
        const maxFeePerGas = BigInt('0x149b0d')
        const maxPriorityFeePerGas = BigInt('0x149970')

        // Create batch transaction
        const safeOperation = await safe4337PackWithOwner.createTransaction({
            transactions: [
                {
                    to: USDC_CONTRACT_ADDRESS,
                    data: usdc.interface.encodeFunctionData('approve', [farmTokenAddress, usdcAmount]),
                    value: '0'
                },
                {
                    to: farmTokenAddress,
                    data: farmToken.interface.encodeFunctionData('buyTokensWithUSDC', [amount]),
                    value: '0'
                }
            ],
            options: {
                maxFeePerGas: maxFeePerGas.toString(),
                maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
                gasLimit: callGasLimit.toString(),
                verificationGasLimit: verificationGasLimit.toString(),
                preVerificationGas: preVerificationGas.toString(),
                paymasterAndData: '0x'
            }
        })

        // Sign and execute
        const signedSafeOperation = await safe4337PackWithOwner.signSafeOperation(safeOperation)
        const userOperationHash = await safe4337PackWithOwner.executeTransaction({
            executable: signedSafeOperation
        })

        return userOperationHash
    } catch (error: any) {
        console.error('Failed to buy tokens with USDC:', {
            message: error.message,
            data: error.data,
            reason: error.reason
        })
        throw error
    }
}

export async function sellFarmTokensWithUSDC(
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
        const verificationGasLimit = BigInt('0x7d3d94')  // Doubled for USDC transaction
        const preVerificationGas = BigInt('0x4e8b5')    // Doubled
        const callGasLimit = BigInt('0x4c4b40')         // Increased for USDC handling
        const maxFeePerGas = BigInt('0x149b0d')
        const maxPriorityFeePerGas = BigInt('0x149970')

        // Create the transaction
        const safeOperation = await safe4337PackWithOwner.createTransaction({
            transactions: [{
                to: farmTokenAddress,
                data: farmToken.interface.encodeFunctionData('sellTokensWithUSDC', [amount]),
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
    } catch (error: any) {
        console.error('Failed to sell tokens with USDC:', {
            message: error.message,
            data: error.data,
            reason: error.reason
        })
        throw error
    }
}