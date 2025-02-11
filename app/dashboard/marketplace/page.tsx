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
import BuyFarmModal from '../../../components/BuyFarmModal'
import loadFarms from '../../../lib/farmsUtils'
import { SafeAddressContext, PasskeyContext } from '@/app/contexts/SafeContext'
import type { Farm } from '../../../types/farm'
import { buyFarmTokensWithUSDC } from '../../../lib/tokenUtils'
import theme from '@/styles/global/theme'

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
        } catch (error: unknown) {
            console.error('Failed to buy tokens:', error)
            alert(error instanceof Error ? error.message : 'Failed to buy tokens. Please try again.')
            setOpenBuyModal(false)
        } finally {
            setIsBuying(false)
        }
    }

    if (loading) {
        return (
            <Box sx={{ 
                marginLeft: '5%',
                marginRight: '5%',
                padding: 3
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{
                        color: '#2C3E2D',
                        fontWeight: 700,
                        fontSize: '2rem',
                        letterSpacing: '-0.025em'
                    }}>
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
        <Box sx={{ 
            marginLeft: '5%',
            marginRight: '5%',
            padding: 3
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{
                    color: '#2C3E2D',
                    fontWeight: 700,
                    fontSize: theme.typography.h4.fontSize,
                    letterSpacing: '-0.025em'
                }}>
                    Marketplace
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: theme.typography.body1.fontSize }}>
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
                    <MenuItem value="valuation-high" sx={{ color: theme.palette.text.primary }}>Highest Valuation</MenuItem>
                    <MenuItem value="valuation-low" sx={{ color: theme.palette.text.primary }}>Lowest Valuation</MenuItem>
                    <MenuItem value="expected-high" sx={{ color: theme.palette.text.primary }}>Largest Size</MenuItem>
                    <MenuItem value="expected-low" sx={{ color: theme.palette.text.primary }}>Smallest Size</MenuItem>
                </TextField>
            </Box>

            <Grid container spacing={3} sx={{
                display: 'flex',
                justifyContent: 'center',
                maxWidth: '1000px',
                margin: '0 auto'
            }}>
                {filteredFarms.map((farm, index) => (
                    <Grid item xs={12} sm={12} md={6} lg={6} key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Card sx={{
                            height: '500px',
                            width: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: theme.transitions.create(['transform', 'box-shadow'], {
                                duration: theme.transitions.duration.standard,
                                easing: theme.transitions.easing.easeInOut,
                            }),
                            border: `1px solid ${theme.palette.divider}`,
                            maxWidth: '100%',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: theme.shadows[6]
                            }
                        }}>
                            <CardContent>
                                <Typography variant="h6" sx={{
                                    color: theme.palette.text.primary,
                                    fontWeight: theme.typography.fontWeightBold,
                                    marginBottom: 0,
                                    padding: theme.spacing(2),
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    width: '100%',
                                    margin: theme.spacing(-2, -2, 2, -2),
                                    fontSize: theme.typography.h6.fontSize
                                }}>
                                    {farm.name}
                                </Typography>
                                <Box sx={{ my: 2 }}>
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.25rem 0'
                                    }}>
                                        <Typography sx={{
                                            fontSize: theme.typography.body2.fontSize,
                                            color: theme.palette.text.secondary,
                                            fontWeight: 500
                                        }}>
                                            Farm Size
                                        </Typography>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 600,
                                            color: theme.palette.text.primary,
                                            fontSize: theme.typography.body2.fontSize
                                        }}>
                                            {farm.sizeInAcres} acres
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ my: 1.5 }} />
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.25rem 0'
                                    }}>
                                        <Typography color="text.secondary" sx={{ fontSize: theme.typography.body2.fontSize }}>
                                            Farm Valuation
                                        </Typography>
                                        <Typography variant="h6" sx={{ 
                                            fontSize: theme.typography.body2.fontSize,
                                            fontWeight: 600,
                                            color: theme.palette.text.primary
                                        }}>
                                            ${farm.valuation.toLocaleString()}
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ my: 1.5 }} />
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.25rem 0'
                                    }}>
                                        <Typography color="text.secondary" sx={{ fontSize: theme.typography.body2.fontSize }}>
                                            Token Price
                                        </Typography>
                                        <Typography variant="h6" sx={{
                                            fontSize: theme.typography.body2.fontSize,
                                            fontWeight: 600,
                                            color: theme.palette.primary.main
                                        }}>
                                            ${(farm.pricePerToken)}
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ my: 1.5 }} />
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.25rem 0'
                                    }}>
                                        <Typography color="text.secondary" sx={{ fontSize: theme.typography.body2.fontSize }}>
                                            Expected Annual Valuation Growth
                                        </Typography>
                                        <Typography variant="h6" sx={{
                                            fontSize: theme.typography.body2.fontSize,
                                            fontWeight: 600,
                                            color: theme.palette.primary.main
                                        }}>
                                            {farm.expectedOutcomePercentage}%
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ my: 1.5 }} />
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.25rem 0'
                                    }}>
                                        <Typography color="text.secondary" sx={{ fontSize: theme.typography.body2.fontSize }}>
                                            Total Supply
                                        </Typography>
                                        <Typography variant="h6" sx={{ 
                                            fontSize: theme.typography.body2.fontSize,
                                            fontWeight: 600,
                                            color: theme.palette.text.primary
                                        }}>
                                            {farm.totalTokenSupply.toLocaleString()} tokens
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ my: 1.5 }} />
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.25rem 0'
                                    }}>
                                        <Typography color="text.secondary" sx={{ fontSize: theme.typography.body2.fontSize }}>
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
                                                sx={{ 
                                                    fontSize: theme.typography.body2.fontSize,
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        textDecoration: 'underline'
                                                    }
                                                }}
                                            >
                                                {`${farm.token.slice(0, 6)}...${farm.token.slice(-6)}`}
                                            </Typography>
                                        </Link>
                                    </Box>
                                </Box>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        marginTop: theme.spacing(2),
                                        '&:disabled': {
                                            backgroundColor: theme.palette.action.disabledBackground,
                                            opacity: 0.7
                                        }
                                    }}
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
                <Typography sx={{
                    textAlign: 'center',
                    color: '#5C745D',
                    padding: '3rem',
                    fontSize: '1.1rem'
                }}>
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
                selectedFarm={{
                    name: selectedFarm?.name || '',
                    token: selectedFarm?.token || '',
                    pricePerToken: selectedFarm?.pricePerToken || 0
                }}
                buyAmount={buyAmount}
                onBuyAmountChange={(value) => setBuyAmount(value)}
                onBuyConfirm={handleBuyConfirm}
                isBuying={isBuying}
                transactionHash={transactionHash}
            />
        </Box>
    )
}
