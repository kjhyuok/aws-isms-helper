import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useIsms } from '../contexts/IsmsContext';
import { getMockScanResult } from '../services/ismsService';

const AccountManagement = () => {
  const { ismsData, loading, error } = useIsms();
  
  // 로딩 중이면 로딩 표시
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // 데이터가 없는 경우 모의 데이터 사용
  let authManagementData;
  let sectionSummary;
  let compliancePercentage;

  if (!ismsData || !ismsData.isms_mapping || !ismsData.isms_mapping['2.5']) {
    console.log('AccountManagement: 데이터 없음, 모의 데이터 사용');
    const mockData = getMockScanResult();
    authManagementData = mockData.isms_mapping['2.5'] || { items: [] };
    sectionSummary = mockData.compliance_summary?.section_summary?.['2.5'] || { total: 0, compliant: 0, percentage: 0 };
    compliancePercentage = Math.round(sectionSummary.percentage || 0);
  } else {
    // 2.5 인증 및 권한관리 데이터 추출
    authManagementData = ismsData.isms_mapping['2.5'] || { items: [] };
    sectionSummary = ismsData.compliance_summary?.section_summary?.['2.5'] || { total: 0, compliant: 0, percentage: 0 };
    compliancePercentage = Math.round(sectionSummary.percentage || 0);
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>계정 및 접근관리</Typography>
      
      {/* ISMS 준수 상태 요약 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">ISMS 준수 상태</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">준수율</Typography>
              <Typography variant="body2" fontWeight={600}>{compliancePercentage}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={compliancePercentage} 
              sx={{ height: 8, borderRadius: 4 }} 
            />
          </Box>
          <Chip 
            label={compliancePercentage >= 80 ? "양호" : "개선 필요"} 
            color={compliancePercentage >= 80 ? "success" : "warning"}
          />
        </Box>
      </Paper>
      
      {/* ISMS 항목 목록 */}
      <Grid container spacing={3}>
        {authManagementData.items.map((item) => (
          <Grid item xs={12} md={6} key={item.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Chip 
                    icon={item.compliant ? <CheckCircleIcon /> : <ErrorIcon />}
                    label={item.compliant ? "준수" : "미준수"} 
                    color={item.compliant ? "success" : "error"}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item.id} - {item.name} 관련 보안 설정 상태
                </Typography>
                  
                  {/* 항목별 세부 정보 */}
                  {item.id === '2.5.1' && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">MFA 활성화 현황: {Math.round(item.details?.mfa_percentage || 0)}%</Typography>
                      {item.details?.users_without_mfa?.length > 0 && (
                        <Typography variant="body2" color="error">
                          MFA 미적용 사용자: {item.details.users_without_mfa.join(', ')}
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  {item.id === '2.5.2' && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">
                        액세스 키 관리: {item.details?.old_access_keys?.length > 0 ? 
                          `${item.details.old_access_keys.length}개의 오래된 키 발견` : 
                          '모든 키가 적절히 관리됨'}
                      </Typography>
                    </Box>
                  )}
                  
                  {item.id === '2.5.3' && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">
                        비밀번호 정책: {item.details?.password_policy ? 
                          '설정됨' : 
                          '설정되지 않음'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      
      {/* 기존 계정 관리 컨텐츠 */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>계정 관리 도구</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">사용자 관리</Typography>
                <Typography variant="body2" color="text.secondary">
                  AWS IAM 사용자 및 그룹 관리, 권한 설정, MFA 활성화 등을 수행합니다.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">액세스 키 관리</Typography>
                <Typography variant="body2" color="text.secondary">
                  AWS 액세스 키 생성, 삭제, 교체 및 모니터링을 수행합니다.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AccountManagement;
