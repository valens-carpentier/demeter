import { PasskeyArgType } from '@safe-global/protocol-kit'
import { Safe4337Pack } from '@safe-global/relay-kit'
import {
  BUNDLER_URL,
  RPC_URL,
  CALL_GAS_LIMIT,
  VERIFICATION_GAS_LIMIT,
  PRE_VERIFICATION_GAS,
} from './constants'
import { ethers } from 'ethers'



// Add this helper function at the top
const logBigInts = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v?.toString ? v.toString() : v])
  )
}

// Execute Safe deployment.
export const executeSafeDeployment = async ({
  signer,
  safeAddress,
}: {
  signer: PasskeyArgType
  safeAddress: string
}) => {
  try {
    // Use Base Sepolia's public RPC for eth_getCode and balance checks
    const provider = new ethers.JsonRpcProvider(RPC_URL)
    const balance = await provider.getBalance(safeAddress)
    
    // Convert hex values from UserOp to decimal
    const verificationGasLimit = BigInt('0x3d3d94')  // ~4,000,000
    const preVerificationGas = BigInt('0x2e8b5')    // ~190,000
    const callGasLimit = BigInt('0x27867')          // ~160,000
    
    // Calculate gas fees using Pimlico's values
    const maxFeePerGas = BigInt('0x149b0d')         // ~1,350,000
    const maxPriorityFeePerGas = BigInt('0x149970') // ~1,350,000
    
    // Calculate total gas with Pimlico's exact values
    const totalGas = verificationGasLimit + preVerificationGas + callGasLimit
    const minRequired = totalGas * maxFeePerGas

    console.log('Detailed Gas Calculations:', {
      gasLimits: {
        verificationGasLimit: verificationGasLimit.toString(),
        preVerificationGas: preVerificationGas.toString(),
        callGasLimit: callGasLimit.toString(),
        totalGas: totalGas.toString(),
      },
      fees: {
        maxFeePerGas: maxFeePerGas.toString(),
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        minRequired: minRequired.toString(),
        minRequiredInEther: ethers.formatEther(minRequired)
      },
      balance: {
        current: ethers.formatEther(balance),
        hasEnough: balance > minRequired
      }
    })

    if (balance < minRequired) {
      throw new Error(`Insufficient ETH balance for deployment. Required: ${ethers.formatEther(minRequired)} ETH, Current: ${ethers.formatEther(balance)} ETH`)
    }

    console.log('Current balance:', ethers.formatEther(balance), 'ETH')
    console.log('Initializing deployment with:', {
      signer,
      safeAddress,
      bundlerUrl: BUNDLER_URL
    })

    // Initialize Safe with separate provider and bundler URLs
    const initialSafe4337Pack = await Safe4337Pack.init({
      provider: RPC_URL,
      signer,
      bundlerUrl: BUNDLER_URL,
      options: {
        owners: [],
        threshold: 1,
        salt: BigInt('0x' + signer.rawId)
      }
    })

    // Get the signer's address
    const signerAddress = await initialSafe4337Pack.protocolKit.getAddress()

    // Reinitialize with correct owner
    const safe4337PackWithOwner = await Safe4337Pack.init({
      provider: RPC_URL,
      signer,
      bundlerUrl: BUNDLER_URL,
      options: {
        owners: [signerAddress],
        threshold: 1,
        salt: BigInt('0x' + signer.rawId)
      }
    })

    // Verify the address matches
    const calculatedAddress = await safe4337PackWithOwner.protocolKit.getAddress()
    if (calculatedAddress !== safeAddress) {
      throw new Error('Safe address mismatch: The calculated Safe address does not match the provided address')
    }

    // Add detailed logging before creating the transaction
    console.log('Creating transaction with options:', logBigInts({
      maxFeePerGas: maxFeePerGas.toString(),
      maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
      gasLimit: callGasLimit.toString(),
      verificationGasLimit: verificationGasLimit.toString(),
      preVerificationGas: preVerificationGas.toString()
    }))

    // Add a small buffer to the minimum required value
    const deploymentValue = minRequired + BigInt('0x3de08eef0e00')

    const deploymentTx = {
      to: safeAddress,
      data: '0x',
      value: deploymentValue.toString()
    }

    const safeOperation = await safe4337PackWithOwner.createTransaction({
      transactions: [deploymentTx],
      options: {
        maxFeePerGas: BigInt('0x149b0d').toString(),         // 1,350,413
        maxPriorityFeePerGas: BigInt('0x149970').toString(), // 1,350,000
        gasLimit: CALL_GAS_LIMIT.toString(),
        verificationGasLimit: VERIFICATION_GAS_LIMIT.toString(),
        preVerificationGas: PRE_VERIFICATION_GAS.toString(),
        paymasterAndData: '0x'
      }
    })

    // Remove the JSON.parse since data is already an object
    const operationData = safeOperation.data || {}
    
    // Improve logging to handle BigInt serialization
    console.log('Safe operation created:', {
      callData: operationData.callData,
      signatures: Array.from(safeOperation.signatures || []).map(sig => sig.toString()),
      chainId: safeOperation.chainId?.toString(),
      moduleAddress: safeOperation.moduleAddress,
      // Stringify the entire operationData for logging
      data: typeof operationData === 'string' 
        ? operationData 
        : JSON.stringify(operationData, (_, value) => 
            typeof value === 'bigint' ? value.toString() : value
          , 2)
    })

    console.log('Signing operation')
    const signedSafeOperation = await safe4337PackWithOwner.signSafeOperation(safeOperation)
    
    console.log('Executing transaction')
    const userOperationHash = await safe4337PackWithOwner.executeTransaction({
      executable: signedSafeOperation
    })
    
    console.log('Deployment details:', {
      balance: ethers.formatEther(balance),
      requiredPrefund: ethers.formatEther(minRequired),
      deploymentValue: ethers.formatEther(deploymentValue),
      gasParams: {
        verificationGasLimit: verificationGasLimit.toString(),
        callGasLimit: callGasLimit.toString(),
        preVerificationGas: preVerificationGas.toString(),
        maxFeePerGas: maxFeePerGas.toString()
      }
    })

    return userOperationHash
  } catch (error: any) {
    console.error('Safe deployment failed:', {
      message: error.message,
      details: error.error?.message || error.error,
      stack: error.stack?.toString() // Ensure stack is converted to string
    })
    throw error
  }
}
