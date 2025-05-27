import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import StatusSummary from '../components/StatusSummary';

const Logging = () => {
  // 상태 요약을 위한 데이터
  const statusCategories = [
    { name: 'CloudTrail', compliant: 2, total: 3 },
    { name: 'CloudWatch 알람', compliant: 10, total: 12 },
    { name: 'AWS Config', compliant: 11, total: 15 },
    { name: '로그 보존', compliant: 3, total: 4 },
    { name: '이벤트 모니터링', compliant: 4, total: 5 }
  ];
  // 샘플 데이터
  const cloudTrailStatus = {
    enabled: true,
    multiRegion: false,
    logFileValidation: true,
    s3BucketName: 'isms-cloudtrail-logs',
    issues: ['일부 리전에서 CloudTrail이 활성화되지 않음']
  };

  const cloudWatchStatus = {
    alarms: 12,
    activeAlarms: 2,
    dashboards: 5,
    issues: []
  };

  const configStatus = {
    enabled: true,
    recorders: 3,
    rules: 15,
    nonCompliantRules: 4,
    issues: ['일부 리소스 유형이 기록되지 않음']
  };

  const recentEvents = [
    {
      eventName: 'ConsoleLogin',
      eventTime: '2023-06-15T14:30:45Z',
      sourceIPAddress: '192.168.1.1',
      userIdentity: 'admin',
      status: 'ok'
    },
    {
      eventName: 'CreateSecurityGroup',
      eventTime: '2023-06-15T13:22:10Z',
      sourceIPAddress: '192.168.1.1',
      userIdentity: 'admin',
      status: 'ok'
    },
    {
      eventName: 'AuthorizeSecurityGroupIngress',
      eventTime: '2023-06-15T13:25:30Z',
      sourceIPAddress: '192.168.1.1',
      userIdentity: 'admin',
      status: 'medium'
    },
    {
      eventName: 'DeleteRolePolicy',
      eventTime: '2023-06-14T09:12:05Z',
      sourceIPAddress: '192.168.1.100',
      userIdentity: 'developer',
      status: 'high'
    },
    {
      eventName: 'StopInstances',
      eventTime: '2023-06-14T08:45:22Z',
      sourceIPAddress: '192.168.1.100',
      userIdentity: 'developer',
      status: 'ok'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'high':
        return <ErrorIcon color="error" />;
      case 'medium':
        return <WarningIcon color="warning" />;
      case 'ok':
        return <CheckCircleIcon color="success" />;
      default:
        return <CheckCircleIcon color="success" />;
    }
  };

  const getStatusChip = (status) => {
    let color = 'success';
    let label = '양호';

    switch (status) {
      case 'high':
        color = 'error';
        label = '심각';
        break;
      case 'medium':
        color = 'warning';
        label = '주의';
        break;
      default:
        color = 'success';
        label = '양호';
    }

    return <Chip size="small" color={color} label={label} />;
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        로깅 및 모니터링
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        AWS 환경의 로깅 및 모니터링 설정을 검토하고 ISMS 요구사항에 맞게 관리합니다.
      </Typography>
      
      {/* 상태 요약 카드 */}
      <StatusSummary categories={statusCategories} />

      <Grid container spacing={3}>
        {/* CloudTrail 상태 */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssessmentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">CloudTrail</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1">상태</Typography>
              {cloudTrailStatus.enabled ? 
                <Chip size="small" color="success" label="활성화됨" /> : 
                <Chip size="small" color="error" label="비활성화됨" />
              }
            </Box>
            
            <List dense>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  {cloudTrailStatus.multiRegion ? 
                    <CheckCircleIcon color="success" /> : 
                    <WarningIcon color="warning" />
                  }
                </ListItemIcon>
                <ListItemText 
                  primary="다중 리전 추적" 
                  secondary={cloudTrailStatus.multiRegion ? "활성화됨" : "비활성화됨"} 
                />
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  {cloudTrailStatus.logFileValidation ? 
                    <CheckCircleIcon color="success" /> : 
                    <WarningIcon color="warning" />
                  }
                </ListItemIcon>
                <ListItemText 
                  primary="로그 파일 검증" 
                  secondary={cloudTrailStatus.logFileValidation ? "활성화됨" : "비활성화됨"} 
                />
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="S3 버킷" 
                  secondary={cloudTrailStatus.s3BucketName} 
                />
              </ListItem>
            </List>
            
            {cloudTrailStatus.issues.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="error.main">
                  발견된 문제:
                </Typography>
                <List dense disablePadding>
                  {cloudTrailStatus.issues.map((issue, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <WarningIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText primary={issue} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* CloudWatch 상태 */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssessmentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">CloudWatch</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <List dense>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="알람" 
                  secondary={`총 ${cloudWatchStatus.alarms}개 (활성 ${cloudWatchStatus.activeAlarms}개)`} 
                />
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="대시보드" 
                  secondary={`${cloudWatchStatus.dashboards}개`} 
                />
              </ListItem>
            </List>
            
            {cloudWatchStatus.issues.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="error.main">
                  발견된 문제:
                </Typography>
                <List dense disablePadding>
                  {cloudWatchStatus.issues.map((issue, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <WarningIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText primary={issue} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            
            <Button 
              variant="outlined" 
              size="small" 
              sx={{ mt: 2 }}
              startIcon={<VisibilityIcon />}
            >
              대시보드 보기
            </Button>
          </Paper>
        </Grid>
        
        {/* Config 상태 */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssessmentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">AWS Config</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1">상태</Typography>
              {configStatus.enabled ? 
                <Chip size="small" color="success" label="활성화됨" /> : 
                <Chip size="small" color="error" label="비활성화됨" />
              }
            </Box>
            
            <List dense>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="설정 레코더" 
                  secondary={`${configStatus.recorders}개`} 
                />
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  {configStatus.nonCompliantRules > 0 ? 
                    <WarningIcon color="warning" /> : 
                    <CheckCircleIcon color="success" />
                  }
                </ListItemIcon>
                <ListItemText 
                  primary="규칙" 
                  secondary={`총 ${configStatus.rules}개 (미준수 ${configStatus.nonCompliantRules}개)`} 
                />
              </ListItem>
            </List>
            
            {configStatus.issues.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="error.main">
                  발견된 문제:
                </Typography>
                <List dense disablePadding>
                  {configStatus.issues.map((issue, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <WarningIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText primary={issue} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            
            <Button 
              variant="outlined" 
              size="small" 
              sx={{ mt: 2 }}
              startIcon={<VisibilityIcon />}
            >
              규칙 보기
            </Button>
          </Paper>
        </Grid>
        
        {/* 최근 이벤트 */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssessmentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">최근 이벤트</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {recentEvents.map((event, index) => (
                <Grid item xs={12} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {event.eventName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(event.eventTime).toLocaleString()} | {event.userIdentity} | {event.sourceIPAddress}
                          </Typography>
                        </Box>
                        {getStatusChip(event.status)}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<VisibilityIcon />}
              >
                모든 이벤트 보기
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Logging;