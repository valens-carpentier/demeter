import { PasskeyArgType } from '@safe-global/protocol-kit'
import { Safe4337Pack } from '@safe-global/relay-kit'
import {
  BUNDLER_URL,
  RPC_URL,
  CALL_GAS_LIMIT,
  VERIFICATION_GAS_LIMIT,
  PRE_VERIFICATION_GAS,
  PAYMASTER_URL,
} from './constants'

// Execute Safe deployment.
export const executeSafeDeployment = async ({
  signer,
  safeAddress,
}: {
  signer: PasskeyArgType
  safeAddress: string
}) => {
  try {
    console.log('[Deployment] Initializing Safe with paymaster...');
    const safe4337Pack = await Safe4337Pack.init({
      provider: RPC_URL,
      signer,
      bundlerUrl: BUNDLER_URL,
      paymasterOptions: {
        isSponsored: true,
        paymasterUrl: PAYMASTER_URL,
      },
      options: {
        owners: [],
        threshold: 1,
        salt: BigInt('0x' + signer.rawId)
      }
    });

    const signerAddress = await safe4337Pack.protocolKit.getAddress();
    console.log('[Deployment] Signer address:', signerAddress);

    console.log('[Deployment] Reinitializing with owner...');
    const safe4337PackWithOwner = await Safe4337Pack.init({
      provider: RPC_URL,
      signer,
      bundlerUrl: BUNDLER_URL,
      paymasterOptions: {
        isSponsored: true,
        paymasterUrl: PAYMASTER_URL,
      },
      options: {
        owners: [signerAddress],
        threshold: 1,
        salt: BigInt('0x' + signer.rawId)
      }
    });

    const calculatedAddress = await safe4337PackWithOwner.protocolKit.getAddress();
    console.log('[Deployment] Calculated address:', calculatedAddress);
    
    if (calculatedAddress !== safeAddress) {
      console.error('[Deployment] Address mismatch:', { calculatedAddress, safeAddress });
      throw new Error('Safe address mismatch');
    }

    console.log('[Deployment] Creating deployment transaction...');
    const safeOperation = await safe4337PackWithOwner.createTransaction({
      transactions: [{
        to: safeAddress,
        data: '0x',
        value: '0'
      }],
      options: {
        paymasterAndData: '0x',
        callGasLimit: CALL_GAS_LIMIT.toString(),
        verificationGasLimit: VERIFICATION_GAS_LIMIT.toString(),
        preVerificationGas: PRE_VERIFICATION_GAS.toString()
      }
    });

    console.log('[Deployment] Signing operation...');
    const signedSafeOperation = await safe4337PackWithOwner.signSafeOperation(safeOperation);
    
    console.log('[Deployment] Executing transaction...');
    const userOperationHash = await safe4337PackWithOwner.executeTransaction({
      executable: signedSafeOperation
    });

    console.log('[Deployment] Transaction executed, userOpHash:', userOperationHash);
    return userOperationHash;
  } catch (error: any) {
    console.error('[Deployment] Failed:', error);
    throw error;
  }
}
