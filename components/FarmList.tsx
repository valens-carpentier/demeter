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
import BuyFarmModal from './BuyFarmModal'

import loadFarms from '../lib/farmsUtils'
import { buyFarmTokensWithUSDC } from '../lib/tokenUtils'
import { SafeAddressContext, PasskeyContext } from '@/app/contexts/SafeContext'
import theme from '@/styles/global/theme'

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
            <Paper sx={{
                padding: 3,
                backgroundColor: '#FFFFFF',
                width: '100%',
                margin: '0 auto',
                borderRadius: 2,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
                <Typography variant="h4" sx={{
                }}>
                    Available Farms ({farms.filter(farm => farm.isActive).length})
                </Typography>
                
                <Grid container spacing={3} sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: 1200,
                    margin: '0 auto'
                }}>
                    {farms.filter(farm => farm.isActive).map((farm, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                }
                            }}>
                                <CardContent>
                                    <Typography sx={{
                                        color: '#2C3E2D',
                                        fontSize: 16,
                                        fontWeight: 600,
                                        mb: 0.5,
                                        letterSpacing: '-0.01em'
                                    }}>
                                        {farm.name}
                                    </Typography>
                                    
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        my: 2,
                                        pb: 2,
                                        borderBottom: '1px solid #E0E0E0'
                                    }}>
                                        <div>
                                            <Typography sx={{
                                                fontSize: 12,
                                                color: '#5C745D',
                                                mb: 0.5
                                            }}>
                                                Valuation
                                            </Typography>
                                            <Typography sx={{
                                                fontSize: 16,
                                                fontWeight: 600,
                                                color: '#2C3E2D'
                                            }}>
                                                ${farm.valuation.toLocaleString()}
                                            </Typography>
                                        </div>
                                        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                                        <div>
                                            <Typography sx={{
                                                fontSize: 12,
                                                color: '#5C745D',
                                                mb: 0.5
                                            }}>
                                                Token Price
                                            </Typography>
                                            <Typography sx={{
                                                fontSize: 16,
                                                fontWeight: 600,
                                                color: '#4CAF50'
                                            }}>
                                                ${farm.pricePerToken}
                                            </Typography>
                                        </div>
                                    </Box>
                                    
                                    <Box sx={{ mt: 'auto' }}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mt: 2
                                        }}>
                                            <div>
                                                <Typography sx={{
                                                    fontSize: 12,
                                                    color: '#5C745D',
                                                    fontWeight: 500
                                                }}>
                                                    Expected Valuation Growth
                                                </Typography>
                                                <Typography sx={{
                                                    fontSize: 16,
                                                    color: '#2C3E2D',
                                                    fontWeight: 700
                                                }}>
                                                    {farm.expectedOutcomePercentage}%
                                                </Typography>
                                            </div>
                                            <Button 
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: theme.palette.primary.main,
                                                    color: 'white',
                                                    borderRadius: '6px',
                                                    padding: '12px 24px',
                                                    fontWeight: 600,
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.primary.dark,
                                                    },
                                                    '&:disabled': {
                                                        opacity: 0.7,
                                                    }
                                                }}
                                                disabled={!farm.isActive || !safeAddress}
                                                onClick={() => handleBuyClick(farm)}
                                            >
                                                {!safeAddress ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CircularProgress size={16} sx={{ color: 'white' }} />
                                                    </Box>
                                                ) : 
                                                !farm.isActive ? 'Sold Out' : 'Buy'}
                                            </Button>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        sx={{
                            color: '#4CAF50',
                            border: '2px solid #4CAF50',
                            fontWeight: 600,
                            textTransform: 'none',
                            padding: '8px 16px',
                            '&:hover': {
                                backgroundColor: '#4CAF50',
                                color: '#FFFFFF'
                            },
                            '&:disabled': {
                                color: '#A5B5A6',
                                borderColor: '#A5B5A6'
                            }
                        }}
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
                    <Typography sx={{
                        mt: 3,
                        textAlign: 'center',
                        color: '#5C745D',
                        fontSize: 16
                    }}>
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