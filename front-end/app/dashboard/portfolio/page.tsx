'use client'

import { useContext, useEffect, useState } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  Link as MuiLink, 
  Divider, 
  CircularProgress,
  Button
} from '@mui/material'
import { SafeAddressContext, PasskeyContext } from '../layout'
import { getUserHoldings } from '../../../lib/holdingsUtils'
import { getBalance } from '../../../lib/balanceUtils'
import { useRouter } from 'next/navigation'
import '@/styles/portfolio.css'
import SellModal from '../../../components/SellModal'

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
  const [openSellModal, setOpenSellModal] = useState(false)
  const [selectedHolding, setSelectedHolding] = useState<UserHolding | null>(null)

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

  const handleSellClick = (holding: UserHolding) => {
    setSelectedHolding(holding)
    setOpenSellModal(true)
  }

  const handleBuyClick = (holding: UserHolding) => {
    setSelectedBuyHolding(holding)
    setOpenBuyModal(true)
  }
  

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
            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2 
              }}>
                <CircularProgress size={20} sx={{ color: '#5C745D' }} />
                <Typography className="wallet-address">
                  Loading address...
                </Typography>
              </Box>
            ) : (
              <Typography className="wallet-address">
                Base Sepolia: {safeAddress}
              </Typography>
            )}
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

      <Typography variant="h6" sx={{ mb: 2 }} className="title">Your Holdings</Typography>
      <Paper className="assets-card">
        <Box className="assets-header">
          <Typography className="header-cell">Farm Name</Typography>
          <Typography className="header-cell">Token Price</Typography>
          <Typography className="header-cell">Number of Tokens</Typography>
          <Typography className="header-cell">Your Holdings</Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            p: 4 
          }}>
            <CircularProgress size={24} sx={{ color: '#5C745D' }} />
          </Box>
        ) : (
          holdings.length > 0 ? (
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
                <Box className="button-container">
                  <Button 
                    variant="contained"
                    className="sell-button"
                    onClick={() => handleSellClick(holding)}
                  >
                    Sell
                  </Button>
                  <Button 
                    variant="contained"
                    className="buy-button"
                    onClick={() => handleBuyClick(holding)}
                  >
                    Buy
                  </Button>
                </Box>
              </Box>
              
            ))
          ) : (
            <Typography className="no-assets-message">
              No assets found in your portfolio
            </Typography>
          )
        )}
      </Paper>

      <SellModal
        open={openSellModal}
        onClose={() => setOpenSellModal(false)}
        holding={selectedHolding}
        safeAddress={safeAddress}
        passkey={passkey}
      />

    </Box>
  )
}
