import { useEffect, useState, useContext } from 'react'
import {
    Paper, 
    Typography,
    Grid2, 
    Card, 
    CardContent, 
    Box,
    CircularProgress
} from '@mui/material'
import { getUserHoldings, getTotalHoldingsValue, UserHolding } from '../lib/holdingsUtils'
import { SafeAddressContext } from '../app/dashboard/layout'
import '../styles/holdinglist.css'

export default function HoldingList() {
    const safeAddress = useContext(SafeAddressContext)
    const [holdings, setHoldings] = useState<UserHolding[]>([])
    const [totalValue, setTotalValue] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHoldings = async () => {
            if (!safeAddress) return
            
            try {
                setLoading(true)
                const userHoldings = await getUserHoldings(safeAddress)
                const total = await getTotalHoldingsValue(safeAddress)
                
                setHoldings(userHoldings)
                setTotalValue(total)
            } catch (error) {
                console.error('Failed to fetch holdings:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchHoldings()
    }, [safeAddress])

    return (
        <Paper className="holding-list-container">
            <Box className="holding-list-header">
                <Typography className="holding-list-title">My Holdings</Typography>
                <Box className="total-value-container">
                    <Typography className="holding-label">Total Holdings Value:</Typography>
                    <Typography className="holding-value">
                        ${totalValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </Typography>
                </Box>
            </Box>

            <Box className="assets-header">
                <Typography className="header-cell">Farm Name</Typography>
                <Typography className="header-cell">Farm Token</Typography>
                <Typography className="header-cell">Number of Tokens</Typography>
                <Typography className="header-cell">Farm Valuation</Typography>
                <Typography className="header-cell">Your Share</Typography>
            </Box>

            {loading ? (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    p: 4 
                }}>
                    <CircularProgress color="inherit" size={24} />
                </Box>
            ) : (
                <>
                    {holdings.length > 0 ? (
                        holdings.map((holding, index) => (
                            <Box key={index} className="asset-row">
                                <Typography className="asset-cell">{holding.farmName}</Typography>
                                <Typography className="asset-cell">{holding.tokenSymbol}</Typography>
                                <Typography className="asset-cell">
                                    {holding.tokenBalance.toLocaleString()}
                                </Typography>
                                <Typography className="asset-cell">
                                    ${holding.farmValuation.toLocaleString()}
                                </Typography>
                                <Typography className="asset-cell">
                                    ${holding.userShare.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography className="no-assets-message">
                            No holdings yet...
                        </Typography>
                    )}
                </>
            )}
        </Paper>
    )
}