import FingerprintIcon from '@mui/icons-material/Fingerprint'
import { Button, Paper, Stack, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { PasskeyArgType } from '@safe-global/protocol-kit'
import { loadPasskeysFromLocalStorage } from '../../lib/passkeys'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './Login.module.css'

type props = {
  handleCreatePasskey: () => Promise<void>
  handleSelectPasskey: (passkey: PasskeyArgType) => void
}

function LoginWithPasskey({ handleSelectPasskey }: props) {
  const [passkeys, setPasskeys] = useState<PasskeyArgType[]>([])
  const [selectedPasskeyId, setSelectedPasskeyId] = useState<string>('')

  useEffect(() => {
    const storedPasskeys = loadPasskeysFromLocalStorage()
    setPasskeys(storedPasskeys)
  }, [])

  const handleLogin = () => {
    const passkey = passkeys.find(p => p.rawId === selectedPasskeyId)
    if (passkey) {
      handleSelectPasskey(passkey)
    }
  }

  return (
    <Paper className={styles.paperContainer} elevation={3}>
      <Stack className={styles.stackContainer} spacing={4}>
        <Typography 
          variant="h1" 
          className={styles.title}
          sx={{ 
            color: 'text.primary',
            fontWeight: 700,
            letterSpacing: '-0.025em'
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
              disabled={!selectedPasskeyId}
              fullWidth
              className={styles.loginButton}
              sx={{
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
            >
              Login with Passkey
            </Button>
          </>
        ) : (
          <Typography 
            className={styles.noPasskeysText}
            sx={{ color: 'text.secondary' }}
          >
            No passkeys found. Please create an account first.
          </Typography>
        )}

        <Typography 
          className={styles.signupText}
          sx={{ color: 'text.secondary' }}
        >
          Don&apos;t have an account?{' '}
          <Link 
            href="/signup" 
            className={styles.signupLink}
            style={{ color: 'primary.main' }}
          >
            Sign up
          </Link>
        </Typography>
      </Stack>
    </Paper>
  )
}

export default LoginWithPasskey
