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

const Logging = () => {
  const { ismsData, loading, error } = useIsms();
  
  // 로딩 중이면 로딩 표시
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // ISMS 2.9 시스템 및 서비스 운영관리 데이터 추출
  const operationData = ismsData?.isms_mapping?.['2.9'] || { items: [] };
  const sectionSummary = ismsData?.compliance_summary?.section_summary?.['2.9'] || { total: 0, compliant: 0, percentage: 0 };
  const compliancePercentage = Math.round(sectionSummary.percentage || 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>로깅 및 모니터링</Typography>
      
      {/* ISMS 준수 상태 요약 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">ISMS 준수 상태</Typography>
        
        {!ismsData ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            ISMS 데이터가 없습니다. ISMS 대시보드에서 AWS 계정 스캔을 실행해주세요.
          </Alert>
        ) : (
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
        )}
      </Paper>
      
      {/* ISMS 항목 목록 */}
      {ismsData && (
        <Grid container spacing={3}>
          {operationData.items.map((item) => (
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
                  {item.id === '2.9.1' && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">로그 관리 상태</Typography>
                      
                      {/* CloudTrail 설정 */}
                      {item.details?.cloudtrail?.length > 0 ? (
                        <List dense>
                          {item.details.cloudtrail.map((trail, index) => (
                            <ListItem key={index}>
                              <ListItemText 
                                primary={trail.trail_name}
                                secondary={
                                  <>
                                    다중 리전: {trail.is_multi_region ? '예' : '아니오'}, 
                                    로깅 활성화: {trail.is_logging ? '예' : '아니오'}, 
                                    로그 파일 검증: {trail.log_file_validation_enabled ? '활성화' : '비활성화'}
                                  </>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" color="error.main">
                          CloudTrail이 구성되지 않았습니다.
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  {item.id === '2.9.2' && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">보안 모니터링 상태</Typography>
                      
                      {/* 보안 경보 */}
                      {item.details?.security_alarms?.length > 0 ? (
                        <List dense>
                          {item.details.security_alarms.map((alarm, index) => (
                            <ListItem key={index}>
                              <ListItemText 
                                primary={alarm.alarm_name}
                                secondary={`지표: ${alarm.metric_name}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" color="error.main">
                          보안 관련 CloudWatch 경보가 구성되지 않았습니다.
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* 기존 로깅 및 모니터링 컨텐츠 */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>로깅 및 모니터링 도구</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">CloudTrail 관리</Typography>
                <Typography variant="body2" color="text.secondary">
                  AWS API 호출 로그 수집, 저장 및 분석을 관리합니다.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">CloudWatch 경보</Typography>
                <Typography variant="body2" color="text.secondary">
                  보안 관련 지표 모니터링 및 경보 설정을 관리합니다.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Logging;
