import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Link from 'next/link'
import styles from './BuyFarmModal.module.css'

interface BuyFarmModalProps {
    open: boolean
    onClose: () => void
    selectedFarm: {
        name: string
        token: string
        pricePerToken: number
    }
    buyAmount: string
    onBuyAmountChange: (value: string) => void
    onBuyConfirm: () => Promise<void>
    isBuying: boolean
    transactionHash?: string
}

export default function BuyFarmModal({
    open,
    onClose,
    selectedFarm,
    buyAmount,
    onBuyAmountChange,
    onBuyConfirm,
    isBuying,
    transactionHash
}: BuyFarmModalProps) {
    const renderContent = () => {
        if (transactionHash) {
            return (
                <Box className={styles.transactionSuccessContainer}>
                    <CheckCircleIcon className={styles.successIcon} />
                    
                    <Typography variant="h6" sx={{ textAlign: 'center' }}>
                        Transaction Successful!
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        Your purchase has been confirmed. You can view the transaction details below:
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
                        className={styles.buyButton}
                    >
                        Close
                    </Button>
                </Box>
            )
        }

        if (isBuying) {
            return (
                <Box className={styles.processingContainer}>
                    <CircularProgress size={48} className={styles.processingSpinner} />
                    <Typography variant="h6">
                        Processing Transaction
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Please wait while we process your purchase...
                    </Typography>
                </Box>
            )
        }

        return (
            <>
                <Typography className={styles.buyModalTitle}>
                    Your order
                </Typography>
                <Box className={styles.buyModalContent}>
                    <Box className={styles.buyModalRow}>
                        <Typography className={styles.buyModalLabel}>Farm Name:</Typography>
                        <Typography className={styles.buyModalValue}>{selectedFarm?.name}</Typography>
                    </Box>
                    <Box className={styles.buyModalRow}>
                        <Typography className={styles.buyModalLabel}>Number of Tokens:</Typography>
                        <Box className={styles.buyModalCounter}>
                            <Button 
                                size="small" 
                                className={styles.counterButton}
                                onClick={() => onBuyAmountChange(String(Math.max(0, Number(buyAmount || 0) - 1)))}
                            >
                                -
                            </Button>
                            <Typography className={styles.buyModalValue}>{buyAmount || '0'}</Typography>
                            <Button
                                size="small"
                                className={styles.counterButton}
                                onClick={() => onBuyAmountChange(String(Number(buyAmount || 0) + 1))}
                            >
                                +
                            </Button>
                        </Box>
                    </Box>
                    <Box className={styles.buyModalRow}>
                        <Typography className={styles.buyModalLabel}>Total Price:</Typography>
                        <Typography className={styles.buyModalValue}>
                            ${selectedFarm && buyAmount ? (selectedFarm.pricePerToken * Number(buyAmount)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        className={styles.buyButton}
                        onClick={onBuyConfirm}
                        disabled={isBuying || !buyAmount}
                    >
                        Pay with USDC
                    </Button>
                </Box>
            </>
        )
    }

    return (
        <Modal
            open={open}
            onClose={!isBuying && !transactionHash ? onClose : undefined}
            aria-labelledby="buy-token-modal"
        >
            <Box className={styles.buyModal}>
                {renderContent()}
            </Box>
        </Modal>
    )
}