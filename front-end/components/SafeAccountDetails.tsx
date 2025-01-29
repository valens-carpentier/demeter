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
import { BUNDLER_URL, CHAIN_NAME, RPC_URL } from '../lib/constants'
import { executeSafeDeployment } from '../lib/deployment'
import styles from '@/styles/safeaccountdetails.module.css'
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
  const [userOp, setUserOp] = useState<string>()
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
        options: {
          owners: [],
          threshold: 1,
          salt: BigInt('0x' + passkey.rawId)
        }
      })

      // Get the signer's address from the protocolKit
      const signerAddress = await safe4337Pack.protocolKit.getAddress()

      // Reinitialize with the correct owner
      const safe4337PackWithOwner = await Safe4337Pack.init({
        provider: RPC_URL,
        signer: passkey,
        bundlerUrl: BUNDLER_URL,
        options: {
          owners: [signerAddress],
          threshold: 1,
          salt: BigInt('0x' + passkey.rawId)
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
      const hash = await executeSafeDeployment({
        signer: passkey,
        safeAddress
      })
      setUserOp(hash)
      await showSafeInfo() // Refresh the deployment status
    } catch (error) {
      console.error('Deployment failed:', error)
    } finally {
      setIsDeploying(false)
    }
  }

  const safeLink = `https://app.safe.global/home?safe=basesep:${safeAddress}`
  const jiffscanLink = `https://jiffyscan.xyz/userOpHash/${userOp}?network=${CHAIN_NAME}`
  
  useEffect(() => {
    const fetchBalances = async () => {
      if (!safeAddress) return
      try {
        setBalanceLoading(true)
        const balance = await getUSDCBalance(safeAddress)
        setUsdcBalance(balance)
      } catch (error) {
        console.error('Failed to fetch balances:', error)
        setUsdcBalance('0.00')
      } finally {
        setBalanceLoading(false)
      }
    }

    fetchBalances()
  }, [safeAddress])

  return (
    <Paper className={styles.container}>
      <Stack className={styles.stack}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <Typography className={styles.balanceTitle}>
            Balance
          </Typography>
          <Tooltip title="This is your USDC balance available to buy farm tokens">
            <InfoOutlined sx={{ fontSize: 16, color: '#5C745D' }} />
          </Tooltip>
        </Stack>

        {isLoading || balanceLoading ? (
          <CircularProgress className={styles.loading}/>
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
              >
                <Tooltip title={safeAddress}>
                  <span className={styles.addressContainer}>
                    {splitAddress(safeAddress)}
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
                    <CircularProgress size={4} color="inherit" />
                  ) : (
                    'Deploy your Wallet'
                  )}
                </Button>
                <Tooltip title="Please send ETH to the wallet address then click on 'Deploy your Wallet' button">
                  <InfoOutlined sx={{ fontSize: 16, color: '#5C745D' }} />
                </Tooltip>
              </Stack>
            )}

            {userOp && (
              <Typography textAlign={'center'} fontSize="0.875rem">
                <Link
                  href={jiffscanLink}
                  target="_blank"
                  underline="hover"
                  color="text"
                >
                  <span className={styles.addressContainer}>
                    {userOp}
                  </span>
                </Link>
              </Typography>
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