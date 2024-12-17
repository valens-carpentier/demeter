'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createPasskey, storePasskeyInLocalStorage } from '@/lib/passkeys'
import SignUpWithPasskeys from '@/components/SignUpwithPasskeys'
import SafeThemeProvider from '@/components/ThemeProvider'
import { Theme, ThemeProvider } from '@mui/material'

export default function SignupPage() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  async function handleCreatePasskey() {
    setIsCreating(true)
    try {
      const passkey = await createPasskey()
      storePasskeyInLocalStorage(passkey)
      router.push(`/dashboard?passkeyId=${passkey.rawId}`)
    } catch (error) {
      console.error('Failed to create passkey:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <SafeThemeProvider>
      {(safeTheme: Theme) => (
        <ThemeProvider theme={safeTheme}>
          <SignUpWithPasskeys 
            handleCreatePasskey={handleCreatePasskey} 
            isCreating={isCreating} 
          />
        </ThemeProvider>
      )}
    </SafeThemeProvider>
  )
}