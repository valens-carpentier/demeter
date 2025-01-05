import { useState, useEffect, useContext } from 'react'
import {
    Paper, 
    Typography,
    Grid2, 
    Card, 
    CardContent, 
    Button,
    Box,
    Divider
} from '@mui/material'
import { useRouter } from 'next/navigation'
import BuyFarmModal from './BuyFarmModal'

import loadFarms from '../lib/farmsUtils'
import { buyFarmTokens } from '../lib/tokenUtils'
import '@/styles/farmlist.css'
import { SafeAddressContext, PasskeyContext } from '../app/dashboard/layout'

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
    const [loading, setLoading] = useState(true)
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
                const formattedFarms = farmData.map((farm: any) => ({
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
            } finally {
                setLoading(false)
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
            const hash = await buyFarmTokens(
                selectedFarm.token, 
                safeAddress, 
                amount,
                passkey
            )
            setTransactionHash(hash)
        } catch (error: any) {
            console.error('Failed to buy tokens:', error)
            alert(error.message || 'Failed to buy tokens. Please try again.')
            setOpenBuyModal(false)
        } finally {
            setIsBuying(false)
        }
    }

    return (
        <>
            <Paper className="farm-list-container">
                <Typography className="farm-list-title">
                    Available Farms ({farms.length})
                </Typography>
                
                <Grid2 container spacing={3} className="farm-list-grid">
                    {farms.map((farm, index) => (
                        <Grid2 item xs={12} sm={6} md={4} lg={4} key={index}>
                            <Card>
                                <CardContent>
                                    <Typography className="farm-name">
                                        {farm.name}
                                    </Typography>
                                    
                                    <Box className="farm-investment-row">
                                        <div>
                                            <Typography className="investment-label">Valuation</Typography>
                                            <Typography className="investment-value">
                                                ${farm.valuation.toLocaleString()}
                                            </Typography>
                                        </div>
                                        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                                        <div>
                                            <Typography className="investment-label">Token Price</Typography>
                                            <Typography className="token-price">
                                                ${(farm.valuation / farm.totalTokenSupply).toFixed(2)}
                                            </Typography>
                                        </div>
                                    </Box>
                                    
                                    <Box className="farm-metrics">
                                        <div className="metrics-button-container">
                                            <div className="metrics-content">
                                                <Typography className="metric-label">
                                                    Expected Valuation Growth
                                                </Typography>
                                                <Typography className="metric-value">
                                                    {farm.expectedOutcomePercentage}%
                                                </Typography>
                                            </div>
                                            <Button 
                                                variant="contained"
                                                className="view-property-button"
                                                disabled={!farm.isActive || !safeAddress}
                                                onClick={() => handleBuyClick(farm)}
                                            >
                                                {!safeAddress ? 'Connecting Safe...' : 
                                                 !farm.isActive ? 'Sold Out' : 'Buy'}
                                            </Button>
                                        </div>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid2>
                    ))}
                </Grid2>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        className="farm-view-details-button"
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
                    <Typography className="no-farms-message">
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
                selectedFarm={selectedFarm}
                buyAmount={buyAmount}
                onBuyAmountChange={(value) => setBuyAmount(value)}
                onBuyConfirm={handleBuyConfirm}
                isBuying={isBuying}
                transactionHash={transactionHash}
            />
        </>
    )
}