'use client'

import { useState, useEffect, useContext } from 'react'
import { 
    Box, 
    Typography, 
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Paper,
    Button,
    CircularProgress,
    TablePagination
} from '@mui/material'
import { SafeAddressContext, PasskeyContext } from '@/app/contexts/SafeContext'
import { loadTransactions, Transaction } from '../../../lib/transactionUtils'
import { useRouter } from 'next/navigation'

export default function Transactions() {
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const passkey = useContext(PasskeyContext)
    const router = useRouter()
    
    const safeAddress = useContext(SafeAddressContext)
    const [selected, setSelected] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    useEffect(() => {
        if (passkey) {
          router.push(`/dashboard/transactions?passkeyId=${passkey.rawId}`)
        }
    }, [passkey, router])

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const txData = await loadTransactions(safeAddress || '')
                setFilteredTransactions(txData)
            } catch (error) {
                console.error('Error loading transactions:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchTransactions()
    }, [safeAddress])
    
    // Add handler for checkbox selection
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelected(filteredTransactions.map(tx => tx.hash))
        } else {
            setSelected([])
        }
    }

    const handleSelectOne = (hash: string) => {
        const selectedIndex = selected.indexOf(hash)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = [...selected, hash]
        } else {
            newSelected = selected.filter(id => id !== hash)
        }

        setSelected(newSelected)
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 15))
        setPage(0)
    }

    if (loading) {
        return (
            <Box sx={{
                padding: 3,
                backgroundColor: '#FFFFFF',
                maxWidth: 1200,
                margin: '32px auto',
                borderRadius: 2,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                marginLeft: '2%',
                marginRight: '2%'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{
                        color: '#2C3E2D',
                        fontWeight: 700,
                        fontSize: '2rem',
                        letterSpacing: '-0.025em'
                    }}>
                        Transactions
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
                        Loading transactions...
                    </Typography>
                </Box>
            </Box>
        )
    }

    return (
        <Box sx={{
            padding: 3,
            backgroundColor: '#FFFFFF',
            maxWidth: 1200,
            margin: '32px auto',
            borderRadius: 2,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
            marginLeft: '2%',
            marginRight: '2%',
            overflowX: 'auto'
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{
                    color: '#2C3E2D',
                    fontWeight: 700,
                    fontSize: '2rem',
                    letterSpacing: '-0.025em'
                }}>
                    Transactions
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        disabled={true}
                        sx={{
                            borderRadius: '6px',
                            padding: '12px 24px',
                            fontWeight: 600,
                            textTransform: 'none',
                            border: '2px solid #4CAF50',
                            color: '#4CAF50',
                            '&:hover': {
                                backgroundColor: '#F5F2EA',
                                border: '2px solid #4CAF50'
                            }
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        variant="outlined"
                        disabled={true}
                        sx={{
                            borderRadius: '6px',
                            padding: '12px 24px',
                            fontWeight: 600,
                            textTransform: 'none',
                            border: '2px solid #4CAF50',
                            color: '#4CAF50',
                            '&:hover': {
                                backgroundColor: '#F5F2EA',
                                border: '2px solid #4CAF50'
                            }
                        }}
                    >
                        Export
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{
                width: '95%',
                borderRadius: '8px',
                overflow: 'hidden',
                minWidth: '800px',
                backgroundColor: '#F5F2EA'
            }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selected.length === filteredTransactions.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell sx={{
                                color: '#5C745D',
                                fontSize: '14px',
                                fontWeight: 600,
                                padding: '16px'
                            }}>Type</TableCell>
                            <TableCell sx={{
                                color: '#5C745D',
                                fontSize: '14px',
                                fontWeight: 600,
                                padding: '16px'
                            }}>Number of Tokens</TableCell>
                            <TableCell sx={{
                                color: '#5C745D',
                                fontSize: '14px',
                                fontWeight: 600,
                                padding: '16px'
                            }}>Price</TableCell>
                            <TableCell sx={{
                                color: '#5C745D',
                                fontSize: '14px',
                                fontWeight: 600,
                                padding: '16px'
                            }}>Farm</TableCell>
                            <TableCell sx={{
                                color: '#5C745D',
                                fontSize: '14px',
                                fontWeight: 600,
                                padding: '16px'
                            }}>Transaction Details</TableCell>
                            <TableCell sx={{
                                color: '#5C745D',
                                fontSize: '14px',
                                fontWeight: 600,
                                padding: '16px'
                            }}>Date</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTransactions
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((tx) => (
                                <TableRow key={tx.hash} sx={{
                                    '&:hover': {
                                        backgroundColor: '#F5F2EA'
                                    }
                                }}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selected.includes(tx.hash)}
                                            onChange={() => handleSelectOne(tx.hash)}
                                        />
                                    </TableCell>
                                    <TableCell sx={{
                                        color: '#2C3E2D',
                                        fontSize: '14px',
                                        padding: '16px',
                                        fontWeight: 500
                                    }}>{tx.type}</TableCell>
                                    <TableCell sx={{
                                        color: '#2C3E2D',
                                        fontSize: '14px',
                                        padding: '16px',
                                        fontWeight: 500
                                    }}>
                                        {tx.amount}
                                    </TableCell>
                                    <TableCell sx={{
                                        color: '#2C3E2D',
                                        fontSize: '14px',
                                        padding: '16px',
                                        fontWeight: 500
                                    }}>
                                        ${(tx.price * tx.amount / 100).toFixed(2)}
                                    </TableCell>
                                    <TableCell sx={{
                                        color: '#2C3E2D',
                                        fontSize: '14px',
                                        padding: '16px',
                                        fontWeight: 500
                                    }}>{tx.farmName}</TableCell>
                                    <TableCell sx={{
                                        color: '#2C3E2D',
                                        fontSize: '14px',
                                        padding: '16px',
                                        fontWeight: 500
                                    }}>
                                        <Link
                                            href={`https://sepolia.basescan.org/tx/${tx.hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                color: '#4CAF50',
                                                textDecoration: 'none',
                                                fontFamily: 'monospace',
                                                fontSize: '14px',
                                                '&:hover': {
                                                    textDecoration: 'underline'
                                                }
                                            }}
                                        >
                                            {`${tx.hash.slice(0,6)}...${tx.hash.slice(-4)}`}
                                        </Link>
                                    </TableCell>
                                    <TableCell sx={{
                                        color: '#2C3E2D',
                                        fontSize: '14px',
                                        padding: '16px',
                                        fontWeight: 500
                                    }}>
                                        {new Date(tx.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="right">
                                        {/* Add your action buttons/menu here */}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredTransactions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                            color: '#5C745D',
                        },
                        '& .MuiSelect-select': {
                            color: '#4CAF50',
                        },
                        '& .MuiSvgIcon-root': {
                            color: '#4CAF50',
                        }
                    }}
                />
            </Box>

            {filteredTransactions.length === 0 && (
                <Typography sx={{
                    textAlign: 'center',
                    color: '#5C745D',
                    padding: '32px',
                    fontSize: '16px'
                }}>
                    No transactions found.
                </Typography>
            )}
        </Box>
    )
}
