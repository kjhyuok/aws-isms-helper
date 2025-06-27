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
  Code as CodeIcon,
  Security as SecurityIcon,
  BugReport as BugReportIcon,
  VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';
import { getMockScanResult, getLatestScanResult } from '../../services/ismsService';

const IsmsSecureDevelopment = () => {
  const [scanData, setScanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 실제 API 호출
        try {
          console.log('API 호출: 결과 조회 시작');
          const data = await getLatestScanResult();
          console.log('API 응답: 결과 데이터', data);
          setScanData(data);
        } catch (apiError) {
          console.error('API 호출 실패, 모의 데이터 사용:', apiError);
          // API 호출 실패 시 모의 데이터 사용
          const mockData = getMockScanResult();
          setScanData(mockData);
        }
        setLoading(false);
      } catch (error) {
        console.error('데이터 로딩 중 오류 발생:', error);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 로딩 중이면 로딩 표시
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 오류 발생 시 오류 메시지 표시
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // 데이터가 없는 경우 처리
  if (!scanData || !scanData.isms_mapping) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        ISMS 데이터를 찾을 수 없습니다. 스캔을 다시 실행해주세요.
      </Alert>
    );
  }

  // 안전한 개발 관련 데이터 (API에서 직접 가져오는 데이터가 없으므로 정적 데이터 사용)
  const secureDevelopmentData = {
    title: '안전한 개발환경 구축',
    description: '시스템 및 서비스의 안전한 개발을 위한 보안 요구사항 정의, 시큐어 코딩, 취약점 점검 등에 관한 보안 요구사항',
    compliance: 65,
    items: [
      {
        id: '1',
        title: '보안 요구사항 정의',
        status: 'compliant',
        description: '시스템 및 서비스 개발 시 보안 요구사항이 적절히 정의되어 있음',
        icon: <SecurityIcon />
      },
      {
        id: '2',
        title: '시큐어 코딩',
        status: 'warning',
        description: '시큐어 코딩 가이드는 수립되어 있으나, 일부 영역에서 적용이 미흡함',
        icon: <CodeIcon />
      },
      {
        id: '3',
        title: '취약점 점검',
        status: 'non-compliant',
        description: '개발 단계에서의 취약점 점검 및 조치가 미흡함',
        icon: <BugReportIcon />
      },
      {
        id: '4',
        title: '안전한 배포',
        status: 'warning',
        description: '배포 전 보안 검증 절차는 수립되어 있으나, 일부 영역에서 적용이 미흡함',
        icon: <VerifiedUserIcon />
      }
    ]
  };

  // 상태에 따른 색상 및 아이콘 매핑
  const statusConfig = {
    compliant: { color: 'success', icon: <CheckCircleIcon color="success" />, text: '준수' },
    warning: { color: 'warning', icon: <InfoIcon color="warning" />, text: '부분 준수' },
    'non-compliant': { color: 'error', icon: <ErrorIcon color="error" />, text: '미준수' }
  };

  return (
    <Box className="fade-in">
      {/* 헤더 섹션 */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          {secureDevelopmentData.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {secureDevelopmentData.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">준수율</Typography>
              <Typography variant="body2" fontWeight={600}>{secureDevelopmentData.compliance}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={secureDevelopmentData.compliance} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                bgcolor: 'rgba(0,0,0,0.05)'
              }} 
            />
          </Box>
          <Chip 
            label={secureDevelopmentData.compliance >= 80 ? "양호" : "개선 필요"} 
            color={secureDevelopmentData.compliance >= 80 ? "success" : "warning"}
            size="small"
          />
        </Box>
      </Paper>

      {/* 세부 항목 카드 */}
      <Grid container spacing={3}>
        {secureDevelopmentData.items.map((item) => (
          <Grid item xs={12} md={6} key={item.id}>
            <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
              <CardHeader
                avatar={item.icon}
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {item.title}
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

      <Box sx={{ mt: 4 }}>
        <Alert severity="info">
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>참고 사항</Typography>
          <Typography variant="body2">
            안전한 개발환경 구축은 AWS 계정 스캔만으로는 완전히 평가할 수 없습니다. 개발 프로세스, 코드 품질, 보안 테스트 등에 대한 추가적인 평가가 필요합니다.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default IsmsSecureDevelopment;
