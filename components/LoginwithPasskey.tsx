import FingerprintIcon from '@mui/icons-material/Fingerprint'
import { Button, Paper, Stack, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { PasskeyArgType } from '@safe-global/protocol-kit'
import { loadPasskeysFromLocalStorage } from '../lib/passkeys'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import theme from '@/styles/global/theme'
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
    <Paper sx={{
      position: 'absolute',
      top: '30%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      maxWidth: 500,
      padding: 4,
      margin: '32px auto 0'
    }}>
      <Stack spacing={4} sx={{ padding: 4 }}>
        <Typography 
          variant="h1" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            textAlign: 'center',
            mb: 3
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
              sx={{
                backgroundColor: 'primary.main',
                mt: 3,
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
            sx={{ 
              color: 'text.secondary',
              textAlign: 'center',
              my: 3
            }}
          >
            No passkeys found. Please create an account first.
          </Typography>
        )}

        <Typography 
          variant="body2" 
          sx={{
            textAlign: 'center',
            color: theme.palette.text.secondary
          }}
        >
          Don&apos;t have an account?{' '}
          <Link 
            href="/signup" 
            style={{ 
              color: theme.palette.primary.main,
              cursor: 'pointer',
              textDecoration: 'underline'
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
