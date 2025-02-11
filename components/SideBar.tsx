import { 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Box, 
    styled 
} from '@mui/material'
import { Dashboard, AccountBalance, AccountBalanceWallet, Settings, Logout, History } from '@mui/icons-material'
import { useRouter, usePathname } from 'next/navigation'
import { useMemo } from 'react'
import SafeAccountDetails from '@/components/SafeAccountDetails'
import { PasskeyArgType } from '@safe-global/protocol-kit'

interface SidebarProps {
  passkey: PasskeyArgType;
  onSafeAddress: (address: string) => void;
}

const SidebarWrapper = styled(Box)(({ theme }) => ({
    height: '97vh',
    display: 'flex',
    flexDirection: 'column',
    width: 280,
    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: '#FFFFFF',
    position: 'fixed',
    left: 0,
    top: 0,
    padding: '32px 20px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
    [theme.breakpoints.down('md')]: {
        width: '100%',
        position: 'relative',
        height: 'auto'
    }
}))

const MenuContainer = styled(Box)({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
})

const MenuItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: '8px',
    transition: theme.transitions.create(['background-color', 'color'], {
        duration: theme.transitions.duration.short,
    }),
    '&:hover': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.secondary.main,
    },
    '&.active': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.secondary.main,
        fontWeight: 600,
        '& .MuiListItemIcon-root': {
            color: theme.palette.primary.main,
        },
    },
}))

const MenuItemIcon = styled(ListItemIcon)(({ theme }) => ({
    color: theme.palette.secondary.light,
    marginRight: '12px',
}))

export default function Sidebar({ passkey, onSafeAddress }: SidebarProps) {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
        router.push('/')
    }

    const memoizedMenuItems = useMemo(() => [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Marketplace', icon: <AccountBalance />, path: '/dashboard/marketplace' },
        { text: 'Portfolio', icon: <AccountBalanceWallet />, path: '/dashboard/portfolio' },
        { text: 'Transactions', icon: <History />, path: '/dashboard/transactions' },
        { text: 'Profile', icon: <Settings />, path: '/dashboard/profile', disabled: true }
    ], [])

    return (
        <SidebarWrapper>
            <Box>
                <SafeAccountDetails 
                    passkey={passkey} 
                    onSafeAddress={onSafeAddress}
                />
            </Box>
            <MenuContainer>
                <List>
                    {memoizedMenuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <MenuItemButton 
                                aria-label={item.text}
                                role="menuitem"
                                tabIndex={0}
                                className={pathname === item.path ? 'active' : ''}
                                onClick={() => router.push(item.path)}
                                disabled={item.disabled}
                            >
                                <MenuItemIcon>{item.icon}</MenuItemIcon>
                                <ListItemText primary={item.text} />
                            </MenuItemButton>
                        </ListItem>
                    ))}
                </List>
                <List sx={{ marginBottom: '32px' }}>
                    <ListItem disablePadding>
                        <MenuItemButton onClick={handleLogout}>
                            <MenuItemIcon>
                                <Logout />
                            </MenuItemIcon>
                            <ListItemText primary="Logout" />
                        </MenuItemButton>
                    </ListItem>
                </List>
            </MenuContainer>
        </SidebarWrapper>
    )
}