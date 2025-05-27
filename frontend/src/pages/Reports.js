import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
{/* StatusSummary 임포트 제거 */}

const Reports = () => {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  
  // 상태 요약 데이터 제거

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 샘플 데이터
  const complianceReports = [
    {
      id: 'isms-compliance-2023-q2',
      title: 'ISMS 준수 보고서 (2023 Q2)',
      date: '2023-06-01',
      status: 'ok',
      compliance: 92,
      findings: 5
    },
    {
      id: 'isms-compliance-2023-q1',
      title: 'ISMS 준수 보고서 (2023 Q1)',
      date: '2023-03-01',
      status: 'medium',
      compliance: 85,
      findings: 12
    },
    {
      id: 'isms-compliance-2022-q4',
      title: 'ISMS 준수 보고서 (2022 Q4)',
      date: '2022-12-01',
      status: 'high',
      compliance: 78,
      findings: 18
    }
  ];

  const securityReports = [
    {
      id: 'security-assessment-2023-06',
      title: '보안 평가 보고서 (2023년 6월)',
      date: '2023-06-15',
      status: 'medium',
      findings: 8
    },
    {
      id: 'security-assessment-2023-05',
      title: '보안 평가 보고서 (2023년 5월)',
      date: '2023-05-15',
      status: 'medium',
      findings: 10
    },
    {
      id: 'security-assessment-2023-04',
      title: '보안 평가 보고서 (2023년 4월)',
      date: '2023-04-15',
      status: 'high',
      findings: 15
    }
  ];

  const auditReports = [
    {
      id: 'audit-report-2023-q2',
      title: '내부 감사 보고서 (2023 Q2)',
      date: '2023-06-30',
      status: 'ok',
      findings: 3
    },
    {
      id: 'audit-report-2023-q1',
      title: '내부 감사 보고서 (2023 Q1)',
      date: '2023-03-31',
      status: 'medium',
      findings: 7
    }
  ];

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

  const renderReportCard = (report) => (
    <Grid item xs={12} md={6} key={report.id}>
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="div">
              {report.title}
            </Typography>
            {getStatusChip(report.status)}
          </Box>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            생성일: {report.date}
          </Typography>
          
          {report.compliance !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                준수율:
              </Typography>
              <Typography 
                variant="body1" 
                fontWeight="bold"
                color={
                  report.compliance >= 90 ? 'success.main' : 
                  report.compliance >= 80 ? 'warning.main' : 
                  'error.main'
                }
              >
                {report.compliance}%
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              발견사항:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {report.findings}개
            </Typography>
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          <Button 
            size="small" 
            startIcon={<AssessmentIcon />}
            onClick={() => navigate(`/reports/${report.id}/summary`)}
          >
            상세 보기
          </Button>
          <Button size="small" startIcon={<DownloadIcon />}>
            다운로드
          </Button>
          <Button size="small" startIcon={<ShareIcon />}>
            공유
          </Button>
          <Button size="small" startIcon={<PrintIcon />}>
            인쇄
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        보고서
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        ISMS 인증 준비를 위한 다양한 보고서를 생성하고 관리합니다.
      </Typography>
      
      {/* 상태 요약 카드 제거 */}

      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="준수 보고서" />
          <Tab label="보안 평가" />
          <Tab label="감사 보고서" />
        </Tabs>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={3}>
          {tabValue === 0 && complianceReports.map(report => renderReportCard(report))}
          {tabValue === 1 && securityReports.map(report => renderReportCard(report))}
          {tabValue === 2 && auditReports.map(report => renderReportCard(report))}
        </Grid>
      </Box>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AssessmentIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">보고서 생성</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <Typography variant="body1" paragraph>
          새로운 보고서를 생성하려면 아래 옵션 중 하나를 선택하세요.
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              startIcon={<AssessmentIcon />}
            >
              ISMS 준수 보고서 생성
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              startIcon={<AssessmentIcon />}
            >
              보안 평가 보고서 생성
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              startIcon={<AssessmentIcon />}
            >
              감사 보고서 생성
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Reports;