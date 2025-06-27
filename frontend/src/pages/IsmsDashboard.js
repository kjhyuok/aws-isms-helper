import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Divider,
  Button,
  useTheme,
  alpha,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  VerifiedUser as VerifiedUserIcon,
  Lock as LockIcon,
  EnhancedEncryption as EnhancedEncryptionIcon,
  Computer as ComputerIcon,
  Shield as ShieldIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getMockScanResult, getLatestScanResult } from '../services/ismsService';
import IsmsScanner from '../components/IsmsScanner';
import { useIsms } from '../contexts/IsmsContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const IsmsDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { ismsData, loading: ismsLoading, error: ismsError, fetchIsmsData } = useIsms();

  // 스캔 완료 후 데이터 새로고침
  const handleScanComplete = async () => {
    console.log('IsmsDashboard: 스캔 완료 후 데이터 새로고침');
    await fetchIsmsData();
  };

  // 스캔 데이터가 없는 경우 로딩 표시
  if (ismsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 오류 발생 시 오류 메시지 표시
  if (ismsError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {ismsError}
      </Alert>
    );
  }

  // 스캔 데이터에서 필요한 정보 추출
  let complianceSummary = ismsData?.compliance_summary || {};
  let sectionSummary = complianceSummary.section_summary || {};
  
  // 데이터가 없는 경우 모의 데이터 사용
  if (!ismsData || !ismsData.isms_mapping) {
    console.log('IsmsDashboard: 데이터 없음, 모의 데이터 사용');
    const mockData = getMockScanResult();
    complianceSummary = mockData.compliance_summary || {};
    sectionSummary = mockData.compliance_summary.section_summary || {};
  }
  
  // ISMS 항목 데이터 (실제 스캔 결과로 업데이트)
  const ismsItems = [
    {
      id: '2.5',
      title: '인증 및 권한관리',
      description: '사용자 인증, 접근권한 관리, 특수 권한 관리, 사용자 인증 정보 관리에 대한 보안 요구사항',
      compliance: Math.round(sectionSummary['2.5']?.percentage || 0),
      icon: <VerifiedUserIcon fontSize="large" />,
      path: '/isms-auth-management',
      color: '#4caf50'
    },
    {
      id: '2.6',
      title: '접근통제',
      description: '네트워크, 시스템, 응용프로그램, 데이터베이스 등의 접근통제에 관한 보안 요구사항',
      compliance: Math.round(sectionSummary['2.6']?.percentage || 0),
      icon: <LockIcon fontSize="large" />,
      path: '/isms-access-control',
      color: '#ff9800'
    },
    {
      id: '2.7',
      title: '암호화 적용',
      description: '개인정보 및 중요정보 보호를 위한 암호화 적용 및 암호키 관리에 관한 보안 요구사항',
      compliance: Math.round(sectionSummary['2.7']?.percentage || 0),
      icon: <EnhancedEncryptionIcon fontSize="large" />,
      path: '/isms-encryption',
      color: '#2196f3'
    },
    {
      id: '2.9',
      title: '시스템 및 서비스 운영관리',
      description: '시스템 및 서비스의 안정적 운영을 위한 변경관리, 백업관리, 로그관리, 취약점 관리 등에 관한 보안 요구사항',
      compliance: Math.round(sectionSummary['2.9']?.percentage || 0),
      icon: <ComputerIcon fontSize="large" />,
      path: '/isms-system-operation',
      color: '#9c27b0'
    },
    {
      id: '2.10',
      title: '시스템 및 서비스 보안관리',
      description: '시스템 및 서비스의 보안을 위한 보안 요구사항 정의, 시스템 보안 구현, 안전한 개발환경 구축 등에 관한 보안 요구사항',
      compliance: Math.round(sectionSummary['2.10']?.percentage || 0),
      icon: <ShieldIcon fontSize="large" />,
      path: '/isms-system-security',
      color: '#f44336'
    }
  ];

  // 전체 ISMS 준수율 계산
  const overallCompliance = Math.round(complianceSummary.overall_percentage || 0);

  // ISMS 준수 현황 데이터
  const complianceData = {
    compliant: complianceSummary.compliant_items || 0,
    nonCompliant: (complianceSummary.total_items || 0) - (complianceSummary.compliant_items || 0)
  };

  // 도넛 차트 데이터
  const chartData = {
    labels: ['준수', '미준수'],
    datasets: [
      {
        data: [complianceData.compliant, complianceData.nonCompliant],
        backgroundColor: [theme.palette.success.main, theme.palette.error.main],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
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

  const totalItems = complianceData.compliant + complianceData.nonCompliant;
  const compliantPercentage = totalItems > 0 ? Math.round((complianceData.compliant / totalItems) * 100) : 0;
  const nonCompliantPercentage = totalItems > 0 ? Math.round((complianceData.nonCompliant / totalItems) * 100) : 0;

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
            ISMS 대시보드
          </Typography>
          <Typography variant="body1" color="text.secondary">
            정보보호 관리체계(ISMS) 인증 준비를 위한 주요 통제 항목 현황 및 준수 상태를 확인하세요.
          </Typography>
        </Box>
        
        <IsmsScanner onScanComplete={handleScanComplete} />
      </Box>

      {/* ISMS 준수 현황 카드 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
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
                  ISMS 준수 현황
                </Typography>
                <Button 
                  startIcon={<RefreshIcon />} 
                  size="small"
                  onClick={handleScanComplete}
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
                            color: compliantPercentage >= 81 
                              ? theme.palette.success.main 
                              : compliantPercentage >= 51 
                                ? theme.palette.warning.main 
                                : theme.palette.error.main,
                            textShadow: '0 0 10px rgba(255,255,255,0.8)'
                          }}
                        >
                          {compliantPercentage}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          준수율
                        </Typography>
                      </Box>
                      <Box sx={{ width: '80%', maxWidth: '220px' }}>
                        <Doughnut data={chartData} options={chartOptions} />
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
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{complianceData.compliant} 항목 ({compliantPercentage}%)</Typography>
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
                    
                    {/* 미준수 항목 */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>미준수</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{complianceData.nonCompliant} 항목 ({nonCompliantPercentage}%)</Typography>
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
        </Grid>

        {/* 전체 준수율 요약 카드 */}
        <Grid item xs={12} md={4}>
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
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                ISMS 통제 항목 준수율
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {ismsItems.map((item) => (
                  <Box key={item.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.id} {item.title}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.compliance}%</Typography>
                    </Box>
                    <Box sx={{ width: '100%', height: 6, bgcolor: alpha(theme.palette.grey[300], 0.3), borderRadius: 3 }}>
                      <Box 
                        sx={{ 
                          width: `${item.compliance}%`, 
                          height: '100%', 
                          bgcolor: item.compliance >= 81 
                            ? theme.palette.success.main 
                            : item.compliance >= 51 
                              ? theme.palette.warning.main 
                              : theme.palette.error.main, 
                          borderRadius: 3 
                        }} 
                      />
                    </Box>
                  </Box>
                ))}
                
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>전체 준수율</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>{overallCompliance}%</Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 8, bgcolor: alpha(theme.palette.primary.main, 0.2), borderRadius: 4 }}>
                    <Box 
                      sx={{ 
                        width: `${overallCompliance}%`, 
                        height: '100%', 
                        background: overallCompliance >= 81 
                          ? theme.palette.success.main 
                          : overallCompliance >= 51 
                            ? theme.palette.warning.main 
                            : theme.palette.error.main, 
                        borderRadius: 4 
                      }} 
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ISMS 통제항목 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/isms-controls')}
          sx={{ 
            px: 4,
            py: 1.5,
            background: 'linear-gradient(45deg, #0078d4 30%, #4aa3f3 90%)',
            boxShadow: '0 4px 12px rgba(0, 120, 212, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0, 120, 212, 0.4)',
            }
          }}
        >
          ISMS 통제항목 상세보기
        </Button>
      </Box>
    </Box>
  );
};

export default IsmsDashboard;
