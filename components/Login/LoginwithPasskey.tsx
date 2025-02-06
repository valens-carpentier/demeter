import FingerprintIcon from '@mui/icons-material/Fingerprint'
import { Button, Paper, Stack, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { PasskeyArgType } from '@safe-global/protocol-kit'
import { loadPasskeysFromLocalStorage } from '../../lib/passkeys'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './Login.module.css'

type props = {
  handleSelectPasskey: (passkey: PasskeyArgType) => {}
}

function LoginWithPasskey({ handleSelectPasskey }: props) {
  const [passkeys, setPasskeys] = useState<PasskeyArgType[]>([])
  const [selectedPasskeyId, setSelectedPasskeyId] = useState<string>('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    const storedPasskeys = loadPasskeysFromLocalStorage()
    setPasskeys(storedPasskeys)
  }, [])

  const handleLogin = async () => {
    setIsLoggingIn(true)
    try {
      const passkey = passkeys.find(p => p.rawId === selectedPasskeyId)
      if (passkey) {
        await handleSelectPasskey(passkey)
      }
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <Paper className={styles.paperContainer} elevation={3}>
      <Stack padding={4} spacing={3}>
        <Typography 
          variant="h1"
          sx={{ 
            color: 'text.primary',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            textAlign: 'center',
            mb: 2
          }}
        >
          Connect to your account
        </Typography>

        {passkeys.length > 0 ? (
          <>
            <FormControl fullWidth>
              <InputLabel 
                id="passkey-select-label"
                sx={{ color: 'text.secondary' }}
              >
                Select a Passkey
              </InputLabel>
              <Select
                labelId="passkey-select-label"
                id="passkey-select"
                value={selectedPasskeyId}
                label="Select a Passkey"
                onChange={(e) => setSelectedPasskeyId(e.target.value)}
                sx={{
                  '& .MuiSelect-select': {
                    color: 'text.primary'
                  }
                }}
              >
                {passkeys.map((passkey, index) => (
                  <MenuItem 
                    key={passkey.rawId} 
                    value={passkey.rawId}
                    sx={{ color: 'text.primary' }}
                  >
                    Passkey {index + 1} - ID: {passkey.rawId.slice(0, 10)}...
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              startIcon={<FingerprintIcon />}
              variant="contained"
              onClick={handleLogin}
              disabled={!selectedPasskeyId || isLoggingIn}
              fullWidth
              sx={{
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                },
                mt: 2
              }}
            >
              {isLoggingIn ? 'Logging in...' : 'Login with Passkey'}
            </Button>
          </>
        ) : (
          <Typography 
            sx={{ 
              color: 'text.secondary',
              textAlign: 'center',
              my: 2
            }}
          >
            No passkeys found. Please create an account first.
          </Typography>
        )}

        <Typography 
          sx={{ 
            color: 'text.secondary',
            textAlign: 'center',
            mt: 2
          }}
        >
          Don&apos;t have an account?{' '}
          <Link 
            href="/signup" 
            style={{ 
              color: 'primary.main',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Sign up
          </Link>
        </Typography>
      </Stack>
    </Paper>
  )
}

export default LoginWithPasskey
