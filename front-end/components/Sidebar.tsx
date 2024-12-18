import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material'
import { Dashboard, AccountBalance, Work, Settings } from '@mui/icons-material'
import { useRouter, usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface SidebarProps {
  children?: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Marketplace', icon: <AccountBalance />, path: '/dashboard/marketplace' },
    { text: 'Portfolio', icon: <Work />, path: '/dashboard/portfolio' },
    { text: 'Profile', icon: <Settings />, path: '/dashboard/profile' }
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ width: '100%' }}>
        {children}
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}