'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createPasskey, storePasskeyInLocalStorage } from '@/lib/passkeys'
import SignUpWithPasskeys from '@/components/SignUp/SignUpwithPasskeys'
import TestNetworkBanner from '@/components/TestNetworkBanner/TestNetworkBanner'

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
    <div>
      <div>
        <TestNetworkBanner />
        <SignUpWithPasskeys 
          handleCreatePasskey={handleCreatePasskey} 
          isCreating={isCreating} 
        />
      </div>
    </div>
  )
}