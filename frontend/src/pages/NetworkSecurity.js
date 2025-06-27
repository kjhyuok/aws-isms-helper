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
  CircularProgress,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useIsms } from '../contexts/IsmsContext';
import { getMockScanResult } from '../services/ismsService';

const NetworkSecurity = () => {
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
  let accessControlData;
  let sectionSummary;
  let compliancePercentage;

  if (!ismsData || !ismsData.isms_mapping || !ismsData.isms_mapping['2.6']) {
    console.log('NetworkSecurity: 데이터 없음, 모의 데이터 사용');
    const mockData = getMockScanResult();
    accessControlData = mockData.isms_mapping['2.6'] || { items: [] };
    sectionSummary = mockData.compliance_summary?.section_summary?.['2.6'] || { total: 0, compliant: 0, percentage: 0 };
    compliancePercentage = Math.round(sectionSummary.percentage || 0);
  } else {
    // 2.6 접근통제 데이터 추출
    accessControlData = ismsData.isms_mapping['2.6'] || { items: [] };
    sectionSummary = ismsData.compliance_summary?.section_summary?.['2.6'] || { total: 0, compliant: 0, percentage: 0 };
    compliancePercentage = Math.round(sectionSummary.percentage || 0);
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>네트워크 보안</Typography>
      
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
        {accessControlData.items.map((item) => (
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
                  {item.id === '2.6.1' && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">보안 그룹 상태</Typography>
                      {item.details?.risky_security_groups?.length > 0 ? (
                        <>
                          <Typography variant="body2" color="error">
                            위험한 보안 그룹 규칙이 {item.details.risky_security_groups.length}개 발견되었습니다.
                          </Typography>
                          <List dense>
                            {item.details.risky_security_groups.map((sg, index) => (
                              <ListItem key={index}>
                                <ListItemText 
                                  primary={`${sg.group_name} (${sg.group_id})`}
                                  secondary={`포트: ${sg.port}, CIDR: ${sg.cidr}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </>
                      ) : (
                        <Typography variant="body2" color="success.main">
                          모든 보안 그룹이 안전하게 구성되어 있습니다.
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      
      {/* 기존 네트워크 보안 컨텐츠 */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>네트워크 보안 도구</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">VPC 보안</Typography>
                <Typography variant="body2" color="text.secondary">
                  VPC, 서브넷, 라우팅 테이블, 네트워크 ACL 등의 보안 설정을 관리합니다.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">보안 그룹 관리</Typography>
                <Typography variant="body2" color="text.secondary">
                  EC2, RDS, Lambda 등의 리소스에 대한 보안 그룹 규칙을 관리합니다.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default NetworkSecurity;
