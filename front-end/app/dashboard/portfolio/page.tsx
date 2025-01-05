'use client'

import { useContext, useEffect, useState } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Link as MuiLink, 
  Divider 
} from '@mui/material'
import { SafeAddressContext, PasskeyContext } from '../layout'
import { getUserHoldings, getTotalHoldingsValue } from '../../../lib/holdingsUtils'
import { getBalance } from '../../../lib/balanceUtils'
import { useRouter } from 'next/navigation'
import '@/styles/portfolio.css'

interface UserHolding {
  farmName: string;
  tokenPrice: number;
  tokenBalance: number;
  userShare: number;
}

export default function Portfolio() {
  const safeAddress = useContext(SafeAddressContext)
  const passkey = useContext(PasskeyContext)
  const router = useRouter()
  const [balance, setBalance] = useState<string>('0.00')
  const [holdings, setHoldings] = useState<UserHolding[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (passkey) {
      router.push(`/dashboard/portfolio?passkeyId=${passkey.rawId}`)
    }
  }, [passkey, router])

  useEffect(() => {
    const fetchData = async () => {
      if (!safeAddress) return

      try {
        const balanceUSD = await getBalance(safeAddress)
        const userHoldings = await getUserHoldings(safeAddress)
        
        setBalance(balanceUSD || '0.00')
        setHoldings(userHoldings)
      } catch (error) {
        console.error('Error fetching portfolio data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [safeAddress])

  return (
    <Box className="portfolio-container">
      <Typography className="portfolio-title" variant="h4">
        Portfolio
      </Typography>

      {/* Wallets Card */}
      <Typography variant="h6" sx={{ mb: 2 }} className="title">Wallets</Typography>
      <Paper className="wallet-card">
        <Box sx={{ p: 3 }}>
          <Box className="wallet-container">
            <Typography className="wallet-address">
              Base Sepolia: {safeAddress}
            </Typography>
            <Box className="wallet-links">
              <MuiLink 
                href={`https://app.safe.global/base-sepolia:${safeAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="wallet-link"
              >
                Link to Safe Wallet
              </MuiLink>
              <Divider orientation="vertical" flexItem className="divider" />
              <MuiLink 
                href={`https://sepolia.basescan.org/address/${safeAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="wallet-link"
              >
                Link to Base Scan
              </MuiLink>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Assets Card */}
      <Typography variant="h6" sx={{ mb: 2 }} className="title">Your Holdings</Typography>
      <Paper className="assets-card">
        <Box className="assets-header">
          <Typography className="header-cell">Farm Name</Typography>
          <Typography className="header-cell">Token Price</Typography>
          <Typography className="header-cell">Number of Tokens</Typography>
          <Typography className="header-cell">Your Holdings</Typography>
        </Box>
        
        {holdings.length > 0 ? (
          holdings.map((holding, index) => (
            <Box key={index} className="asset-row">
              <Typography className="asset-cell">{holding.farmName}</Typography>
              <Typography className="asset-cell">
                ${holding.tokenPrice}
              </Typography>
              <Typography className="asset-cell">
                {holding.tokenBalance}
              </Typography>
              <Typography className="asset-cell">
              ${holding.userShare.toLocaleString(undefined, {
                     minimumFractionDigits: 2,
                     maximumFractionDigits: 2
                        })}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography className="no-assets-message">
            No assets found in your portfolio
          </Typography>
        )}
      </Paper>
    </Box>
  )
}
