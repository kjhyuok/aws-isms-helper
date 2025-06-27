import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon,
  Shield as ShieldIcon,
  Security as SecurityIcon,
  Code as CodeIcon,
  BugReport as BugReportIcon
} from '@mui/icons-material';
import { useIsms } from '../../contexts/IsmsContext';
import { getMockScanResult } from '../../services/ismsService';

const IsmsSystemSecurity = () => {
  const { ismsData, loading: ismsLoading, error: ismsError } = useIsms();

  // 로딩 중이면 로딩 표시
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
  let securityData;
  let sectionSummary;
  let compliancePercentage;

  if (!ismsData || !ismsData.isms_mapping || !ismsData.isms_mapping['2.10']) {
    console.log('IsmsSystemSecurity: 데이터 없음, 모의 데이터 사용');
    const mockData = getMockScanResult();
    securityData = mockData.isms_mapping['2.10'] || { items: [] };
    sectionSummary = mockData.compliance_summary?.section_summary?.['2.10'] || { total: 0, compliant: 0, percentage: 0 };
    compliancePercentage = Math.round(sectionSummary.percentage || 0);
  } else {
    // 2.10 시스템 및 서비스 보안관리 데이터 추출
    securityData = ismsData.isms_mapping['2.10'] || { items: [] };
    sectionSummary = ismsData.compliance_summary?.section_summary?.['2.10'] || { total: 0, compliant: 0, percentage: 0 };
    compliancePercentage = Math.round(sectionSummary.percentage || 0);
  }

  // 시스템 보안 관련 데이터 (API 데이터가 없는 경우 기본 데이터 사용)
  const securityItems = securityData.items?.length > 0 ? 
    securityData.items.map(item => ({
      id: item.id,
      title: item.name,
      status: item.compliant ? 'compliant' : 'non-compliant',
      description: item.details ? `${item.name} 관련 보안 설정 상태` : '데이터 없음',
      icon: getIconForId(item.id)
    })) : 
    [
      {
        id: '2.10.1',
        title: '보안 시스템 운영',
        status: 'warning',
        description: '보안 시스템은 구축되어 있으나, 일부 영역에서 모니터링 및 대응 체계가 미흡함',
        icon: <ShieldIcon />
      },
      {
        id: '2.10.2',
        title: 'DDoS 대응',
        status: 'non-compliant',
        description: 'DDoS 공격에 대한 대응 체계가 미흡함',
        icon: <SecurityIcon />
      },
      {
        id: '2.10.3',
        title: '취약점 관리',
        status: 'non-compliant',
        description: '시스템 및 서비스의 취약점 점검 및 조치가 미흡함',
        icon: <BugReportIcon />
      },
      {
        id: '2.10.4',
        title: '안전한 개발환경',
        status: 'warning',
        description: '개발 보안 정책은 수립되어 있으나, 일부 영역에서 구현이 미흡함',
        icon: <CodeIcon />
      }
    ];

  // 상태에 따른 색상 및 아이콘 매핑
  const statusConfig = {
    compliant: { color: 'success', icon: <CheckCircleIcon color="success" />, text: '준수' },
    warning: { color: 'warning', icon: <InfoIcon color="warning" />, text: '부분 준수' },
    'non-compliant': { color: 'error', icon: <ErrorIcon color="error" />, text: '미준수' }
  };

  // ID에 따른 아이콘 반환
  function getIconForId(id) {
    switch(id) {
      case '2.10.1': return <ShieldIcon />;
      case '2.10.2': return <SecurityIcon />;
      case '2.10.3': return <BugReportIcon />;
      case '2.10.4': return <CodeIcon />;
      default: return <ShieldIcon />;
    }
  }

  return (
    <Box className="fade-in">
      {/* 헤더 섹션 */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          2.10 시스템 및 서비스 보안관리
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          시스템 및 서비스의 보안을 위한 보안 요구사항 정의, 시스템 보안 구현, 안전한 개발환경 구축 등에 관한 보안 요구사항
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">준수율</Typography>
              <Typography variant="body2" fontWeight={600}>{compliancePercentage}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={compliancePercentage} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                bgcolor: 'rgba(0,0,0,0.05)'
              }} 
            />
          </Box>
          <Chip 
            label={compliancePercentage >= 80 ? "양호" : "개선 필요"} 
            color={compliancePercentage >= 80 ? "success" : "warning"}
            size="small"
          />
        </Box>
      </Paper>

      {/* 세부 항목 카드 */}
      <Grid container spacing={3}>
        {securityItems.map((item) => (
          <Grid item xs={12} md={6} key={item.id}>
            <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
              <CardHeader
                avatar={item.icon}
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {item.id} {item.title}
                    </Typography>
                    <Chip 
                      label={statusConfig[item.status].text} 
                      color={statusConfig[item.status].color}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
                action={
                  <Tooltip title="더 보기">
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                }
              />
              <Divider />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default IsmsSystemSecurity;
