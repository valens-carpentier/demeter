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
    CircularProgress
} from '@mui/material'
import { SafeAddressContext, PasskeyContext } from '@/app/contexts/SafeContext'
import { loadTransactions, Transaction } from '../../../lib/transactionUtils'
import { useRouter } from 'next/navigation'
import styles from '@/styles/pages/transaction.module.css'

export default function Transactions() {
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const passkey = useContext(PasskeyContext)
    const router = useRouter()
    
    const safeAddress = useContext(SafeAddressContext)
    const [selected, setSelected] = useState<string[]>([])

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

    if (loading) {
        return (
            <Box className={styles.transactionContainer}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography className={styles.transactionTitle} variant="h4">
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
        <Box className={styles.transactionContainer}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography className={styles.transactionTitle} variant="h4">
                    Transactions
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button className={`${styles.transactionButton} ${styles.outlined}`} variant="outlined" disabled={true}>
                        Filter
                    </Button>
                    <Button className={`${styles.transactionButton} ${styles.outlined}`} variant="outlined" disabled={true}>
                        Export
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper} className={styles.transactionTable}>
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
                                        className={styles.transactionLink}
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
                <Typography className={styles.noTransactionsMessage}>
                    No transactions found.
                </Typography>
            )}
        </Box>
    )
}
