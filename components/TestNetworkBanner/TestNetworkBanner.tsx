'use client'

import { Alert } from '@mui/material'
import styles from './TestNetworkBanner.module.css'

export default function TestNetworkBanner() {
  return (
    <Alert 
      severity="info"
      className={styles.alert}
    >
      This is a test website running on Base Sepolia Testnet. Use test USDC from the <a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer" className={styles.link}>Circle Faucet</a>.
    </Alert>
  )
}