import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Button,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  VerifiedUser as VerifiedUserIcon,
  Lock as LockIcon,
  EnhancedEncryption as EnhancedEncryptionIcon,
  Computer as ComputerIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { getMockScanResult } from '../services/ismsService';
import IsmsScanner from '../components/IsmsScanner';
import { useIsms } from '../contexts/IsmsContext';

const IsmsControls = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { ismsData, loading: ismsLoading, error: ismsError, fetchIsmsData } = useIsms();

  // 스캔 완료 후 데이터 새로고침
  const handleScanComplete = async () => {
    console.log('IsmsControls: 스캔 완료 후 데이터 새로고침');
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

  // 데이터가 없는 경우 모의 데이터 사용
  let complianceSummary;
  let sectionSummary;
  let ismsMapping;

  if (!ismsData || !ismsData.isms_mapping) {
    console.log('IsmsControls: 데이터 없음, 모의 데이터 사용');
    const mockData = getMockScanResult();
    complianceSummary = mockData.compliance_summary || {};
    sectionSummary = mockData.compliance_summary.section_summary || {};
    ismsMapping = mockData.isms_mapping || {};
  } else {
    // 스캔 데이터에서 필요한 정보 추출
    complianceSummary = ismsData.compliance_summary || {};
    sectionSummary = complianceSummary.section_summary || {};
    ismsMapping = ismsData.isms_mapping || {};
  }

  // ISMS 통제 항목 정의
  const controlSections = [
    {
      id: '2.5',
      title: '인증 및 권한관리',
      description: '사용자 인증, 접근권한 관리, 특수 권한 관리, 사용자 인증 정보 관리에 대한 보안 요구사항',
      icon: <VerifiedUserIcon fontSize="large" />,
      path: '/isms-auth-management',
      color: '#4caf50',
      items: ismsMapping['2.5']?.items || []
    },
    {
      id: '2.6',
      title: '접근통제',
      description: '네트워크, 시스템, 응용프로그램, 데이터베이스 등의 접근통제에 관한 보안 요구사항',
      icon: <LockIcon fontSize="large" />,
      path: '/isms-access-control',
      color: '#ff9800',
      items: ismsMapping['2.6']?.items || []
    },
    {
      id: '2.7',
      title: '암호화 적용',
      description: '개인정보 및 중요정보 보호를 위한 암호화 적용 및 암호키 관리에 관한 보안 요구사항',
      icon: <EnhancedEncryptionIcon fontSize="large" />,
      path: '/isms-encryption',
      color: '#2196f3',
      items: ismsMapping['2.7']?.items || []
    },
    {
      id: '2.9',
      title: '시스템 및 서비스 운영관리',
      description: '시스템 및 서비스의 안정적 운영을 위한 변경관리, 백업관리, 로그관리, 취약점 관리 등에 관한 보안 요구사항',
      icon: <ComputerIcon fontSize="large" />,
      path: '/isms-system-operation',
      color: '#9c27b0',
      items: ismsMapping['2.9']?.items || []
    },
    {
      id: '2.10',
      title: '시스템 및 서비스 보안관리',
      description: '시스템 및 서비스의 보안을 위한 보안 요구사항 정의, 시스템 보안 구현, 안전한 개발환경 구축 등에 관한 보안 요구사항',
      icon: <ShieldIcon fontSize="large" />,
      path: '/isms-system-security',
      color: '#f44336',
      items: ismsMapping['2.10']?.items || []
    }
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
            ISMS 통제항목
          </Typography>
          <Typography variant="body1" color="text.secondary">
            정보보호 관리체계(ISMS) 인증을 위한 주요 통제 항목 및 세부 요구사항을 확인하세요.
          </Typography>
        </Box>
        
        <IsmsScanner onScanComplete={handleScanComplete} />
      </Box>

      {/* 전체 준수 현황 요약 */}
      <Card sx={{ 
        mb: 4,
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ 
                  fontWeight: 700,
                  color: complianceSummary.overall_percentage >= 80 
                    ? theme.palette.success.main 
                    : complianceSummary.overall_percentage >= 50 
                      ? theme.palette.warning.main 
                      : theme.palette.error.main
                }}>
                  {Math.round(complianceSummary.overall_percentage || 0)}%
                </Typography>
                <Typography variant="h6" color="text.secondary">전체 준수율</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  총 {complianceSummary.total_items || 0}개 항목 중 {complianceSummary.compliant_items || 0}개 준수
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                {controlSections.map((section) => {
                  const sectionData = sectionSummary[section.id] || {};
                  const percentage = Math.round(sectionData.percentage || 0);
                  
                  return (
                    <Grid item xs={12} key={section.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ minWidth: 120 }}>
                          {section.id} {section.title}
                        </Typography>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={percentage} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 4,
                              backgroundColor: alpha(theme.palette.grey[300], 0.3),
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: percentage >= 80 
                                  ? theme.palette.success.main 
                                  : percentage >= 50 
                                    ? theme.palette.warning.main 
                                    : theme.palette.error.main
                              }
                            }} 
                          />
                        </Box>
                        <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
                          {percentage}%
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 통제 항목별 카드 */}
      <Grid container spacing={3}>
        {controlSections.map((section) => {
          const sectionData = sectionSummary[section.id] || {};
          const percentage = Math.round(sectionData.percentage || 0);
          const compliantItems = section.items.filter(item => item.compliant).length;
          const totalItems = section.items.length;
          
          return (
            <Grid item xs={12} md={6} key={section.id}>
              <Card sx={{ 
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Box sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: 2, 
                      bgcolor: alpha(section.color, 0.1), 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      {React.cloneElement(section.icon, { style: { color: section.color } })}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {section.id} {section.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Chip 
                          size="small" 
                          label={`${percentage}% 준수`} 
                          sx={{ 
                            bgcolor: percentage >= 80 
                              ? theme.palette.success.main 
                              : percentage >= 50 
                                ? theme.palette.warning.main 
                                : theme.palette.error.main,
                            color: 'white',
                            fontWeight: 600,
                            mr: 1
                          }} 
                        />
                        <Typography variant="body2" color="text.secondary">
                          {compliantItems}/{totalItems} 항목 준수
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {section.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <List dense disablePadding>
                    {section.items.map((item, index) => (
                      <React.Fragment key={item.id}>
                        {index > 0 && <Divider component="li" />}
                        <ListItem disablePadding sx={{ py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {item.compliant 
                              ? <CheckCircleIcon color="success" fontSize="small" /> 
                              : <ErrorIcon color="error" fontSize="small" />}
                          </ListItemIcon>
                          <ListItemText 
                            primary={`${item.id} ${item.name}`} 
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(section.path)}
                    >
                      상세보기
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default IsmsControls;
