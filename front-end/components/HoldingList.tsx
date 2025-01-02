import { useEffect, useState, useContext } from 'react'
import {
    Paper, 
    Typography,
    Grid2, 
    Card, 
    CardContent, 
    Button, 
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

    if (loading) {
        return <CircularProgress />
    }

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

            <Grid2 container spacing={3}>
                {holdings.map((holding, index) => (
                    <Grid2 key={index} item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Box className="holding-details-container">
                                    <Grid2 container spacing={2} className="holding-grid">
                                        <Grid2 item xs={4}>
                                            <Typography className="holding-label">
                                                Farm Token 
                                            </Typography>
                                            <Typography className="holding-value">
                                                {holding.tokenSymbol}
                                            </Typography>
                                        </Grid2>
                                        <Grid2 item xs={4}>
                                            <Typography className="holding-label">
                                                Number of Tokens
                                            </Typography>
                                            <Typography className="holding-value">
                                                {holding.tokenBalance.toLocaleString()}
                                            </Typography>
                                        </Grid2>
                                        <Grid2 item xs={4}>
                                            <Typography className="holding-label">
                                                Farm Valuation
                                            </Typography>
                                            <Typography className="holding-value">
                                                ${holding.farmValuation.toLocaleString()}
                                            </Typography>
                                        </Grid2>
                                        <Grid2 item xs={4}>
                                            <Typography className="holding-label">
                                                Your Share
                                            </Typography>
                                            <Typography className="holding-value">
                                                ${holding.userShare.toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </Typography>
                                        </Grid2>
                                    </Grid2>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>
        </Paper>
    )
}