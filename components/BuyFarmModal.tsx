import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Link from 'next/link'

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
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    p: 3
                }}>
                    <CheckCircleIcon sx={{ fontSize: 64, color: '#4CAF50' }} />
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
                        style={{ 
                            wordBreak: 'break-all',
                            textAlign: 'center',
                            color: '#4CAF50',
                            textDecoration: 'underline'
                        }}
                    >
                        {transactionHash}
                    </Link>
                    <Button
                        variant="contained"
                        onClick={onClose}
                        sx={{
                            mt: 2,
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            borderRadius: '6px',
                            padding: '12px 24px',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#2E7D32'
                            }
                        }}
                    >
                        Close
                    </Button>
                </Box>
            )
        }

        if (isBuying) {
            return (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    p: 3
                }}>
                    <CircularProgress size={48} sx={{ color: '#4CAF50' }} />
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
                <Typography variant="h6" sx={{
                    color: '#2C3E2D',
                    fontSize: 24,
                    fontWeight: 600,
                    letterSpacing: '-0.025em',
                    mb: 2,
                    textAlign: 'center'
                }}>
                    Your order
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mb: 3
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #E0E0E0',
                        pb: 1
                    }}>
                        <Typography sx={{
                            color: '#5C745D',
                            fontWeight: 500
                        }}>
                            Farm Name:
                        </Typography>
                        <Typography sx={{
                            color: '#2C3E2D',
                            fontWeight: 600
                        }}>
                            {selectedFarm?.name}
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #E0E0E0',
                        pb: 1
                    }}>
                        <Typography sx={{
                            color: '#5C745D',
                            fontWeight: 500
                        }}>
                            Number of Tokens:
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Button 
                                size="small" 
                                sx={{
                                    minWidth: 32,
                                    padding: '4px',
                                    border: '1px solid #E0E0E0'
                                }}
                                onClick={() => onBuyAmountChange(String(Math.max(0, Number(buyAmount || 0) - 1)))}
                            >
                                -
                            </Button>
                            <Typography sx={{
                                color: '#2C3E2D',
                                fontWeight: 600
                            }}>
                                {buyAmount || '0'}
                            </Typography>
                            <Button
                                size="small"
                                sx={{
                                    minWidth: 32,
                                    padding: '4px',
                                    border: '1px solid #E0E0E0'
                                }}
                                onClick={() => onBuyAmountChange(String(Number(buyAmount || 0) + 1))}
                            >
                                +
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #E0E0E0',
                        pb: 1
                    }}>
                        <Typography sx={{
                            color: '#5C745D',
                            fontWeight: 500
                        }}>
                            Total Price:
                        </Typography>
                        <Typography sx={{
                            color: '#2C3E2D',
                            fontWeight: 600
                        }}>
                            ${selectedFarm && buyAmount ? (selectedFarm.pricePerToken * Number(buyAmount)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            borderRadius: '6px',
                            padding: '12px 24px',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#2E7D32'
                            },
                            '&:disabled': {
                                opacity: 0.7
                            }
                        }}
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
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 3
            }}>
                {renderContent()}
            </Box>
        </Modal>
    )
}