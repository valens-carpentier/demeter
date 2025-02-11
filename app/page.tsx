'use client'

import { PasskeyArgType } from '@safe-global/protocol-kit'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import LoginWithPasskey from '../components/LoginwithPasskey'
import SafeAccountDetails from '../components/SafeAccountDetails'
import { createPasskey, storePasskeyInLocalStorage } from '../lib/passkeys'
import TestNetworkBanner from '@/components/TestNetworkBanner'

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
    router.push(`/dashboard?passkeyId=${passkey.rawId}`)
  }

  return (
    <>
      <TestNetworkBanner />
      {selectedPasskey ? (
        <SafeAccountDetails 
          passkey={selectedPasskey} 
          onSafeAddress={(address) => {
            // Handle the safe address if needed, or use empty function
            console.log('Safe address:', address)
          }} 
        />
      ) : (
        <LoginWithPasskey
          handleCreatePasskey={handleCreatePasskey}
          handleSelectPasskey={handleSelectPasskey}
        />
      )}
    </>
  )
}

export default Create4337SafeAccount
