import { ethers } from 'ethers'
import FarmToken from '../../build/contracts/FarmToken.json'
import { RPC_URL } from './constants'
import loadFarms from './farmsUtils'

export interface UserHolding {
  farmName: string;
  tokenSymbol: string;
  tokenBalance: number;
  farmValuation: number;
  userShare: number;
  tokenAddress: string;
  tokenPrice: number;
}

export async function getUserHoldings(safeAddress: string): Promise<UserHolding[]> {
  try {
    // Get all farms first
    const farms = await loadFarms()
    
    // Create provider
    const provider = new ethers.JsonRpcProvider(RPC_URL)
    
    // For each farm, check if user has tokens
    const holdingsPromises = farms.map(async (farm) => {
      const farmToken = new ethers.Contract(
        farm.token,
        FarmToken.abi,
        provider
      )
      
      // Get user's token balance and convert from BigInt
      const balance = await farmToken.balanceOf(safeAddress)
      const decimals = await farmToken.decimals()
      const tokenBalance = Number(ethers.formatUnits(balance, decimals))
      
      // If user has tokens, get additional info
      if (tokenBalance > 0) {
        const symbol = await farmToken.symbol()
        const pricePerToken = await farmToken.pricePerToken()
        
        // Price is in cents, convert to dollars
        const tokenPriceInDollars = Number(pricePerToken) / 100
        
        // Calculate user's share value
        const userShare = tokenBalance * tokenPriceInDollars
        
        return {
          farmName: farm.name,
          tokenSymbol: symbol,
          tokenBalance: tokenBalance,
          farmValuation: farm.valuation,
          userShare: userShare,
          tokenAddress: farm.token,
          tokenPrice: tokenPriceInDollars
        }
      }
      return null
    })
    
    const holdings = await Promise.all(holdingsPromises)
    return holdings.filter((holding): holding is UserHolding => holding !== null)
    
  } catch (error) {
    console.error('Failed to get user holdings:', error)
    throw error
  }
}

export async function getTotalHoldingsValue(safeAddress: string): Promise<number> {
  try {
    const holdings = await getUserHoldings(safeAddress)
    return holdings.reduce((total, holding) => total + holding.userShare, 0)
  } catch (error) {
    console.error('Failed to get total holdings value:', error)
    throw error
  }
}