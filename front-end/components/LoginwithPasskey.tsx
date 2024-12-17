import FingerprintIcon from '@mui/icons-material/Fingerprint'
import { Button, Paper, Stack, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { PasskeyArgType } from '@safe-global/protocol-kit'
import { loadPasskeysFromLocalStorage } from '../lib/passkeys'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type props = {
  handleSelectPasskey: (passkey: PasskeyArgType) => {}
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
      margin: '32px auto 0',
      position: 'absolute',
      top: '30%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      maxWidth: '500px'  // Adjust this value based on your needs
    }}>
      <Stack padding={4} spacing={3}>
        <Typography textAlign={'center'} variant="h1" color={'primary'}>
          Connect to your account
        </Typography>

        {passkeys.length > 0 ? (
          <>
            <FormControl fullWidth>
              <InputLabel id="passkey-select-label">Select a Passkey</InputLabel>
              <Select
                labelId="passkey-select-label"
                id="passkey-select"
                value={selectedPasskeyId}
                label="Select a Passkey"
                onChange={(e) => setSelectedPasskeyId(e.target.value)}
              >
                {passkeys.map((passkey, index) => (
                  <MenuItem key={passkey.rawId} value={passkey.rawId}>
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
            >
              Login with Passkey
            </Button>
          </>
        ) : (
          <Typography textAlign="center" color="GrayText">
            No passkeys found. Please create an account first.
          </Typography>
        )}

        <Typography 
          textAlign={'center'} 
          variant="body2" 
          color="GrayText"
        >
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ cursor: 'pointer', textDecoration: 'underline' }}>
            Sign up
          </Link>
        </Typography>
      </Stack>
    </Paper>
  )
}

export default LoginWithPasskey
