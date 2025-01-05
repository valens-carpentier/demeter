import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material'
import { Dashboard, AccountBalance, Work, Settings, Logout } from '@mui/icons-material'
import { useRouter, usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface SidebarProps {
  children?: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    router.push('/')
  }

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Marketplace', icon: <AccountBalance />, path: '/dashboard/marketplace' },
    { text: 'Portfolio', icon: <Work />, path: '/dashboard/portfolio' },
    { text: 'Profile', icon: <Settings />, path: '/dashboard/profile', disabled: true }
  ]

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      position: 'relative'
    }}>
      <Box sx={{ width: '100%', mb: 2 }}>
        {children}
      </Box>
      <List sx={{ flex: '1 1 auto' }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
              disabled={item.disabled}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List sx={{ 
        position: 'absolute',
        bottom: 32,
        left: 0,
        width: '100%',
        pb: 2
      }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout sx={{ color: 'black' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              sx={{ 
                '& .MuiListItemText-primary': { 
                  color: 'white',
                  fontWeight: 500
                } 
              }} 
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )
}