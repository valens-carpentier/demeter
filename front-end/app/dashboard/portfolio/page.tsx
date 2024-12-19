'use client'

import { Box, Typography, Paper } from '@mui/material'

export default function Portfolio() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Portfolio
      </Typography>

      <Paper sx={{ 
        p: 4, 
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)'
      }}>
        <Typography>
          Coming soon...
        </Typography>
      </Paper>
    </Box>
  )
}
