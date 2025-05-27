import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  NetworkCheck as NetworkCheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import StatusSummary from '../components/StatusSummary';

const NetworkSecurity = () => {
  // 상태 요약을 위한 데이터
  const statusCategories = [
    { name: '보안 그룹', compliant: 1, total: 3 },
    { name: 'VPC 설정', compliant: 1, total: 2 },
    { name: '네트워크 ACL', compliant: 1, total: 2 },
    { name: '인터넷 게이트웨이', compliant: 2, total: 2 },
    { name: '라우팅 테이블', compliant: 3, total: 3 }
  ];
  // 샘플 데이터
  const securityGroups = [
    {
      id: 'sg-0123456789abcdef0',
      name: 'default',
      status: 'high',
      issues: ['0.0.0.0/0에서 SSH(22) 포트 접근 허용', '불필요한 포트 개방'],
      vpc: 'vpc-12345678'
    },
    {
      id: 'sg-0123456789abcdef1',
      name: 'web-server-sg',
      status: 'medium',
      issues: ['HTTP 포트(80)가 모든 IP에 개방됨'],
      vpc: 'vpc-12345678'
    },
    {
      id: 'sg-0123456789abcdef2',
      name: 'db-server-sg',
      status: 'ok',
      issues: [],
      vpc: 'vpc-87654321'
    }
  ];

  const vpcs = [
    {
      id: 'vpc-12345678',
      name: '프로덕션 VPC',
      status: 'medium',
      issues: ['서브넷 ACL 설정 미흡'],
      cidr: '10.0.0.0/16'
    },
    {
      id: 'vpc-87654321',
      name: '개발 VPC',
      status: 'ok',
      issues: [],
      cidr: '172.16.0.0/16'
    }
  ];

  const nacls = [
    {
      id: 'acl-0123456789abcdef0',
      name: '기본 NACL',
      status: 'medium',
      issues: ['모든 트래픽 허용 규칙 존재'],
      vpc: 'vpc-12345678'
    },
    {
      id: 'acl-0123456789abcdef1',
      name: '웹 서버 NACL',
      status: 'ok',
      issues: [],
      vpc: 'vpc-12345678'
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
        네트워크 보안
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        AWS 환경의 네트워크 보안 설정을 검토하고 ISMS 요구사항에 맞게 관리합니다.
      </Typography>
      
      {/* 상태 요약 카드 */}
      <StatusSummary categories={statusCategories} />

      <Grid container spacing={3}>
        {/* 보안 그룹 섹션 */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NetworkCheckIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">보안 그룹</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {securityGroups.map((sg) => (
              <Card key={sg.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {sg.name} ({sg.id})
                    </Typography>
                    {getStatusChip(sg.status)}
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    VPC: {sg.vpc}
                  </Typography>
                  {sg.issues.length > 0 && (
                    <List dense disablePadding>
                      {sg.issues.map((issue, index) => (
                        <ListItem key={index} disablePadding>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            {getStatusIcon(sg.status)}
                          </ListItemIcon>
                          <ListItemText primary={issue} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>

        {/* VPC 섹션 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NetworkCheckIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">VPC</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {vpcs.map((vpc) => (
              <Card key={vpc.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {vpc.name} ({vpc.id})
                    </Typography>
                    {getStatusChip(vpc.status)}
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    CIDR: {vpc.cidr}
                  </Typography>
                  {vpc.issues.length > 0 && (
                    <List dense disablePadding>
                      {vpc.issues.map((issue, index) => (
                        <ListItem key={index} disablePadding>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            {getStatusIcon(vpc.status)}
                          </ListItemIcon>
                          <ListItemText primary={issue} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>

        {/* NACL 섹션 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NetworkCheckIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">네트워크 ACL</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {nacls.map((nacl) => (
              <Card key={nacl.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {nacl.name} ({nacl.id})
                    </Typography>
                    {getStatusChip(nacl.status)}
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    VPC: {nacl.vpc}
                  </Typography>
                  {nacl.issues.length > 0 && (
                    <List dense disablePadding>
                      {nacl.issues.map((issue, index) => (
                        <ListItem key={index} disablePadding>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            {getStatusIcon(nacl.status)}
                          </ListItemIcon>
                          <ListItemText primary={issue} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NetworkSecurity;