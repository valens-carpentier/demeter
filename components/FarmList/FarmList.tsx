import { useState, useEffect, useContext } from 'react'
import {
    Paper, 
    Typography,
    Grid, 
    Card, 
    CardContent, 
    Button,
    Box,
    Divider,
    CircularProgress
} from '@mui/material'
import { useRouter } from 'next/navigation'
import BuyFarmModal from '../../components/BuyFarmModal/BuyFarmModal'

import loadFarms from '../../lib/farmsUtils'
import { buyFarmTokensWithUSDC } from '../../lib/tokenUtils'
import styles from './FarmList.module.css'
import { SafeAddressContext, PasskeyContext } from '@/app/contexts/SafeContext'

// Define the Farm type based on the struct in the smart contract
type Farm = {
    token: string, 
    owner: string, 
    name: string, 
    sizeInAcres: number, 
    totalTokenSupply: number, 
    valuation: number, 
    expectedOutcomePercentage: number,
    pricePerToken: number,
    isActive: boolean
    timestamp: number
}

export default function FarmList() {
    const safeAddress = useContext(SafeAddressContext)
    const passkey = useContext(PasskeyContext)
    const [farms, setFarms] = useState<Farm[]>([])
    const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null)
    const [buyAmount, setBuyAmount] = useState<string>('')
    const [isBuying, setIsBuying] = useState(false)
    const [openBuyModal, setOpenBuyModal] = useState(false)
    const [transactionHash, setTransactionHash] = useState<string>('')
    const router = useRouter()

    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const farmData = await loadFarms()
                const formattedFarms = farmData.map((farm: Farm) => ({
                    token: farm.token,
                    owner: farm.owner,
                    name: farm.name,
                    sizeInAcres: farm.sizeInAcres,
                    totalTokenSupply: farm.totalTokenSupply,
                    valuation: farm.valuation,
                    expectedOutcomePercentage: farm.expectedOutcomePercentage,
                    pricePerToken: farm.pricePerToken,
                    isActive: farm.isActive,
                    timestamp: farm.timestamp
                }))
                setFarms(formattedFarms)
            } catch (error) {
                console.error('Error loading farms:', error)
            }
        }
        
        fetchFarms()
    }, [])

    const handleBuyClick = (farm: Farm) => {
        setSelectedFarm(farm)
        setOpenBuyModal(true)
    }

    const handleBuyConfirm = async () => {
        if (!selectedFarm || !safeAddress || !buyAmount || !passkey) return

        try {
            setIsBuying(true)
            const amount = parseInt(buyAmount)
            const hash = await buyFarmTokensWithUSDC(selectedFarm.token, safeAddress, amount, passkey)
            setTransactionHash(hash)
        } catch (error: unknown) {
            console.error('Failed to buy tokens:', error)
            alert(error instanceof Error ? error.message : 'Failed to buy tokens. Please try again.')
            setOpenBuyModal(false)
        } finally {
            setIsBuying(false)
        }
    }

    return (
        <>
            <Paper className={styles.farmListContainer}>
                <Typography className={styles.farmListTitle}>
                    Available Farms ({farms.filter(farm => farm.isActive).length})
                </Typography>
                
                <Grid container spacing={3} className={styles.farmListGrid}>
                    {farms.filter(farm => farm.isActive).map((farm, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                            <Card className={styles.farmCard}>
                                <CardContent>
                                    <Typography className={styles.farmName}>
                                        {farm.name}
                                    </Typography>
                                    
                                    <Box className={styles.farmInvestmentRow}>
                                        <div>
                                            <Typography className={styles.investmentLabel}>Valuation</Typography>
                                            <Typography className={styles.investmentValue}>
                                                ${farm.valuation.toLocaleString()}
                                            </Typography>
                                        </div>
                                        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                                        <div>
                                            <Typography className={styles.investmentLabel}>Token Price</Typography>
                                            <Typography className={styles.tokenPrice}>
                                                ${farm.pricePerToken}
                                            </Typography>
                                        </div>
                                    </Box>
                                    
                                    <Box className={styles.farmMetrics}>
                                        <div className={styles.metricsButtonContainer}>
                                            <div className={styles.metricsContent}>
                                                <Typography className={styles.metricLabel}>
                                                    Expected Valuation Growth
                                                </Typography>
                                                <Typography className={styles.metricValue}>
                                                    {farm.expectedOutcomePercentage}%
                                                </Typography>
                                            </div>
                                            <Button 
                                                variant="contained"
                                                className={styles.viewPropertyButton}
                                                disabled={!farm.isActive || !safeAddress}
                                                onClick={() => handleBuyClick(farm)}
                                            >
                                                {!safeAddress ? (
                                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CircularProgress size={16} sx={{ color: 'white' }} /></Box>
                                                ) : 
                                                 !farm.isActive ? 'Sold Out' : 'Buy'}
                                            </Button>
                                        </div>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        className={styles.farmViewDetailsButton}
                        onClick={() => {
                            if (passkey) {
                                router.push(`/dashboard/marketplace?passkeyId=${passkey.rawId}`)
                            }
                        }}
                    >
                        See all farms
                    </Button>
                </Box>
                
                {farms.length === 0 && (
                    <Typography className={styles.noFarmsMessage}>
                        No farms available yet.
                    </Typography>
                )}
            </Paper>

            <BuyFarmModal 
                open={openBuyModal}
                onClose={() => {
                    setOpenBuyModal(false)
                    setTransactionHash('')
                    setBuyAmount('')
                }}
                selectedFarm={{
                    name: selectedFarm?.name || '',
                    token: selectedFarm?.token || '',
                    pricePerToken: selectedFarm?.pricePerToken || 0
                }}
                buyAmount={buyAmount}
                onBuyAmountChange={(value) => setBuyAmount(value)}
                onBuyConfirm={() => handleBuyConfirm()}
                isBuying={isBuying}
                transactionHash={transactionHash}
            />
        </>
    )
}