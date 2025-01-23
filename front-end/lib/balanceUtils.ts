import { JsonRpcProvider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { RPC_URL, USDC_CONTRACT_ADDRESS } from './constants'
  
export async function getBalance(safeAddress: string): Promise<string> {
  if (!safeAddress) throw new Error('Safe address is required')
  
  try {
    const provider = new JsonRpcProvider(RPC_URL)
    const balance = await provider.getBalance(safeAddress)
    const formattedBalance = Number(ethers.formatEther(balance.toString())).toFixed(4)
    return formattedBalance
  } catch (error) {
    console.error('Failed to fetch ETH balance:', error)
    throw error
  }
}

export async function getUSDCBalance(safeAddress: string): Promise<string> {
  if (!safeAddress) throw new Error('Safe address is required')
  
  try {
    const provider = new JsonRpcProvider(RPC_URL)
    const usdcContract = new ethers.Contract(
      USDC_CONTRACT_ADDRESS,
      ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
      provider
    )
    
    const decimals = await usdcContract.decimals()
    const balance = await usdcContract.balanceOf(safeAddress)
    const formattedBalance = Number(ethers.formatUnits(balance, decimals)).toFixed(2)
    return formattedBalance
  } catch (error) {
    console.error('Failed to fetch USDC balance:', error)
    throw error
  }
}
