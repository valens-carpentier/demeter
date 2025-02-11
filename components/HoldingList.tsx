import { useEffect, useState, useContext } from 'react'
import {
    Paper, 
    Typography,
    Box,
    CircularProgress
} from '@mui/material'
import { getUserHoldings, getTotalHoldingsValue, UserHolding } from '../lib/holdingsUtils'
import { SafeAddressContext } from '@/app/contexts/SafeContext'
import theme from '@/styles/global/theme'

export default function HoldingList() {
    const safeAddress = useContext(SafeAddressContext)
    const [holdings, setHoldings] = useState<UserHolding[]>([])
    const [totalValue, setTotalValue] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHoldings = async () => {
            if (!safeAddress) {
                console.log('No safe address available');
                return;
            }
            
            try {
                setLoading(true);
                console.log('Fetching holdings for address:', safeAddress);
                const userHoldings = await getUserHoldings(safeAddress);
                console.log('Fetched holdings:', userHoldings);
                const total = await getTotalHoldingsValue(safeAddress);
                console.log('Total value:', total);
                
                setHoldings(userHoldings);
                setTotalValue(total);
            } catch (error) {
                console.error('Failed to fetch holdings:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchHoldings();
    }, [safeAddress]);

    return (
        <Paper sx={{
            padding: 3,
            backgroundColor: theme.palette.background.paper,
            width: '100%',
            minHeight: '200px',
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            transition: theme.transitions.create('all', {
                duration: theme.transitions.duration.short,
            }),
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h4" sx={{ 
                }}>
                    My Holdings
                </Typography>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Typography sx={{
                        color: '#5C745D',
                        fontSize: 14,
                        mr: 1,
                        fontWeight: 500
                    }}>
                        Total Holdings Value:
                    </Typography>
                    <Typography sx={{
                        color: '#2C3E2D',
                        fontSize: 16,
                        fontWeight: 600
                    }}>
                        ${totalValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                p: 2,
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                backgroundColor: '#F5F2EA',
                borderRadius: '8px 8px 0 0'
            }}>
                {['Farm Name', 'Farm Token', 'Number of Tokens', 'Farm Valuation', 'Your Share'].map((header, index) => (
                    <Typography key={index} sx={{
                        color: '#5C745D',
                        fontSize: 14,
                        fontWeight: 600,
                        p: 1
                    }}>
                        {header}
                    </Typography>
                ))}
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
                            <Box key={index} sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(5, 1fr)',
                                p: 2,
                                borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                                transition: 'background-color 0.2s ease',
                                '&:hover': {
                                    backgroundColor: '#F5F2EA'
                                }
                            }}>
                                <Typography sx={{
                                    color: '#2C3E2D',
                                    fontSize: 14,
                                    p: 1,
                                    fontWeight: 500
                                }}>
                                    {holding.farmName}
                                </Typography>
                                <Typography sx={{
                                    color: '#2C3E2D',
                                    fontSize: 14,
                                    p: 1,
                                    fontWeight: 500
                                }}>
                                    {holding.tokenSymbol}
                                </Typography>
                                <Typography sx={{
                                    color: '#2C3E2D',
                                    fontSize: 14,
                                    p: 1,
                                    fontWeight: 500
                                }}>
                                    {holding.tokenBalance.toLocaleString()}
                                </Typography>
                                <Typography sx={{
                                    color: '#2C3E2D',
                                    fontSize: 14,
                                    p: 1,
                                    fontWeight: 500
                                }}>
                                    ${holding.farmValuation.toLocaleString()}
                                </Typography>
                                <Typography sx={{
                                    color: '#2C3E2D',
                                    fontSize: 14,
                                    p: 1,
                                    fontWeight: 500
                                }}>
                                    ${holding.userShare.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography sx={{
                            textAlign: 'center',
                            color: '#5C745D',
                            p: 4,
                            fontSize: 16
                        }}>
                            No holdings yet...
                        </Typography>
                    )}
                </>
            )}
        </Paper>
    )
}