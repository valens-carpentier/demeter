import { useState } from 'react'
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material'
import { UserHolding } from '../lib/holdingsUtils'
import { sellFarmTokensWithUSDC } from '../lib/tokenUtils'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Link from 'next/link'    
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
        } catch (error: unknown) {
            console.error('Failed to sell tokens:', error)
            alert(error instanceof Error ? error.message : 'Failed to sell tokens. Please try again.')
        } finally {
            setIsSelling(false)
        }
    }

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
                        Your sale has been confirmed. You can view the transaction details below:
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

        if (isSelling) {
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
                        Please wait while we process your sale...
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
                    Sell
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
                            Current Balance:
                        </Typography>
                        <Typography sx={{
                            color: '#2C3E2D',
                            fontWeight: 600
                        }}>
                            {holding?.tokenBalance || 0}
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
                            Token Price:
                        </Typography>
                        <Typography sx={{
                            color: '#2C3E2D',
                            fontWeight: 600
                        }}>
                            ${holding?.tokenPrice || 0}
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
                                onClick={() => setSellAmount(String(Math.max(0, Number(sellAmount || 0) - 1)))}
                            >
                                -
                            </Button>
                            <Typography sx={{
                                color: '#2C3E2D',
                                fontWeight: 600
                            }}>
                                {sellAmount || '0'}
                            </Typography>
                            <Button
                                size="small"
                                sx={{
                                    minWidth: 32,
                                    padding: '4px',
                                    border: '1px solid #E0E0E0'
                                }}
                                onClick={() => setSellAmount(String(Math.min(holding?.tokenBalance || 0, Number(sellAmount || 0) + 1)))}
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
                            Total Value:
                        </Typography>
                        <Typography sx={{
                            color: '#2C3E2D',
                            fontWeight: 600
                        }}>
                            ${holding && sellAmount ? (holding.tokenPrice * Number(sellAmount)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
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