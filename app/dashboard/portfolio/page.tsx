'use client'

import { useContext, useEffect, useState } from 'react'
import { SafeAddressContext, PasskeyContext } from '@/app/contexts/SafeContext'
import { getUserHoldings } from '../../../lib/holdingsUtils'
import { useRouter } from 'next/navigation'
import SellModal from '../../../components/SellModal'
import BuyFarmModal from '../../../components/BuyFarmModal'
import { buyFarmTokensWithUSDC } from '../../../lib/tokenUtils'
import { Typography, Box, Card, CardContent, Link, Divider, Button } from '@mui/material'

interface UserHolding {
  farmName: string;
  tokenPrice: number;
  tokenBalance: number;
  userShare: number;
  tokenAddress: string;
  tokenSymbol: string;
  farmValuation: number;
}

export default function Portfolio() {
  const safeAddress = useContext(SafeAddressContext)
  const passkey = useContext(PasskeyContext)
  const router = useRouter()
  const [holdings, setHoldings] = useState<UserHolding[]>([])
  const [loading, setLoading] = useState(true)
  const [openSellModal, setOpenSellModal] = useState(false)
  const [openBuyModal, setOpenBuyModal] = useState(false)
  const [selectedHolding, setSelectedHolding] = useState<UserHolding | null>(null)
  const [buyAmount, setBuyAmount] = useState('')
  const [isBuying, setIsBuying] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string>('')

  useEffect(() => {
    if (passkey) {
      router.push(`/dashboard/portfolio?passkeyId=${passkey.rawId}`)
    }
  }, [passkey, router])

  useEffect(() => {
    const fetchData = async () => {
      if (!safeAddress) return

      try {
        const userHoldings = await getUserHoldings(safeAddress)
        
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
    setSelectedHolding(holding)
    setOpenBuyModal(true)
  }

  const handleBuyConfirm = async () => {
    if (!selectedHolding || !safeAddress || !buyAmount || !passkey) return

    try {
      setIsBuying(true)
      const amount = parseInt(buyAmount)
      const hash = await buyFarmTokensWithUSDC(selectedHolding.tokenAddress, safeAddress, amount, passkey)
      setTransactionHash(hash)
    } catch (error: unknown) {
      console.error('Failed to buy tokens:', error)
      alert(error instanceof Error ? error.message : 'Failed to buy tokens. Please try again.')
      setOpenBuyModal(false)
    } finally {
      setIsBuying(false)
    }
  }

  return (
    <Box sx={{
      padding: 3,
      backgroundColor: '#FFFFFF',
      maxWidth: 1200,
      marginLeft: '5%',
      marginRight: '5%',
      borderRadius: 2,
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)'
    }}>
      <Typography variant="h4" sx={{ 
        color: '#2C3E2D',
        fontWeight: 700,
        mb: 3,
        letterSpacing: '-0.025em'
      }}>
        Portfolio
      </Typography>

      <Typography variant="h5" sx={{ 
        color: '#2C3E2D',
        fontWeight: 600,
        letterSpacing: '-0.025em',
        mb: 3
      }}>
        Wallets
      </Typography>
      <Card sx={{ 
        mb: 3,
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
        }
      }}>
        <CardContent sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1
            }}>
              <Box sx={{
                width: 20,
                height: 20,
                border: '2px solid #5C745D',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} />
              <Typography sx={{ 
                fontFamily: 'monospace',
                color: '#5C745D',
                fontSize: 14,
                px: 1.5,
                py: 1,
                backgroundColor: '#F5F2EA',
                borderRadius: 1
              }}>
                Loading address...
              </Typography>
            </Box>
          ) : (
            <Typography sx={{ 
              fontFamily: 'monospace',
              color: '#5C745D',
              fontSize: 14,
              px: 1.5,
              py: 1,
              backgroundColor: '#F5F2EA',
              borderRadius: 1
            }}>
              Base Sepolia: {safeAddress}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Link
              href={`https://app.safe.global/base-sepolia:${safeAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                color: '#4CAF50',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Link to Safe Wallet
            </Link>
            <Divider orientation="vertical" flexItem />
            <Link
              href={`https://sepolia.basescan.org/address/${safeAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                color: '#4CAF50',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Link to Base Scan
            </Link>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h5" sx={{ 
        color: '#2C3E2D',
        fontWeight: 600,
        letterSpacing: '-0.025em',
        mt: 3,
        mb: 2
      }}>
        Your Holdings
      </Typography>
      <Card sx={{ 
        mt: 3,
        borderRadius: 2
      }}>
        <CardContent>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr) 2fr',
            p: 2,
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            backgroundColor: '#F5F2EA',
            borderRadius: '8px 8px 0 0'
          }}>
            {['Farm Name', 'Token Price', 'Number of Tokens', 'Your Holdings', ''].map((header, index) => (
              <Typography key={index} sx={{ 
                color: '#5C745D',
                fontSize: 14,
                fontWeight: 600,
                p: 1
              }}>
                {header}
              </Typography>
            ))}
          </Box>
          
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              p: 2,
              gap: 1
            }}>
              <Box sx={{
                width: 20,
                height: 20,
                border: '2px solid #5C745D',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} />
            </Box>
          ) : holdings.length > 0 ? (
            holdings.map((holding, index) => (
              <Box key={index} sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr) 2fr',
                p: 2,
                borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                transition: 'background-color 0.2s ease',
                alignItems: 'center',
                '&:hover': {
                  backgroundColor: '#F5F2EA'
                }
              }}>
                <Typography sx={{ 
                  color: '#2C3E2D',
                  fontSize: 14,
                  p: 1,
                  fontWeight: 500
                }}>
                  {holding.farmName}
                </Typography>
                <Typography sx={{ 
                  color: '#4CAF50',
                  fontSize: 14,
                  p: 1,
                  fontWeight: 600
                }}>
                  ${holding.tokenPrice}
                </Typography>
                <Typography sx={{ 
                  fontFamily: 'monospace',
                  fontSize: 14,
                  p: 1,
                  fontWeight: 500
                }}>
                  {holding.tokenBalance}
                </Typography>
                <Typography sx={{ 
                  fontWeight: 600,
                  color: '#2C3E2D',
                  fontSize: 14,
                  p: 1
                }}>
                  ${holding.userShare.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  justifyContent: 'flex-end'
                }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'none',
                      minWidth: 80,
                      '&:hover': {
                        backgroundColor: '#2E7D32'
                      }
                    }}
                    onClick={() => handleSellClick(holding)}
                  >
                    Sell
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'none',
                      minWidth: 80,
                      '&:hover': {
                        backgroundColor: '#2E7D32'
                      }
                    }}
                    onClick={() => handleBuyClick(holding)}
                  >
                    Buy
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography sx={{ 
              textAlign: 'center',
              color: '#5C745D',
              p: 4,
              fontSize: 16
            }}>
              No assets found in your portfolio
            </Typography>
          )}
        </CardContent>
      </Card>

      <BuyFarmModal
        open={openBuyModal}
        onClose={() => {
          setOpenBuyModal(false)
          setTransactionHash('')
          setBuyAmount('')
        }}
        selectedFarm={{
          name: selectedHolding?.farmName || '',
          token: selectedHolding?.tokenAddress || '',
          pricePerToken: selectedHolding?.tokenPrice || 0
        }}
        buyAmount={buyAmount}
        onBuyAmountChange={(value) => setBuyAmount(value)}
        onBuyConfirm={handleBuyConfirm}
        isBuying={isBuying}
        transactionHash={transactionHash}
      />

      <SellModal
        open={openSellModal}
        onClose={() => setOpenSellModal(false)}
        holding={selectedHolding}
        safeAddress={safeAddress || ''}
        passkey={passkey!}
      />

    </Box>
  )
}
