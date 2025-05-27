import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import {
  AccountCircle,
  Security,
  Storage,
  NetworkCheck,
  AccessTime as AccessTimeIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';

ChartJS.register(ArcElement, Tooltip, Legend);

const ComplianceChart = ({ compliant, partial, nonCompliant }) => {
  const theme = useTheme();
  
  const data = {
    labels: ['준수', '부분 준수', '미준수'],
    datasets: [
      {
        data: [compliant, partial, nonCompliant],
        backgroundColor: [theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
              let label = context.label || '';
              if (label) {
                  label += ': ';
              }
              label += context.raw + ' 항목';
              return label;
          }
        }
      }
    },
    cutout: '70%'
  };

  const totalItems = compliant + partial + nonCompliant;
  const compliancePercentage = totalItems > 0 ? Math.round((compliant / totalItems) * 100) : 0;
  
  // 각 항목의 비율 계산
  const compliantPercentage = totalItems > 0 ? Math.round((compliant / totalItems) * 100) : 0;
  const partialPercentage = totalItems > 0 ? Math.round((partial / totalItems) * 100) : 0;
  const nonCompliantPercentage = totalItems > 0 ? Math.round((nonCompliant / totalItems) * 100) : 0;

  return (
    <Card sx={{ 
      height: '100%',
      borderRadius: 3,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            보안 준수 현황
          </Typography>
          <Button 
            startIcon={<RefreshIcon />} 
            size="small"
            sx={{ 
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            새로고침
          </Button>
        </Box>
        
        <Grid container spacing={2}>
          {/* 도넛 차트와 준수율 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              position: 'relative',
              height: 280
            }}>
              <Box sx={{ width: '100%', height: 220, position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ 
                  position: 'absolute', 
                  top: '45%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  zIndex: 10,
                  pointerEvents: 'none',
                  width: '100%',
                  maxWidth: '120px'
                }}>
                  <Typography 
                    variant="h3" 
                    component="div" 
                    sx={{ 
                      fontWeight: 700,
                      color: compliancePercentage >= 90 
                        ? theme.palette.success.main 
                        : compliancePercentage >= 70 
                          ? theme.palette.warning.main 
                          : theme.palette.error.main,
                      textShadow: '0 0 10px rgba(255,255,255,0.8)'
                    }}
                  >
                    {compliancePercentage}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    준수율
                  </Typography>
                </Box>
                <Box sx={{ width: '80%', maxWidth: '220px' }}>
                  <Doughnut data={data} options={options} />
                </Box>
              </Box>
            </Box>
          </Grid>
          
          {/* 수평 바 형태의 상세 정보 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              {/* 준수 항목 */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>준수</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{compliant} 항목 ({compliantPercentage}%)</Typography>
                </Box>
                <Box sx={{ width: '100%', height: 8, bgcolor: alpha(theme.palette.success.main, 0.2), borderRadius: 4 }}>
                  <Box 
                    sx={{ 
                      width: `${compliantPercentage}%`, 
                      height: '100%', 
                      bgcolor: theme.palette.success.main, 
                      borderRadius: 4 
                    }} 
                  />
                </Box>
              </Box>
              
              {/* 부분 준수 항목 */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>부분 준수</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{partial} 항목 ({partialPercentage}%)</Typography>
                </Box>
                <Box sx={{ width: '100%', height: 8, bgcolor: alpha(theme.palette.warning.main, 0.2), borderRadius: 4 }}>
                  <Box 
                    sx={{ 
                      width: `${partialPercentage}%`, 
                      height: '100%', 
                      bgcolor: theme.palette.warning.main, 
                      borderRadius: 4 
                    }} 
                  />
                </Box>
              </Box>
              
              {/* 미준수 항목 */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>미준수</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{nonCompliant} 항목 ({nonCompliantPercentage}%)</Typography>
                </Box>
                <Box sx={{ width: '100%', height: 8, bgcolor: alpha(theme.palette.error.main, 0.2), borderRadius: 4 }}>
                  <Box 
                    sx={{ 
                      width: `${nonCompliantPercentage}%`, 
                      height: '100%', 
                      bgcolor: theme.palette.error.main, 
                      borderRadius: 4 
                    }} 
                  />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>총 항목: {totalItems}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const RecentActivities = ({ activities }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ 
      height: '100%',
      borderRadius: 3,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            최근 활동
          </Typography>
          <Button 
            size="small"
            sx={{ 
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            모두 보기
          </Button>
        </Box>
        
        <List disablePadding>
          {activities.map((activity, index) => (
            <React.Fragment key={index}>
              <ListItem 
                disablePadding 
                sx={{ 
                  py: 1.5,
                  px: 0,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: 1.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    }}
                  >
                    {React.cloneElement(activity.icon, { 
                      sx: { 
                        fontSize: 18,
                        color: theme.palette.primary.main 
                      } 
                    })}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={activity.text}
                  secondary={activity.time}
                  primaryTypographyProps={{ 
                    variant: 'body2', 
                    fontWeight: 600,
                    color: 'text.primary'
                  }}
                  secondaryTypographyProps={{ 
                    variant: 'caption',
                    color: 'text.secondary'
                  }}
                />
              </ListItem>
              {index < activities.length - 1 && (
                <Divider component="li" sx={{ my: 0.5, opacity: 0.6 }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();

  // 임시 데이터 - 스크린샷 기반
  const statusData = [
    {
      title: '계정 및 접근 관리',
      icon: <AccountCircle />,
      status: 'medium', // 주의 필요
      statusText: 'MFA 미설정 계정 및 불필요한 액세스 키가 발견되었습니다.',
      itemCount: 3,
      onDetailClick: () => navigate('/account-management'), // Link to AccountManagement page
    },
    {
      title: '네트워크 보안',
      icon: <NetworkCheck />,
      status: 'high', // 심각
      statusText: '일부 보안 그룹에서 0.0.0.0/0으로 열린 포트가 발견되었습니다.',
      itemCount: 5,
      onDetailClick: () => navigate('/network-security'), // Link to NetworkSecurity page
    },
    {
      title: '데이터 보호',
      icon: <Storage />,
      status: 'ok', // 양호
      statusText: '대부분의 데이터 저장소가 암호화되어 있습니다.',
      itemCount: 1,
      onDetailClick: () => navigate('/data-protection'), // Link to DataProtection page
    },
    {
      title: '로깅 및 모니터링',
      icon: <AccessTimeIcon />,
      status: 'medium', // 주의 필요
      statusText: 'CloudTrail이 일부 리전에서 활성화되지 않았습니다.',
      itemCount: 2,
      onDetailClick: () => navigate('/logging'), // Link to Logging page
    },
  ];

   // 임시 데이터 - 스크린샷 기반
  const complianceData = {
    compliant: 65, // 준수
    partial: 65,   // 부분 준수 (스크린샷에 65% 옆 65가 총 항목인지 부분 준수인지 불분명하여 임의로 부분 준수에 할당)
    nonCompliant: 8, // 미준수
  };

  // 임시 데이터 - 스크린샷 기반
  const recentActivitiesData = [
    { text: '보안 그룹 규칙 변경', time: '10분 전', icon: <Security /> },
    { text: '새 IAM 사용자 생성', time: '1시간 전', icon: <AccountCircle /> },
    { text: 'CloudTrail 로그 검토', time: '3시간 전', icon: <AccessTimeIcon /> },
    { text: 'S3 버킷 암호화 활성화', time: '어제', icon: <Storage /> },
    { text: 'VPC 설정 변경', time: '2일 전', icon: <NetworkCheck /> },
  ];

  return (
    <Box className="fade-in">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', md: 'center' },
        mb: 4 
      }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(45deg, #0078d4 30%, #4aa3f3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            대시보드
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AWS 환경의 보안 상태를 한눈에 확인하세요.
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          startIcon={<RefreshIcon />}
          sx={{ 
            mt: { xs: 2, md: 0 },
            background: 'linear-gradient(45deg, #0078d4 30%, #4aa3f3 90%)',
            boxShadow: '0 4px 12px rgba(0, 120, 212, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0, 120, 212, 0.4)',
            }
          }}
        >
          새로고침
        </Button>
      </Box>

      {/* 상태 요약 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statusData.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <DashboardCard {...item} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* 보안 준수 현황 - 더 넓게 표시 */}
        <Grid item xs={12} md={8}>
          <ComplianceChart {...complianceData} />
        </Grid>

        {/* 최근 활동 - 더 좁게 표시 */}
        <Grid item xs={12} md={4}>
          <RecentActivities activities={recentActivitiesData} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;