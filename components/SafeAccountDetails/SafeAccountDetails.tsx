import {
  Button,
  CircularProgress,
  Link,
  Paper,
  Stack,
  Tooltip,
  Typography
} from '@mui/material'
import { PasskeyArgType } from '@safe-global/protocol-kit'
import { Safe4337Pack } from '@safe-global/relay-kit'
import { useCallback, useEffect, useState } from 'react'
import { BUNDLER_URL, PAYMASTER_URL, RPC_URL } from '@/lib/constants'
import { executeSafeDeployment } from '@/lib/deployment'
import styles from './SafeAccountDetails.module.css'
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
    <Paper className={styles.container}>
      <Stack className={styles.stack}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <Typography className={styles.balanceTitle}>
            Balance
          </Typography>
          <Tooltip title={
            <span>
              Your USDC balance available to buy farm tokens. <br/>
              Get free USDC from the <a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'primary.main', textDecoration: 'underline' }}>Circle Faucet</a>.
            </span>
          }>
            <InfoOutlined sx={{ fontSize: 16, color: '#5C745D' }} />
          </Tooltip>
        </Stack>

        {isLoading || balanceLoading ? (
          <CircularProgress size={12} className={styles.loading}/>
        ) : (
          <>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <Typography className={styles.balanceValue}>
                ${usdcBalance || '0.00'}
              </Typography>
            </Stack>

            <Typography textAlign={'center'} fontSize="0.875rem">
              <Link
                href={safeLink}
                target="_blank"
                underline="hover"
                color="text"
                textTransform="lowercase"
              >
                <Tooltip title={safeAddress}>
                  <span className={styles.addressContainer}>
                    {splitAddress(safeAddress || '')}
                  </span>
                </Tooltip>
              </Link>
            </Typography>

            {!isSafeDeployed && (
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                <Button
                  variant="contained"
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className={styles.deployButton}
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