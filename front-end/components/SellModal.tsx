import { useState } from 'react'
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material'
import { UserHolding } from '../lib/holdingsUtils'
import { sellFarmTokens, sellFarmTokensWithUSDC } from '../lib/tokenUtils'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Link from 'next/link'
import '../styles/sell-modal.css'
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

    const handleSell = async (paymentMethod: 'ETH' | 'USDC') => {
        if (!holding || !safeAddress || !sellAmount || !passkey) return

        try {
            setIsSelling(true)
            const amount = parseInt(sellAmount)
            const hash = paymentMethod === 'ETH' 
                ? await sellFarmTokens(holding.tokenAddress, safeAddress, amount, passkey)
                : await sellFarmTokensWithUSDC(holding.tokenAddress, safeAddress, amount, passkey)
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
                <Box className="transaction-success-container">
                    <CheckCircleIcon className="success-icon" />
                    
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
                        className="transaction-link"
                    >
                        {transactionHash}
                    </Link>
                    <Button
                        variant="contained"
                        onClick={onClose}
                        className="sell-button"
                    >
                        Close
                    </Button>
                </Box>
            )
        }

        if (isSelling) {
            return (
                <Box className="processing-container">
                    <CircularProgress size={48} className="processing-spinner" />
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
                <Typography className="sell-modal-title">
                    Sell
                </Typography>
                <Box className="sell-modal-content">
                    <Box className="sell-modal-row">
                        <Typography className="sell-modal-label">Current Balance:</Typography>
                        <Typography className="sell-modal-value">
                            {holding?.tokenBalance || 0}
                        </Typography>
                    </Box>
                    <Box className="sell-modal-row">
                        <Typography className="sell-modal-label">Token Price:</Typography>
                        <Typography className="sell-modal-value">
                            ${holding?.tokenPrice || 0}
                        </Typography>
                    </Box>
                    <Box className="sell-modal-row">
                        <Typography className="sell-modal-label">Number of Tokens:</Typography>
                        <Box className="sell-modal-counter">
                            <Button 
                                size="small" 
                                className="counter-button"
                                onClick={() => setSellAmount(String(Math.max(0, Number(sellAmount || 0) - 1)))}
                            >
                                -
                            </Button>
                            <Typography className="sell-modal-value">{sellAmount || '0'}</Typography>
                            <Button
                                size="small"
                                className="counter-button"
                                onClick={() => setSellAmount(String(Math.min(holding?.tokenBalance || 0, Number(sellAmount || 0) + 1)))}
                            >
                                +
                            </Button>
                        </Box>
                    </Box>
                    <Box className="sell-modal-row">
                        <Typography className="sell-modal-label">Total Value:</Typography>
                        <Typography className="sell-modal-value">
                            ${holding && sellAmount ? (holding.tokenPrice * Number(sellAmount)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        className="sell-button"
                        onClick={() => handleSell('ETH')}
                        disabled={isSelling || !sellAmount || parseInt(sellAmount) < 1 || parseInt(sellAmount) > (holding?.tokenBalance || 0)}
                    >
                        Sell for ETH
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        className="sell-button usdc-button"
                        onClick={() => handleSell('USDC')}
                        disabled={isSelling || !sellAmount || parseInt(sellAmount) < 1 || parseInt(sellAmount) > (holding?.tokenBalance || 0)}
                    >
                        Sell for USDC
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
            <Box className="sell-modal">
                {renderContent()}
            </Box>
        </Modal>
    )
}