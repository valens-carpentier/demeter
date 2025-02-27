'use client'

import { Alert, Link } from '@mui/material'

export default function TestNetworkBanner() {
  return (
    <Alert 
      severity="info"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        borderRadius: 0,
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      The app is currently waiting on Safe Transaction API service to be running again to be usable. This is a test website running on Base Sepolia. Use test USDC from the{' '}
      <Link 
        href="https://faucet.circle.com/" 
        target="_blank" 
        rel="noopener noreferrer" 
        sx={{ 
          color: 'inherit',
          textDecoration: 'underline'
        }}
      >
        Circle Faucet
      </Link>.
    </Alert>
  )
}