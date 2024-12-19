import { useState, useEffect } from 'react'
import {
    Paper, 
    Typography,
    Grid2, 
    Card, 
    CardContent, 
    CardActions,
    Button, 
    Chip
} from '@mui/material'

import loadFarms from '../lib/farmsUtils'

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
    const [farms, setFarms] = useState<Farm[]>([])
    const [loading, setLoading] = useState(true)

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

    return (
        <Paper sx={{ padding: '24px' }}>
          <Typography variant="h4" color="primary" gutterBottom>
            Available Farms
          </Typography>
          
          <Grid2 container spacing={3}>
            {farms.map((farm, index) => (
              <Grid2 item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {farm.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Size: {farm.sizeInAcres} acres
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Valuation: ${farm.valuation}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Expected Return: {farm.expectedOutcomePercentage}%
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Total Supply: {farm.totalTokenSupply} tokens
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Price per token: ${farm.valuation / farm.totalTokenSupply}
                    </Typography>
                    
                    <Chip 
                      label={farm.isActive ? 'Active' : 'Inactive'}
                      color={farm.isActive ? 'success' : 'error'}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      variant="contained"
                      disabled={!farm.isActive}
                      href={`/farms/${index}`}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid2>
            ))}
          </Grid2>
          
          {farms.length === 0 && (
            <Typography variant="body1" textAlign="center" sx={{ mt: 3 }}>
              No farms available yet.
            </Typography>
          )}
        </Paper>
      )
}