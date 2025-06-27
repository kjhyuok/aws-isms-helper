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
  Computer as ComputerIcon,
  Backup as BackupIcon,
  History as HistoryIcon,
  BugReport as BugReportIcon
} from '@mui/icons-material';
import { useIsms } from '../../contexts/IsmsContext';
import { getMockScanResult } from '../../services/ismsService';

const IsmsSystemOperation = () => {
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
  let operationData;
  let sectionSummary;
  let compliancePercentage;

  if (!ismsData || !ismsData.isms_mapping || !ismsData.isms_mapping['2.9']) {
    console.log('IsmsSystemOperation: 데이터 없음, 모의 데이터 사용');
    const mockData = getMockScanResult();
    operationData = mockData.isms_mapping['2.9'] || { items: [] };
    sectionSummary = mockData.compliance_summary?.section_summary?.['2.9'] || { total: 0, compliant: 0, percentage: 0 };
    compliancePercentage = Math.round(sectionSummary.percentage || 0);
  } else {
    // 2.9 시스템 및 서비스 운영관리 데이터 추출
    operationData = ismsData.isms_mapping['2.9'] || { items: [] };
    sectionSummary = ismsData.compliance_summary?.section_summary?.['2.9'] || { total: 0, compliant: 0, percentage: 0 };
    compliancePercentage = Math.round(sectionSummary.percentage || 0);
  }

  // 시스템 운영 관련 데이터 (API 데이터가 없는 경우 기본 데이터 사용)
  const operationItems = operationData.items?.length > 0 ? 
    operationData.items.map(item => ({
      id: item.id,
      title: item.name,
      status: item.compliant ? 'compliant' : 'non-compliant',
      description: item.details ? `${item.name} 관련 보안 설정 상태` : '데이터 없음',
      icon: getIconForId(item.id)
    })) : 
    [
      {
        id: '2.9.1',
        title: '변경관리',
        status: 'compliant',
        description: '시스템 및 서비스 변경에 대한 관리 절차가 적절히 구현되어 있음',
        icon: <ComputerIcon />
      },
      {
        id: '2.9.2',
        title: '백업관리',
        status: 'warning',
        description: '백업 정책은 수립되어 있으나, 일부 시스템에서 정기적인 복구 테스트가 미흡함',
        icon: <BackupIcon />
      },
      {
        id: '2.9.3',
        title: '로그관리',
        status: 'compliant',
        description: '시스템 및 서비스 로그가 적절히 수집, 보관, 검토되고 있음',
        icon: <HistoryIcon />
      },
      {
        id: '2.9.4',
        title: '취약점 관리',
        status: 'non-compliant',
        description: '일부 시스템에서 정기적인 취약점 점검 및 조치가 미흡함',
        icon: <BugReportIcon />
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
      case '2.9.1': return <ComputerIcon />;
      case '2.9.2': return <BackupIcon />;
      case '2.9.3': return <HistoryIcon />;
      case '2.9.4': return <BugReportIcon />;
      default: return <ComputerIcon />;
    }
  }

  return (
    <Box className="fade-in">
      {/* 헤더 섹션 */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          2.9 시스템 및 서비스 운영관리
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          시스템 및 서비스의 안정적 운영을 위한 변경관리, 백업관리, 로그관리, 취약점 관리 등에 관한 보안 요구사항
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
        {operationItems.map((item) => (
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

export default IsmsSystemOperation;
