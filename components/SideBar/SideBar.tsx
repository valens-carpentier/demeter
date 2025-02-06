import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material'
import { Dashboard, AccountBalance, AccountBalanceWallet, Settings, Logout, History } from '@mui/icons-material'
import { useRouter, usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import styles from '@/components/SideBar/SideBar.module.css'

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
    { text: 'Portfolio', icon: <AccountBalanceWallet />, path: '/dashboard/portfolio' },
    { text: 'Transactions', icon: <History />, path: '/dashboard/transactions' },
    { text: 'Profile', icon: <Settings />, path: '/dashboard/profile', disabled: true }
  ]

  return (
    <Box className={styles.sidebarWrapper}>
      <Box className={styles.childrenContainer}>
        {children}
      </Box>
      <Box className={styles.menuContainer}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                className={`${styles.menuItem} ${pathname === item.path ? styles.menuItemActive : ''}`}
                onClick={() => router.push(item.path)}
                disabled={item.disabled}
              >
                <ListItemIcon className={styles.menuItemIcon}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List className={styles.logoutContainer}>
          <ListItem disablePadding>
            <ListItemButton 
              className={styles.menuItem}
              onClick={handleLogout}
            >
              <ListItemIcon className={styles.menuItemIcon}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  )
}