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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
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
  Lock as LockIcon,
  Security as SecurityIcon,
  EnhancedEncryption as EnhancedEncryptionIcon,
  VpnKey as VpnKeyIcon
} from '@mui/icons-material';
import { useIsms } from '../../contexts/IsmsContext';
import { getMockScanResult } from '../../services/ismsService';

const IsmsEncryption = () => {
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
  let encryptionData;
  let sectionSummary;
  let compliancePercentage;

  if (!ismsData || !ismsData.isms_mapping || !ismsData.isms_mapping['2.7']) {
    console.log('IsmsEncryption: 데이터 없음, 모의 데이터 사용');
    const mockData = getMockScanResult();
    encryptionData = mockData.isms_mapping['2.7'] || { items: [] };
    sectionSummary = mockData.compliance_summary?.section_summary?.['2.7'] || { total: 0, compliant: 0, percentage: 0 };
    compliancePercentage = Math.round(sectionSummary.percentage || 0);
  } else {
    // 2.7 암호화 적용 데이터 추출
    encryptionData = ismsData.isms_mapping['2.7'] || { items: [] };
    sectionSummary = ismsData.compliance_summary?.section_summary?.['2.7'] || { total: 0, compliant: 0, percentage: 0 };
    compliancePercentage = Math.round(sectionSummary.percentage || 0);
  }

  // 암호화 관련 데이터 (API 데이터가 없는 경우 기본 데이터 사용)
  const encryptionItems = encryptionData.items?.length > 0 ? 
    encryptionData.items.map(item => ({
      id: item.id,
      title: item.name,
      status: item.compliant ? 'compliant' : 'non-compliant',
      description: item.details ? `${item.name} 관련 보안 설정 상태` : '데이터 없음',
      icon: getIconForId(item.id)
    })) : 
    [
      {
        id: '2.7.1',
        title: '저장 데이터 암호화',
        status: 'compliant',
        description: '개인정보 및 중요정보는 암호화하여 저장하고 있음',
        icon: <EnhancedEncryptionIcon />
      },
      {
        id: '2.7.2',
        title: '전송 데이터 암호화',
        status: 'compliant',
        description: '개인정보 및 중요정보는 암호화하여 전송하고 있음',
        icon: <LockIcon />
      },
      {
        id: '2.7.3',
        title: '암호키 관리',
        status: 'warning',
        description: '암호키 관리 정책은 수립되어 있으나, 일부 키 관리 절차가 미흡함',
        icon: <VpnKeyIcon />
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
      case '2.7.1': return <EnhancedEncryptionIcon />;
      case '2.7.2': return <LockIcon />;
      case '2.7.3': return <VpnKeyIcon />;
      default: return <EnhancedEncryptionIcon />;
    }
  }

  return (
    <Box className="fade-in">
      {/* 헤더 섹션 */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          2.7 암호화 적용
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          개인정보 및 중요정보 보호를 위한 암호화 적용 및 암호키 관리에 관한 보안 요구사항
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
        {encryptionItems.map((item) => (
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

export default IsmsEncryption;
