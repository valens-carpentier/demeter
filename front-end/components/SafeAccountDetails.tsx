import OpenInNewIcon from '@mui/icons-material/OpenInNew'
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

type props = {
  passkey: PasskeyArgType
}

function SafeAccountDetails({ passkey }: props) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [safeAddress, setSafeAddress] = useState<string>()
  const [isSafeDeployed, setIsSafeDeployed] = useState<boolean>(false)
  const [isDeploying, setIsDeploying] = useState<boolean>(false)
  const [userOp, setUserOp] = useState<string>()

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
      setIsSafeDeployed(isSafeDeployed)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to initialize Safe:', error)
      setIsLoading(false)
    }
  }, [passkey])

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

  return (
    <Paper sx={{ margin: '32px auto 0', minWidth: '320px' }}>
      <Stack padding={4} alignItems={'center'}>
        <Typography textAlign={'center'} variant="h1" color={'primary'}>
          Your Account
        </Typography>

        {isLoading || !safeAddress ? (
          <CircularProgress sx={{ margin: '24px 0' }} />
        ) : (
          <>
            <Typography textAlign={'center'}>
              <Link
                href={safeLink}
                target="_blank"
                underline="hover"
                color="text"
              >
                <Tooltip title={safeAddress}>
                  <Stack
                    component={'span'}
                    padding={4}
                    direction={'row'}
                    alignItems={'center'}
                  >
                    <span style={{ margin: '0 8px' }}>
                      {splitAddress(safeAddress)}
                    </span>
                    <OpenInNewIcon />
                  </Stack>
                </Tooltip>
              </Link>
            </Typography>

            {!isSafeDeployed && (
              <>
                <PendingDeploymentLabel />
                <Button
                  variant="contained"
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  sx={{ mt: 2 }}
                >
                  {isDeploying ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Deploy Safe'
                  )}
                </Button>
              </>
            )}

            {userOp && (
              <Typography textAlign={'center'}>
                <Link
                  href={jiffscanLink}
                  target="_blank"
                  underline="hover"
                  color="text"
                >
                  <Stack
                    component={'span'}
                    padding={4}
                    direction={'row'}
                    alignItems={'center'}
                  >
                    {userOp}
                    <OpenInNewIcon />
                  </Stack>
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

function PendingDeploymentLabel() {
  return (
    <div style={{ margin: '12px auto' }}>
      <span
        style={{
          marginRight: '8px',
          borderRadius: '4px',
          padding: '4px 12px',
          border: '1px solid rgb(255, 255, 255)',
          whiteSpace: 'nowrap',
          backgroundColor: 'rgb(240, 185, 11)',
          color: 'rgb(0, 20, 40)'
        }}
      >
        Deployment pending
      </span>
    </div>
  )
}
