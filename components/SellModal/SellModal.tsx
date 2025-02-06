import { useState } from 'react'
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material'
import { UserHolding } from '../../lib/holdingsUtils'
import { sellFarmTokensWithUSDC } from '../../lib/tokenUtils'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Link from 'next/link'
import styles from './SellModal.module.css'
import { PasskeyArgType } from '@safe-global/protocol-kit'

interface SellModalProps {
    open: boolean
    onClose: () => void
    holding: UserHolding | null
    safeAddress: string
    passkey: PasskeyArgType
}

export default function SellModal({
    open,
    onClose,
    holding,
    safeAddress,
    passkey,
}: SellModalProps) {
    const [sellAmount, setSellAmount] = useState('')
    const [isSelling, setIsSelling] = useState(false)
    const [transactionHash, setTransactionHash] = useState<string>('')

    const handleSell = async () => {
        if (!holding || !safeAddress || !sellAmount || !passkey) return

        try {
            setIsSelling(true)
            const amount = parseInt(sellAmount)
            const hash = await sellFarmTokensWithUSDC(holding.tokenAddress, safeAddress, amount, passkey)
            setTransactionHash(hash)
        } catch (error: any) {
            console.error('Failed to sell tokens:', error)
            alert(error.message || 'Failed to sell tokens. Please try again.')
        } finally {
            setIsSelling(false)
        }
    }

    const renderContent = () => {
        if (transactionHash) {
            return (
                <Box className={styles.transactionSuccessContainer}>
                    <CheckCircleIcon className={styles.successIcon} />
                    <Typography variant="h6" sx={{ textAlign: 'center' }}>
                        Transaction Successful!
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        Your sale has been confirmed. You can view the transaction details below:
                    </Typography>
                    <Link 
                        href={`https://jiffyscan.xyz/userOpHash/${transactionHash}?network=base-sepolia`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.transactionLink}
                    >
                        {transactionHash}
                    </Link>
                    <Button
                        variant="contained"
                        onClick={onClose}
                        className={styles.sellButton}
                    >
                        Close
                    </Button>
                </Box>
            )
        }

        if (isSelling) {
            return (
                <Box className={styles.processingContainer}>
                    <CircularProgress size={48} className={styles.processingSpinner} />
                    <Typography variant="h6">
                        Processing Transaction
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Please wait while we process your sale...
                    </Typography>
                </Box>
            )
        }

        return (
            <>
                <Typography className={styles.sellModalTitle}>
                    Sell
                </Typography>
                <Box className={styles.sellModalContent}>
                    <Box className={styles.sellModalRow}>
                        <Typography className={styles.sellModalLabel}>Current Balance:</Typography>
                        <Typography className={styles.sellModalValue}>
                            {holding?.tokenBalance || 0}
                        </Typography>
                    </Box>
                    <Box className={styles.sellModalRow}>
                        <Typography className={styles.sellModalLabel}>Token Price:</Typography>
                        <Typography className={styles.sellModalValue}>
                            ${holding?.tokenPrice || 0}
                        </Typography>
                    </Box>
                    <Box className={styles.sellModalRow}>
                        <Typography className={styles.sellModalLabel}>Number of Tokens:</Typography>
                        <Box className={styles.sellModalCounter}>
                            <Button 
                                size="small" 
                                className={styles.counterButton}
                                onClick={() => setSellAmount(String(Math.max(0, Number(sellAmount || 0) - 1)))}
                            >
                                -
                            </Button>
                            <Typography className={styles.sellModalValue}>{sellAmount || '0'}</Typography>
                            <Button
                                size="small"
                                className={styles.counterButton}
                                onClick={() => setSellAmount(String(Math.min(holding?.tokenBalance || 0, Number(sellAmount || 0) + 1)))}
                            >
                                +
                            </Button>
                        </Box>
                    </Box>
                    <Box className={styles.sellModalRow}>
                        <Typography className={styles.sellModalLabel}>Total Value:</Typography>
                        <Typography className={styles.sellModalValue}>
                            ${holding && sellAmount ? (holding.tokenPrice * Number(sellAmount)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        className={`${styles.sellButton} ${styles.usdcButton}`}
                        onClick={handleSell}
                        disabled={isSelling || !sellAmount || parseInt(sellAmount) < 1 || parseInt(sellAmount) > (holding?.tokenBalance || 0)}
                    >
                        Proceed
                    </Button>
                </Box>
            </>
        )
    }

    return (
        <Modal
            open={open}
            onClose={!isSelling && !transactionHash ? onClose : undefined}
            aria-labelledby="sell-token-modal"
        >
            <Box className={styles.sellModal}>
                {renderContent()}
            </Box>
        </Modal>
    )
}