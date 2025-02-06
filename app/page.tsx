'use client'

import { PasskeyArgType } from '@safe-global/protocol-kit'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import LoginWithPasskey from '../components/Login/LoginwithPasskey'
import SafeAccountDetails from '../components/SafeAccountDetails/SafeAccountDetails'
import { createPasskey, storePasskeyInLocalStorage } from '../lib/passkeys'
import TestNetworkBanner from '@/components/TestNetworkBanner/TestNetworkBanner'

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
        <SafeAccountDetails passkey={selectedPasskey} />
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
