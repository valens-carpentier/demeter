'use client'

import type { Theme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material/styles'
import { PasskeyArgType } from '@safe-global/protocol-kit'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import LoginWithPasskey from '@/components/LoginwithPasskey'
import SafeAccountDetails from '@/components/SafeAccountDetails'
import SafeThemeProvider from '@/components/ThemeProvider'
import { createPasskey, storePasskeyInLocalStorage } from '../lib/passkeys'

function Create4337SafeAccount() {
  const router = useRouter()
  const [selectedPasskey, setSelectedPasskey] = useState<PasskeyArgType>()

  async function handleCreatePasskey() {
    const passkey = await createPasskey()

    storePasskeyInLocalStorage(passkey)
    setSelectedPasskey(passkey)
    router.push('/dashboard')
  }

  async function handleSelectPasskey(passkey: PasskeyArgType) {
    setSelectedPasskey(passkey)
    router.push('/dashboard')
  }

  return (
    <SafeThemeProvider>
      {(safeTheme: Theme) => (
        <ThemeProvider theme={safeTheme}>
          <LoginWithPasskey
            handleCreatePasskey={handleCreatePasskey}
            handleSelectPasskey={handleSelectPasskey}
          />
        </ThemeProvider>
      )}
    </SafeThemeProvider>
  )
}

export default Create4337SafeAccount
