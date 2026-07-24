import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import {
  Storage as StorageIcon,
  Security as SecurityIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  VpnKey as JwtIcon,
  AccountCircle as AccountIcon,
  CheckCircle as CheckIcon,
  SwapHoriz as SwapIcon,
  Terminal as TerminalIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { RoleType } from '../../types';
import { Notifications as BellIcon } from '@mui/icons-material';

interface AzureHeaderProps {
  themeMode: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenSwagger: () => void;
  activeModuleTitle: string;
  onLogout: () => void;
}

export const AzureHeader: React.FC<AzureHeaderProps> = ({
  themeMode,
  onToggleTheme,
  onOpenSwagger,
  activeModuleTitle,
  onLogout,
}) => {
  const { user, activeRole } = useAuth();
  const { notifications, markNotificationRead, clearNotifications } = useData();
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);

  const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchorEl(event.currentTarget);
  };
  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getRoleColor = (role: RoleType) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'EMPLOYEE':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar variant="dense" sx={{ minHeight: 48, px: 2 }}>
        {/* Brand & System Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.contrastText',
              fontWeight: 800,
              fontSize: '0.95rem',
              mr: 1.5,
            }}
          >
            SM
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                lineHeight: 1.1,
                textTransform: 'uppercase',
                fontSize: '1.1rem', // 22px
                letterSpacing: '0.04em',
              }}
            >
              Smart Management
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Divider orientation="vertical" flexItem sx={{ borderColor: 'divider', my: 1, mx: 1.5 }} />

        {/* Breadcrumb / Active Module */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Chip
            size="small"
            label="ENTERPRISE PORTAL"
            variant="outlined"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'text.secondary',
              borderColor: 'divider',
              bgcolor: 'background.default',
            }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            / {activeModuleTitle}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />



        {/* User Name & Profile Badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, display: { xs: 'none', sm: 'block' }, color: 'text.primary' }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Chip
            label={activeRole}
            color={activeRole === 'ADMIN' ? 'error' : 'primary'}
            size="small"
            sx={{ fontWeight: 800, height: 20, fontSize: '0.65rem' }}
          />
        </Box>

        {/* Action Tools: Swagger */}
        <Tooltip title="Open REST Swagger API Test Studio">
          <IconButton size="small" onClick={onOpenSwagger} sx={{ color: 'text.secondary', mr: 0.5 }}>
            <TerminalIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        {/* Theme Switcher */}
        <Tooltip title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
          <IconButton size="small" onClick={onToggleTheme} sx={{ color: 'text.secondary', mr: 1.5 }}>
            {themeMode === 'light' ? <DarkIcon sx={{ fontSize: 18 }} /> : <LightIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </Tooltip>

        {/* Notifications Bell Icon */}
        <Tooltip title="View System Notifications">
          <IconButton size="small" onClick={handleNotifOpen} sx={{ color: 'text.secondary', mr: 1.5 }}>
            <Badge
              badgeContent={unreadCount}
              color="error"
              max={99}
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.62rem',
                  height: 16,
                  minWidth: 16,
                  padding: '0 4px',
                },
              }}
            >
              <BellIcon sx={{ fontSize: 18 }} />
            </Badge>
          </IconButton>
        </Tooltip>
        <Popover
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={handleNotifClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          slotProps={{
            paper: {
              sx: {
                width: 320,
                maxHeight: 400,
                borderRadius: 1.5,
                mt: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
              },
            },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              System Notifications ({unreadCount} unread)
            </Typography>
            {notifications.length > 0 && (
              <Button size="small" variant="text" onClick={clearNotifications} sx={{ fontSize: '0.7rem', p: 0, fontWeight: 700 }}>
                Clear All
              </Button>
            )}
          </Box>
          <List sx={{ p: 0, overflowY: 'auto', flexGrow: 1 }}>
            {notifications.length === 0 ? (
              <Box sx={{ py: 6, px: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                  No new notifications
                </Typography>
              </Box>
            ) : (
              notifications.map((n) => (
                <ListItem
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: n.read ? 'transparent' : 'action.hover',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.selected' },
                    px: 2.5,
                    py: 1.5,
                  }}
                >
                  <ListItemText
                    primary={n.title}
                    secondary={n.message}
                    primaryTypographyProps={{
                      variant: 'subtitle2',
                      sx: { fontWeight: n.read ? 600 : 800, fontSize: '0.8rem', color: n.read ? 'text.secondary' : 'text.primary' },
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption',
                      sx: { fontSize: '0.7rem', display: 'block', mt: 0.5, color: 'text.secondary' },
                    }}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Popover>

        {/* Profile Avatar */}
        <Box>
          <Tooltip title="User Account Menu">
            <IconButton
              size="small"
              onClick={(e) => setProfileAnchorEl(e.currentTarget)}
              sx={{ p: 0.5, border: '1px solid', borderColor: 'divider' }}
            >
              <Avatar
                src={user?.profilePictureUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394A3B8'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>"}
                sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.75rem', fontWeight: 700 }}
              />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={() => setProfileAnchorEl(null)}
            slotProps={{
              paper: {
                sx: {
                  width: 250,
                  mt: 1,
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {user?.email}
              </Typography>
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, mt: 0.5, display: 'block' }}>
                {user?.designation} ({user?.department})
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { setProfileAnchorEl(null); onLogout(); }} sx={{ color: 'error.main', fontWeight: 600 }}>
              Sign Out Session
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
