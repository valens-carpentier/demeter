import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material'
import { Farm } from '../types/farm'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Link from 'next/link'
import '../styles/buy-modal.css'

interface BuyFarmModalProps {
    open: boolean
    onClose: () => void
    selectedFarm: Farm | null
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
                <Box className="transaction-success-container">
                    <CheckCircleIcon className="success-icon" />
                    
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
                        className="transaction-link"
                    >
                        {transactionHash}
                    </Link>
                    <Button
                        variant="contained"
                        onClick={onClose}
                        className="buy-button"
                    >
                        Close
                    </Button>
                </Box>
            )
        }

        if (isBuying) {
            return (
                <Box className="processing-container">
                    <CircularProgress size={48} className="processing-spinner" />
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
                <Typography className="buy-modal-title">
                    Your order
                </Typography>
                <Box className="buy-modal-content">
                    <Box className="buy-modal-row">
                        <Typography className="buy-modal-label">Farm Name:</Typography>
                        <Typography className="buy-modal-value">{selectedFarm?.name}</Typography>
                    </Box>
                    <Box className="buy-modal-row">
                        <Typography className="buy-modal-label">Number of Tokens:</Typography>
                        <Box className="buy-modal-counter">
                            <Button 
                                size="small" 
                                className="counter-button"
                                onClick={() => onBuyAmountChange(String(Math.max(0, Number(buyAmount || 0) - 1)))}
                            >
                                -
                            </Button>
                            <Typography className="buy-modal-value">{buyAmount || '0'}</Typography>
                            <Button
                                size="small"
                                className="counter-button"
                                onClick={() => onBuyAmountChange(String(Number(buyAmount || 0) + 1))}
                            >
                                +
                            </Button>
                        </Box>
                    </Box>
                    <Box className="buy-modal-row">
                        <Typography className="buy-modal-label">Total Price:</Typography>
                        <Typography className="buy-modal-value">
                            ${selectedFarm && buyAmount ? (selectedFarm.pricePerToken * Number(buyAmount)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        className="buy-button"
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
            <Box className="buy-modal">
                {renderContent()}
            </Box>
        </Modal>
    )
}