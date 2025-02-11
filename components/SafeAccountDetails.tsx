import {
  Button,
  CircularProgress,
  Link,
  Paper,
  Stack,
  Tooltip,
  Typography,
  Box
} from '@mui/material'
import { PasskeyArgType } from '@safe-global/protocol-kit'
import { Safe4337Pack } from '@safe-global/relay-kit'
import { useCallback, useEffect, useState } from 'react'
import { BUNDLER_URL, PAYMASTER_URL, RPC_URL } from '@/lib/constants'
import { executeSafeDeployment } from '@/lib/deployment'
import { getUSDCBalance } from '@/lib/balanceUtils'
import { InfoOutlined } from '@mui/icons-material'

type props = {
  passkey: PasskeyArgType
  onSafeAddress: (address: string) => void
}

function SafeAccountDetails({ passkey, onSafeAddress }: props) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [safeAddress, setSafeAddress] = useState<string>()
  const [isSafeDeployed, setIsSafeDeployed] = useState<boolean>(false)
  const [isDeploying, setIsDeploying] = useState<boolean>(false)
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false)
  const [usdcBalance, setUsdcBalance] = useState<string>()

  const showSafeInfo = useCallback(async () => {
    setIsLoading(true)

    try {
      // Initialize Safe4337Pack with just the signer
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
        }
      })

      // Get the signer's address from the protocolKit
      const signerAddress = await safe4337Pack.protocolKit.getAddress()

      // Reinitialize with the correct owner
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
        }
      })

      const safeAddress = await safe4337PackWithOwner.protocolKit.getAddress()
      const isSafeDeployed = await safe4337PackWithOwner.protocolKit.isSafeDeployed()

      setSafeAddress(safeAddress)
      onSafeAddress(safeAddress)
      setIsSafeDeployed(isSafeDeployed)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to initialize Safe:', error)
      setIsLoading(false)
    }
  }, [passkey, onSafeAddress])

  useEffect(() => {
    showSafeInfo()
  }, [showSafeInfo])

  const handleDeploy = async () => {
    if (!safeAddress) return

    try {
      setIsDeploying(true)
      await executeSafeDeployment({
        signer: passkey,
        safeAddress
      })
      await showSafeInfo()
    } catch (error) {
      console.error('Deployment failed:', error)
    } finally {
      setIsDeploying(false)
    }
  }

  const safeLink = `https://app.safe.global/home?safe=basesep:${safeAddress}`
  
  useEffect(() => {
    const fetchBalances = async () => {
      if (!safeAddress) return
      try {
        setBalanceLoading(true)
        const balance = await getUSDCBalance(safeAddress)
        console.log('Fetched USDC balance:', balance) // Debugging
        setUsdcBalance(balance)
      } catch (error) {
        console.error('Failed to fetch balances:', error)
        setUsdcBalance('0.00')
      } finally {
        setBalanceLoading(false)
      }
    }

    // Add a small delay to ensure the safe is fully initialized
    const timer = setTimeout(() => {
      fetchBalances()
    }, 1000)

    return () => clearTimeout(timer)
  }, [safeAddress])

  return (
    <Paper sx={{
      padding: 3,
      backgroundColor: '#FFFFFF',
      borderRadius: 2,
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
      alignItems: 'center',
    }}>
      <Stack spacing={1} direction="column" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
           <Typography variant="body1" sx={{
            color: '#2C3E2D',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '-0.01em'
          }}>
            Balance
          </Typography>
        </Stack>

        {isLoading || balanceLoading ? (
          <CircularProgress size={12} sx={{ 
            margin: '4px auto',
            color: '#5C745D',
            alignSelf: 'center'
          }} />
        ) : (
          <>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <Typography sx={{
                color: '#2C3E2D',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '-0.01em',
                lineHeight: '28px',
                mb: 0.5
              }}>
                ${usdcBalance || '0.00'}
              </Typography>
                    <Tooltip title={
                  <span>
                    Your USDC balance available to buy farm tokens. <br/>
                    Get free USDC from the <Link 
                      href="https://faucet.circle.com/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      sx={{ color: 'primary.main', textDecoration: 'underline' }}
                    >
                      Circle Faucet
                    </Link>.
                  </span>
                    }>
                  <InfoOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                </Tooltip>
            </Stack>

            <Typography textAlign="center" fontSize="0.875rem">
              <Link
                href={safeLink}
                target="_blank"
                underline="hover"
                color="text.secondary"
                textTransform="lowercase"
              >
                <Tooltip title={safeAddress}>
                  <Box component="span" sx={{
                    fontFamily: 'monospace',
                    color: '#5C745D',
                    fontSize: 12
                  }}>
                    {splitAddress(safeAddress || '')}
                  </Box>
                </Tooltip>
              </Link>
            </Typography>

            {!isSafeDeployed && (
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                <Button
                  variant="contained"
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  sx={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    textTransform: 'none',
                    fontSize: 14,
                    fontWeight: 500,
                    padding: '12px 24px',
                    borderRadius: '6px',
                    minWidth: 150,
                    height: 48,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#2E7D32',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    },
                    '&:disabled': {
                      backgroundColor: '#81C784',
                      color: 'rgba(255, 255, 255, 0.8)',
                      cursor: 'not-allowed',
                      transform: 'none',
                      boxShadow: 'none'
                    }
                  }}
                >
                  {isDeploying ? (
                    <>
                      <CircularProgress size={20} color="inherit" />
                      Activating...
                    </>
                  ) : (
                    'Activate your account'
                  )}
                </Button>
              </Stack>
            )}
          </>
        )}
      </Stack>
    </Paper>
  )
}

export default SafeAccountDetails

const DEFAULT_CHAR_DISPLAYED = 6

function splitAddress(
  address: string,
  charDisplayed: number = DEFAULT_CHAR_DISPLAYED
): string {
  const firstPart = address.slice(0, charDisplayed)
  const lastPart = address.slice(address.length - charDisplayed)

  return `${firstPart}...${lastPart}`
}