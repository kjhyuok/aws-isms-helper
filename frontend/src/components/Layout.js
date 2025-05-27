import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Button,
  Avatar,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Storage as StorageIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { AccountCircle as AccountCircleIcon, NetworkCheck as NetworkCheckIcon } from '@mui/icons-material';

const drawerWidth = 260;

const menuSections = [
  {
    title: '보안 관리',
    items: [
      { text: '대시보드', icon: <DashboardIcon />, path: '/' },
      { text: '계정 및 접근 관리', icon: <AccountCircleIcon />, path: '/account-management' },
      { text: '네트워크 보안', icon: <NetworkCheckIcon />, path: '/network-security' },
      { text: '데이터 보호', icon: <StorageIcon />, path: '/data-protection' },
      { text: '로깅 및 모니터링', icon: <AssessmentIcon />, path: '/logging' },
    ],
  },
  {
    title: '보고서 및 설정',
    items: [
      { text: '보고서', icon: <AssessmentIcon />, path: '/reports' },
      { text: '설정', icon: <SettingsIcon />, path: '/settings' },
    ],
  },
];

function Layout({ children, user, signOut }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    setMobileOpen(false); // Close drawer on mobile after click
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(180deg, rgba(247,249,252,1) 0%, rgba(255,255,255,1) 100%)'
    }}>
      {/* 로고 영역 */}
      <Box
        sx={{ 
          py: 2,
          px: 3,
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0078d4 0%, #4aa3f3 100%)',
          borderRadius: '12px',
          p: 1.5,
          width: '100%'
        }}>
          <Typography variant="h6" noWrap component="div" sx={{ color: '#ffffff', fontWeight: 700 }}>
            모두의 <span style={{ color: '#ffac33' }}>ISMS</span>
          </Typography>
        </Box>
      </Box>

      {/* 메뉴 섹션 */}
      <Box sx={{ flexGrow: 1, px: 2, overflow: 'auto' }}>
        {menuSections.map((section, sectionIndex) => (
          <React.Fragment key={sectionIndex}>
            <Typography 
              variant="overline" 
              sx={{ 
                fontWeight: 700, 
                color: theme.palette.text.secondary,
                px: 2,
                py: 1,
                display: 'block'
              }}
            >
              {section.title}
            </Typography>
            <List sx={{ mb: 2 }}>
              {section.items.map((item) => {
                const isSelected = location.pathname === item.path;
                return (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => handleMenuItemClick(item.path)}
                      sx={{
                        borderRadius: '10px',
                        py: 1,
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.15),
                          },
                          '& .MuiListItemIcon-root': {
                            color: theme.palette.primary.main,
                          },
                          '& .MuiListItemText-primary': {
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                          }
                        },
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        minWidth: 40,
                        color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text} 
                        primaryTypographyProps={{ 
                          fontSize: '0.95rem',
                          fontWeight: isSelected ? 600 : 500
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </React.Fragment>
        ))}
      </Box>

      {/* 하단 정보 */}
      <Box sx={{ p: 2 }}>
        <Box 
          sx={{ 
            p: 2, 
            borderRadius: 2, 
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <Typography variant="caption" color="text.secondary" align="center">
            AWS 보안 대시보드 v1.0
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center">
            © 2023 AWS Security
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  // 사용자 이메일 또는 기본값
  const userEmail = user?.attributes?.email || user?.username || '관리자';
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f7f9fc', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#ffffff',
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Toolbar>
          {/* Menu icon for mobile */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* 검색 영역 */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              bgcolor: alpha(theme.palette.common.black, 0.04),
              borderRadius: 2,
              px: 2,
              py: 0.5,
              mr: 2,
              flexGrow: { xs: 1, md: 0 },
              width: { md: 300 }
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">검색...</Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />

          {/* 알림 아이콘 */}
          <Tooltip title="알림">
            <IconButton 
              sx={{ 
                mx: 1, 
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                }
              }}
            >
              <NotificationsIcon sx={{ color: theme.palette.primary.main }} />
            </IconButton>
          </Tooltip>

          {/* User info and Logout */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            ml: 1
          }}>
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: theme.palette.primary.main,
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              {userInitial}
            </Avatar>
            <Box sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {userEmail}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                관리자
              </Typography>
            </Box>
            {signOut && (
              <Tooltip title="로그아웃">
                <IconButton 
                  color="inherit" 
                  onClick={signOut} 
                  sx={{ ml: 1, color: 'text.secondary' }}
                >
                  <ExitToAppIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#f7f9fc',
          minHeight: '100vh',
        }}
      >
        <Toolbar /> {/* Add toolbar height padding */}
        {children}
      </Box>
    </Box>
  );
}

export default Layout;