import { JsonRpcProvider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { RPC_URL } from './constants'

export async function getBalance(safeAddress: string): Promise<string> {
  if (!safeAddress) throw new Error('Safe address is required')
  
  try {
    const provider = new JsonRpcProvider(RPC_URL)
    const balance = await provider.getBalance(safeAddress)
    const formattedBalance = Number(ethers.formatEther(balance.toString())).toFixed(4)
    return formattedBalance
  } catch (error) {
    console.error('Failed to fetch balance:', error)
    throw error
  }
}
