'use client'

import { useState, useEffect, useContext } from 'react'
import { 
    Box, 
    Typography, 
    Paper,
    Grid2,
    Card,
    CardContent,
    Button,
    Divider,
    TextField,
    MenuItem,
    InputAdornment,
    Link
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import SortIcon from '@mui/icons-material/Sort'
import BuyFarmModal from '../../../components/BuyFarmModal'
import loadFarms from '../../../lib/farmsUtils'
import { SafeAddressContext, PasskeyContext } from '../../dashboard/layout'
import type { Farm } from '../../../types/farm'
import '../../../styles/marketplace.css'

type SortOption = 'valuation-high' | 'valuation-low' | 'expected-high' | 'expected-low'

export default function Marketplace() {
    const safeAddress = useContext(SafeAddressContext)
    const passkey = useContext(PasskeyContext)
    const [farms, setFarms] = useState<Farm[]>([])
    const [filteredFarms, setFilteredFarms] = useState<Farm[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState<SortOption>('valuation-high')
    const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null)
    const [buyAmount, setBuyAmount] = useState<string>('')
    const [isBuying, setIsBuying] = useState(false)
    const [openBuyModal, setOpenBuyModal] = useState(false)
    const [transactionHash, setTransactionHash] = useState<string>('')

    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const farmData = await loadFarms()
                setFarms(farmData)
                setFilteredFarms(farmData)
            } catch (error) {
                console.error('Error loading farms:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchFarms()
    }, [])

    useEffect(() => {
        let result = [...farms]
        
        // Apply search filter
        if (searchTerm) {
            result = result.filter(farm => 
                farm.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        
        // Apply sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case 'valuation-high':
                    return b.valuation - a.valuation
                case 'valuation-low':
                    return a.valuation - b.valuation
                case 'expected-high':
                    return b.expectedOutcomePercentage - a.expectedOutcomePercentage
                case 'expected-low':
                    return a.expectedOutcomePercentage - b.expectedOutcomePercentage
                default:
                    return 0
            }
        })
        
        setFilteredFarms(result)
    }, [farms, searchTerm, sortBy])

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

    if (loading) {
        return (
            <Box sx={{ padding: 3 }}>
                <Typography>Loading farms...</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" className="marketplace-title">
                    Marketplace
                </Typography>
                <Typography color="text.secondary">
                    {filteredFarms.length} farms available
                </Typography>
            </Box>

            <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
                <TextField
                    placeholder="Search farms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flex: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    sx={{ width: 200 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SortIcon />
                            </InputAdornment>
                        ),
                    }}
                >
                    <MenuItem value="valuation-high">Highest Valuation</MenuItem>
                    <MenuItem value="valuation-low">Lowest Valuation</MenuItem>
                    <MenuItem value="expected-high">Highest Expected Annual Valuation Growth</MenuItem>
                    <MenuItem value="expected-low">Lowest Expected Annual Valuation Growth</MenuItem>
                </TextField>
            </Box>

                <Grid2 container spacing={3}>
                    {filteredFarms.map((farm, index) => (
                        <Grid2 item xs={12} sm={6} md={4} key={index}>
                            <Card className="farm-card">
                                <CardContent>
                                    <Typography variant="h6" className="farm-name">
                                        {farm.name}
                                    </Typography>
                                    <Box sx={{ my: 2 }}>
                                    <div className="farm-stat">
                                            <Typography color="text.secondary" className="stat-label">
                                                Farm Size
                                            </Typography>
                                            <Typography variant="h6" className="stat-value">
                                                {farm.sizeInAcres} acres
                                            </Typography>
                                        </div>
                                        <Divider sx={{ my: 1.5 }} />
                                        <div className="farm-stat">
                                            <Typography color="text.secondary" className="stat-label">
                                                Farm Valuation
                                            </Typography>
                                            <Typography variant="h6" className="stat-value">
                                                ${farm.valuation.toLocaleString()}
                                            </Typography>
                                        </div>
                                        <Divider sx={{ my: 1.5 }} />
                                        <div className="farm-stat">
                                            <Typography color="text.secondary" className="stat-label">
                                                Token Price
                                            </Typography>
                                            <Typography variant="h6" className="stat-value highlight">
                                                ${(farm.valuation / farm.totalTokenSupply).toFixed(2)}
                                            </Typography>
                                        </div>
                                        <Divider sx={{ my: 1.5 }} />
                                        <div className="farm-stat">
                                            <Typography color="text.secondary" className="stat-label">
                                                Expected Annual Valuation Growth
                                            </Typography>
                                            <Typography variant="h6" className="stat-value success">
                                                {farm.expectedOutcomePercentage}%
                                            </Typography>
                                        </div>
                                        <Divider sx={{ my: 1.5 }} />
                                        <div className="farm-stat">
                                            <Typography color="text.secondary" className="stat-label">
                                                Total Supply
                                            </Typography>
                                            <Typography variant="h6" className="stat-value">
                                                {farm.totalTokenSupply.toLocaleString()} tokens
                                            </Typography>
                                        </div>
                                        <Divider sx={{ my: 1.5 }} />
                                        <div className="farm-stat">
                                            <Typography color="text.secondary" className="stat-label">
                                                Token Address
                                            </Typography>
                                            <Link
                                                href={`https://sepolia.basescan.org/address/${farm.token}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <Typography 
                                                    variant="h6" 
                                                    className="stat-value" 
                                                    sx={{ 
                                                        fontSize: '0.8rem',
                                                        '&:hover': {
                                                            textDecoration: 'underline'
                                                        }
                                                    }}
                                                >
                                                    {`${farm.token.slice(0, 6)}...${farm.token.slice(-6)}`}
                                                </Typography>
                                            </Link>
                                        </div>
                                    </Box>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        className="buy-button"
                                        disabled={!farm.isActive || !safeAddress}
                                        onClick={() => handleBuyClick(farm)}
                                    >
                                        {!safeAddress ? 'Connect Safe to Buy' : 
                                         !farm.isActive ? 'Sold Out' : 'Buy'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid2>
                    ))}
                </Grid2>

                {filteredFarms.length === 0 && (
                    <Typography className="no-results">
                        No farms match your search criteria.
                    </Typography>
                )}

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
        </Box>
    )
}
