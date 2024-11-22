'use client'

import { Paper, Typography } from '@mui/material'

export default function DashboardPage() {
  return (
    <Paper sx={{ padding: '24px' }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Welcome to your farm token dashboard. Here you can manage your farm tokens and track your investments.
      </Typography>
    </Paper>
  )
}