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
  Search as SearchIcon,
  VerifiedUser as VerifiedUserIcon,
  Lock as LockIcon,
  EnhancedEncryption as EnhancedEncryptionIcon,
  Computer as ComputerIcon,
  Shield as ShieldIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Description as DescriptionIcon,
  Chat as ChatIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { AccountCircle as AccountCircleIcon, NetworkCheck as NetworkCheckIcon } from '@mui/icons-material';
import { useIsms } from '../contexts/IsmsContext';

const drawerWidth = 260;

function Layout({ children, user, signOut }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { ismsData } = useIsms();

  // ISMS 데이터에서 각 보안 영역의 준수 상태 계산
  const getComplianceStatus = (category) => {
    if (!ismsData || !ismsData.isms_mapping) return null;
    
    // 카테고리별 매핑 (사이드바 메뉴와 ISMS 항목 연결)
    const categoryMapping = {
      'account': ['2.5'], // 계정 및 접근관리 -> 2.5 인증 및 권한관리
      'network': ['2.6'], // 네트워크 보안 -> 2.6 접근통제
      'data': ['2.7'],    // 데이터 보호 -> 2.7 암호화 적용
      'logging': ['2.9']  // 로깅 및 모니터링 -> 2.9 시스템 및 서비스 운영관리
    };
    
    const relevantSections = categoryMapping[category] || [];
    if (relevantSections.length === 0) return null;
    
    // 관련 섹션의 준수율 계산
    let totalItems = 0;
    let compliantItems = 0;
    
    relevantSections.forEach(section => {
      const sectionData = ismsData.isms_mapping[section];
      if (sectionData && sectionData.items) {
        totalItems += sectionData.items.length;
        compliantItems += sectionData.items.filter(item => item.compliant).length;
      }
    });
    
    if (totalItems === 0) return null;
    
    const complianceRate = (compliantItems / totalItems) * 100;
    return {
      rate: complianceRate,
      status: complianceRate >= 80 ? 'compliant' : complianceRate >= 50 ? 'partial' : 'non-compliant'
    };
  };

  const menuSections = [
    {
      title: 'ISMS 관리',
      items: [
        { text: 'ISMS 대시보드', icon: <SecurityIcon />, path: '/isms-dashboard' },
        { text: 'ISMS 통제항목', icon: <ShieldIcon />, path: '/isms-controls' },
      ],
    },
    {
      title: 'ISMS 지원 도구',
      items: [
        { text: '모의 인터뷰', icon: <QuestionAnswerIcon />, path: '/mock-interview' },
        { text: '보고서 만들기', icon: <DescriptionIcon />, path: '/report-generator' },
        { text: 'ISMS-AIChat', icon: <ChatIcon />, path: '/isms-ai-chat' },
      ],
    },
    {
      title: '보안 관리',
      items: [
        { text: '대시보드', icon: <DashboardIcon />, path: '/' },
        { 
          text: '계정 및 접근 관리', 
          icon: <AccountCircleIcon />, 
          path: '/account-management',
          compliance: getComplianceStatus('account')
        },
        { 
          text: '네트워크 보안', 
          icon: <NetworkCheckIcon />, 
          path: '/network-security',
          compliance: getComplianceStatus('network')
        },
        { 
          text: '데이터 보호', 
          icon: <StorageIcon />, 
          path: '/data-protection',
          compliance: getComplianceStatus('data')
        },
        { 
          text: '로깅 및 모니터링', 
          icon: <VisibilityIcon />, 
          path: '/logging',
          compliance: getComplianceStatus('logging')
        },
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
                      
                      {/* 준수 상태 표시 */}
                      {item.compliance && (
                        <Box 
                          sx={{ 
                            width: 10, 
                            height: 10, 
                            borderRadius: '50%', 
                            bgcolor: item.compliance.status === 'compliant' 
                              ? theme.palette.success.main 
                              : item.compliance.status === 'partial' 
                                ? theme.palette.warning.main 
                                : theme.palette.error.main,
                            ml: 1
                          }} 
                        />
                      )}
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
