'use client'

import { useContext, useEffect } from 'react'
import FarmList from '@/components/FarmList'
import HoldingList from '@/components/HoldingList'
import { PasskeyContext } from '@/app/contexts/SafeContext'
import { useRouter } from 'next/navigation'
import { Stack } from '@mui/material'
import theme from '@/styles/global/theme'
export default function DashboardPage() {
  const passkey = useContext(PasskeyContext)
  const router = useRouter()

  useEffect(() => {
    if (passkey) {
      router.push(`/dashboard?passkeyId=${passkey.rawId}`)
    }
  }, [passkey, router])
  
  return (
      <Stack spacing={3} sx={{ 
        width: '95%',
        height: '100%',
        padding: 3,
        backgroundColor: theme.palette.background.paper,
      }}>
        <HoldingList />
        <FarmList />
      </Stack>
  )
}