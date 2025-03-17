'use client'

import { useState, useEffect, useContext } from 'react'
import { 
    Box, 
    Typography, 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    CircularProgress,

} from '@mui/material'
import { SafeAddressContext } from '@/app/contexts/SafeContext'
import { loadTransactions, Transaction } from '../lib/transactionUtils'
import { useRouter } from 'next/navigation'
import { useTheme } from '@mui/material/styles'

export default function TransactionModule() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const safeAddress = useContext(SafeAddressContext)
    const router = useRouter()
    const theme = useTheme()

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!safeAddress) {
                console.log('No safe address available');
                return;
            }
            
            try {
                setLoading(true); // Ensure loading is set to true at the start
                console.log('Fetching transactions for address:', safeAddress);
                const txData = await loadTransactions(safeAddress);
                console.log('Fetched transactions:', txData);
                
                // Only show the most recent 5 transactions
                setTransactions(txData.slice(0, 5));
            } catch (error) {
                console.error('Error loading transactions:', error);
            } finally {
                // Add a small delay to match the loading timing with HoldingList
                setTimeout(() => {
                    setLoading(false);
                }, 100); // Small delay to synchronize with HoldingList
            }
        }

        fetchTransactions();
    }, [safeAddress]);

    const handleViewAll = () => {
        router.push('/dashboard/transactions')
    }

    return (
        <Box sx={{
            padding: 2,
            backgroundColor: '#FFFFFF',
            borderRadius: 2,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
            width: '100%',
            overflowX: 'auto'
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{
                    color: '#2C3E2D',
                    fontWeight: 700,
                }}>
                    Recent Transactions
                </Typography>
                {!loading && (
                    <Button
                        variant="text"
                        onClick={handleViewAll}
                        sx={{
                            fontWeight: 600,
                            textTransform: 'none',
                            color: '#4CAF50',
                        }}
                    >
                        View All
                    </Button>
                )}
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
                    {transactions.length === 0 ? (
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            height: '100px',
                        }}>
                            <Typography variant="body2" color="text.secondary">
                                No transactions found
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} sx={{
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: '#F5F2EA'
                        }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{
                                            color: '#5C745D',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            padding: '12px'
                                        }}>Type</TableCell>
                                        <TableCell sx={{
                                            color: '#5C745D',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            padding: '12px'
                                        }}>Tokens</TableCell>
                                        <TableCell sx={{
                                            color: '#5C745D',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            padding: '12px'
                                        }}>Farm</TableCell>
                                        <TableCell sx={{
                                            color: '#5C745D',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            padding: '12px'
                                        }}>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactions.map((tx) => (
                                        <TableRow key={tx.hash} sx={{
                                            '&:hover': {
                                                backgroundColor: '#F5F2EA'
                                            }
                                        }}>
                                            <TableCell sx={{ padding: '12px' }}>{tx.type}</TableCell>
                                            <TableCell sx={{ padding: '12px' }}>{tx.amount}</TableCell>
                                            <TableCell sx={{ padding: '12px' }}>{tx.farmName}</TableCell>
                                            <TableCell sx={{ padding: '12px' }}>{new Date(tx.date).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </>
            )}
        </Box>
    )
}