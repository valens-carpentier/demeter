import {
    Paper, 
    Typography,
    Grid2, 
    Card, 
    CardContent, 
    Button, 
    Box,
} from '@mui/material'

import '../styles/holdinglist.css'

export default function HoldingList() {
    return (
        <>
            <Paper className="holding-list-container">
                <Typography className="holding-list-title">
                    My Holdings
                </Typography>

                <Box className="total-value-container">
                    <Typography className="holding-label">
                        Total Holdings Value:
                    </Typography>
                    <Typography className="holding-value">
                        $13,455.53
                    </Typography>
                </Box>

                <Grid2 container spacing={3}>
                    <Grid2 item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography className="holding-name">
                                    Ferme du Quennelet
                                </Typography>
                                <Box className="holding-details-container">
                                    <Grid2 container spacing={2} className="holding-grid">
                                        <Grid2 item xs={4}>
                                            <Typography className="holding-label">
                                                Number of Tokens
                                            </Typography>
                                            <Typography className="holding-value">
                                                1000
                                            </Typography>
                                        </Grid2>
                                        <Grid2 item xs={4}>
                                            <Typography className="holding-label">
                                                Farm Valuation
                                            </Typography>
                                            <Typography className="holding-value">
                                                $1,345,553
                                            </Typography>
                                        </Grid2>
                                        <Grid2 item xs={4}>
                                            <Typography className="holding-label">
                                                Your Share
                                            </Typography>
                                            <Typography className="holding-value">
                                                $13,455.53
                                            </Typography>
                                        </Grid2>
                                    </Grid2>
                                    <Button className="holding-view-details-button">
                                        View Details
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid2>
                </Grid2>
            </Paper>
        </>
    )
}