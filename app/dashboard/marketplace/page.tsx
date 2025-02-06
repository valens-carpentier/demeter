'use client'

import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { 
    Box, 
    Typography, 
    Grid,
    Card,
    CardContent,
    Button,
    Divider,
    TextField,
    MenuItem,
    InputAdornment,
    Link,
    CircularProgress
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import SortIcon from '@mui/icons-material/Sort'
import BuyFarmModal from '../../../components/BuyFarmModal/BuyFarmModal'
import loadFarms from '../../../lib/farmsUtils'
import { SafeAddressContext, PasskeyContext } from '../../dashboard/layout'
import type { Farm } from '../../../types/farm'
import styles from '@/styles/pages/marketplace.module.css'
import { buyFarmTokensWithUSDC } from '../../../lib/tokenUtils'

type SortOption = 'valuation-high' | 'valuation-low' | 'expected-high' | 'expected-low'

export default function Marketplace() {
    const safeAddress = useContext(SafeAddressContext)
    const passkey = useContext(PasskeyContext)
    const router = useRouter()
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
        if (passkey) {
            router.push(`/dashboard/marketplace?passkeyId=${passkey.rawId}`)
        }
    }, [passkey, router])

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
        // Start with only active farms
        let result = [...farms].filter(farm => farm.isActive)
        
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
                    return b.sizeInAcres - a.sizeInAcres
                case 'expected-low':
                    return a.sizeInAcres - b.sizeInAcres
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
            const hash = await buyFarmTokensWithUSDC(selectedFarm.token, safeAddress, amount, passkey)
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
            <Box className={styles.marketplaceContainer}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" className={styles.marketplaceTitle}>
                        Marketplace
                    </Typography>
                </Box>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '300px',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    <CircularProgress size={60} />
                    <Typography variant="body1" color="text.secondary">
                        Loading farms...
                    </Typography>
                </Box>
            </Box>
        )
    }

    return (
        <Box className={styles.marketplaceContainer} sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" className={styles.marketplaceTitle}>
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
                    <MenuItem value="expected-high">Largest Size</MenuItem>
                    <MenuItem value="expected-low">Smallest Size</MenuItem>
                </TextField>
            </Box>

            <Grid 
                container 
                spacing={3} 
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}
            >
                {filteredFarms.map((farm, index) => (
                    <Grid 
                        item 
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                        key={index}
                    >
                        <Card className={styles.farmCard}>
                            <CardContent>
                                <Typography variant="h6" className={styles.farmName}>
                                    {farm.name}
                                </Typography>
                                <Box sx={{ my: 2 }}>
                                <div className={styles.farmStat}>
                                        <Typography color="text.secondary" className={styles.statLabel}>
                                            Farm Size
                                        </Typography>
                                        <Typography variant="h6" className={styles.statValue}>
                                            {farm.sizeInAcres} acres
                                        </Typography>
                                    </div>
                                    <Divider sx={{ my: 1.5 }} />
                                    <div className={styles.farmStat}>
                                        <Typography color="text.secondary" className={styles.statLabel}>
                                            Farm Valuation
                                        </Typography>
                                        <Typography variant="h6" className={styles.statValue}>
                                            ${farm.valuation.toLocaleString()}
                                        </Typography>
                                    </div>
                                    <Divider sx={{ my: 1.5 }} />
                                    <div className={styles.farmStat}>
                                        <Typography color="text.secondary" className={styles.statLabel}>
                                            Token Price
                                        </Typography>
                                        <Typography variant="h6" className={`${styles.statValue} ${styles.highlight}`}>
                                            ${(farm.pricePerToken)}
                                        </Typography>
                                    </div>
                                    <Divider sx={{ my: 1.5 }} />
                                    <div className={styles.farmStat}>
                                        <Typography color="text.secondary" className={styles.statLabel}>
                                            Expected Annual Valuation Growth
                                        </Typography>
                                        <Typography variant="h6" className={`${styles.statValue} ${styles.success}`}>
                                            {farm.expectedOutcomePercentage}%
                                        </Typography>
                                    </div>
                                    <Divider sx={{ my: 1.5 }} />
                                    <div className={styles.farmStat}>
                                        <Typography color="text.secondary" className={styles.statLabel}>
                                            Total Supply
                                        </Typography>
                                        <Typography variant="h6" className={styles.statValue}>
                                            {farm.totalTokenSupply.toLocaleString()} tokens
                                        </Typography>
                                    </div>
                                    <Divider sx={{ my: 1.5 }} />
                                    <div className={styles.farmStat}>
                                        <Typography color="text.secondary" className={styles.statLabel}>
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
                                                className={styles.statValue}
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
                                    className={styles.buyButton}
                                    disabled={!farm.isActive || !safeAddress}
                                    onClick={() => handleBuyClick(farm)}
                                >
                                    {!safeAddress ? 'Connecting Safe...' : 
                                     !farm.isActive ? 'Sold Out' : 'Buy'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {filteredFarms.length === 0 && (
                <Typography className={styles.noResults}>
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
