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
    Button
} from '@mui/material'
import { SafeAddressContext, PasskeyContext } from '../../dashboard/layout'
import { loadTransactions } from '../../../lib/transactionUtils'
import { useRouter } from 'next/navigation'
import '@/styles/transaction.css'

export default function Transactions() {
    const [transactions, setTransactions] = useState([])
    const [filteredTransactions, setFilteredTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const passkey = useContext(PasskeyContext)
    const router = useRouter()
    
    const safeAddress = useContext(SafeAddressContext)
    const [selected, setSelected] = useState([])

    useEffect(() => {
        if (passkey) {
          router.push(`/dashboard/transactions?passkeyId=${passkey.rawId}`)
        }
      }, [passkey, router])

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const txData = await loadTransactions(safeAddress)
                setTransactions(txData)
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
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelected(filteredTransactions.map(tx => tx.hash))
        } else {
            setSelected([])
        }
    }

    const handleSelectOne = (hash) => {
        const selectedIndex = selected.indexOf(hash)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = [...selected, hash]
        } else {
            newSelected = selected.filter(id => id !== hash)
        }

        setSelected(newSelected)
    }

    if (loading) {
        return (
            <Box sx={{ padding: 3 }}>
                <Typography>Loading transactions...</Typography>
            </Box>
        )
    }

    return (
        <Box className="transaction-container">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography className="transaction-title" variant="h4">
                    Transactions
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button className="transaction-button outlined" variant="outlined" disabled={true} >Filter</Button>
                    <Button className="transaction-button outlined" variant="outlined" disabled={true}>Export</Button>
                </Box>
            </Box>

            <TableContainer component={Paper} className="transaction-table">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selected.length === filteredTransactions.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Number of Tokens</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Farm</TableCell>
                            <TableCell>Transaction Details</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTransactions.map((tx) => (
                            <TableRow key={tx.hash}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selected.includes(tx.hash)}
                                        onChange={() => handleSelectOne(tx.hash)}
                                    />
                                </TableCell>
                                <TableCell>{tx.type}</TableCell>
                                <TableCell>
                                    {tx.amount}
                                </TableCell>
                                <TableCell>
                                    ${(tx.price * tx.amount / 100).toFixed(2)}
                                </TableCell>
                                <TableCell>{tx.farmName}</TableCell>
                                <TableCell>
                                    <Link
                                        href={`https://sepolia.basescan.org/tx/${tx.hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ 
                                            textDecoration: 'underline',
                                            color: '#5C745D',
                                            fontFamily: 'monospace',
                                            fontSize: '12px',
                                            '&:hover': {
                                                opacity: 0.7
                                            }
                                        }}
                                    >
                                        {`${tx.hash.slice(0,6)}...${tx.hash.slice(-4)}`}
                                    </Link>
                                </TableCell>
                                <TableCell>
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

            {filteredTransactions.length === 0 && (
                <Typography className="no-transactions-message">
                    No transactions found.
                </Typography>
            )}
        </Box>
    )
}
