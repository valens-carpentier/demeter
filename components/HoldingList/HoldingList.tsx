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
import { getUserHoldings, getTotalHoldingsValue, UserHolding } from '../../lib/holdingsUtils'
import { SafeAddressContext } from '../../app/dashboard/layout'
import styles from './HoldingList.module.css'

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
        <Paper className={styles.holdingListContainer}>
            <Box className={styles.holdingListHeader}>
                <Typography className={styles.holdingListTitle}>My Holdings</Typography>
                <Box className={styles.totalValueContainer}>
                    <Typography className={styles.holdingLabel}>Total Holdings Value:</Typography>
                    <Typography className={styles.holdingValue}>
                        ${totalValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </Typography>
                </Box>
            </Box>

            <Box className={styles.assetsHeader}>
                <Typography className={styles.headerCell}>Farm Name</Typography>
                <Typography className={styles.headerCell}>Farm Token</Typography>
                <Typography className={styles.headerCell}>Number of Tokens</Typography>
                <Typography className={styles.headerCell}>Farm Valuation</Typography>
                <Typography className={styles.headerCell}>Your Share</Typography>
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
                            <Box key={index} className={styles.assetRow}>
                                <Typography className={styles.assetCell}>{holding.farmName}</Typography>
                                <Typography className={styles.assetCell}>{holding.tokenSymbol}</Typography>
                                <Typography className={styles.assetCell}>
                                    {holding.tokenBalance.toLocaleString()}
                                </Typography>
                                <Typography className={styles.assetCell}>
                                    ${holding.farmValuation.toLocaleString()}
                                </Typography>
                                <Typography className={styles.assetCell}>
                                    ${holding.userShare.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography className={styles.noAssetsMessage}>
                            No holdings yet...
                        </Typography>
                    )}
                </>
            )}
        </Paper>
    )
}