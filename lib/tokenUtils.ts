import { ethers } from 'ethers'
import { Safe4337Pack } from '@safe-global/relay-kit'
import FarmToken from '../artifacts/contracts/FarmToken.sol/FarmToken.json'
import { RPC_URL, BUNDLER_URL, USDC_CONTRACT_ADDRESS, PAYMASTER_URL } from './constants'
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
        const safe4337Pack = await Safe4337Pack.init({
            provider: RPC_URL,
            signer: passkey,
            bundlerUrl: BUNDLER_URL,
            paymasterOptions: {
                isSponsored: true,
                paymasterUrl: PAYMASTER_URL,
            },
            options: {
                owners: [],
                threshold: 1,
                salt: BigInt('0x' + passkey.rawId)
            }
        });

        const signerAddress = await safe4337Pack.protocolKit.getAddress();

        const safe4337PackWithOwner = await Safe4337Pack.init({
            provider: RPC_URL,
            signer: passkey,
            bundlerUrl: BUNDLER_URL,
            paymasterOptions: {
                isSponsored: true,
                paymasterUrl: PAYMASTER_URL,
            },
            options: {
                owners: [signerAddress],
                threshold: 1,
                salt: BigInt('0x' + passkey.rawId)
            }
        });

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const farmToken = new ethers.Contract(farmTokenAddress, FarmToken.abi, provider);
        const usdc = new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, provider);

        const pricePerToken = await farmToken.pricePerToken();
        const totalCostInUsd = pricePerToken * BigInt(amount);
        const usdcAmount = totalCostInUsd * BigInt(10_000);

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
            ]
        });

        const signedSafeOperation = await safe4337PackWithOwner.signSafeOperation(safeOperation);
        const userOperationHash = await safe4337PackWithOwner.executeTransaction({
            executable: signedSafeOperation
        });

        let userOperationReceipt = null;
        while (!userOperationReceipt) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            userOperationReceipt = await safe4337PackWithOwner.getUserOperationReceipt(
                userOperationHash
            );
        }

        return userOperationHash;
    } catch (error: any) {
        throw error;
    }
}

export async function sellFarmTokensWithUSDC(
    farmTokenAddress: string,
    safeAddress: string,
    amount: number,
    passkey: PasskeyArgType
): Promise<string> {
    try {
        const safe4337Pack = await Safe4337Pack.init({
            provider: RPC_URL,
            signer: passkey,
            bundlerUrl: BUNDLER_URL,
            paymasterOptions: {
                isSponsored: true,
                paymasterUrl: PAYMASTER_URL,
            },
            options: {
                owners: [],
                threshold: 1,
                salt: BigInt('0x' + passkey.rawId)
            }
        });

        const signerAddress = await safe4337Pack.protocolKit.getAddress();

        const safe4337PackWithOwner = await Safe4337Pack.init({
            provider: RPC_URL,
            signer: passkey,
            bundlerUrl: BUNDLER_URL,
            paymasterOptions: {
                isSponsored: true,
                paymasterUrl: PAYMASTER_URL,
            },
            options: {
                owners: [signerAddress],
                threshold: 1,
                salt: BigInt('0x' + passkey.rawId)
            }
        });

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const farmToken = new ethers.Contract(farmTokenAddress, FarmToken.abi, provider);

        const safeOperation = await safe4337PackWithOwner.createTransaction({
            transactions: [{
                to: farmTokenAddress,
                data: farmToken.interface.encodeFunctionData('sellTokensWithUSDC', [amount]),
                value: '0'
            }]
        });

        const signedSafeOperation = await safe4337PackWithOwner.signSafeOperation(safeOperation);
        const userOperationHash = await safe4337PackWithOwner.executeTransaction({
            executable: signedSafeOperation
        });

        let userOperationReceipt = null;
        while (!userOperationReceipt) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            userOperationReceipt = await safe4337PackWithOwner.getUserOperationReceipt(
                userOperationHash
            );
        }

        return userOperationHash;
    } catch (error: any) {
        throw error;
    }
}