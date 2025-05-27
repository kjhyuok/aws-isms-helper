import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Button,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

function Checklist() {
  // 임시 데이터
  const checklistItems = [
    {
      id: 1,
      title: '루트 계정 MFA 설정',
      description: '루트 계정에 MFA를 활성화하여 보안을 강화합니다.',
      status: 'completed', // completed, warning, error, info (pending)
      type: 'auto',
    },
    {
      id: 2,
      title: 'IAM 사용자 MFA 설정',
      description: '모든 IAM 사용자에 대해 MFA를 활성화합니다.',
      status: 'warning',
      type: 'auto',
    },
    {
      id: 3,
      title: '보안 그룹 검토',
      description: '보안 그룹 규칙을 검토하고 필요한 경우 수정합니다.',
      status: 'error',
      type: 'manual',
    },
    {
      id: 4,
      title: 'S3 버킷 공개 액세스 차단',
      description: '모든 S3 버킷에 대해 공개 액세스를 차단합니다.',
      status: 'completed',
      type: 'auto',
    },
     {
      id: 5,
      title: 'CloudTrail 활성화 및 로깅 설정',
      description: '모든 리전에서 CloudTrail을 활성화하고 로깅을 설정합니다.',
      status: 'info',
      type: 'auto',
    },
  ];

  const totalItems = checklistItems.length;
  const completedItems = checklistItems.filter(item => item.status === 'completed').length;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'info': // pending or needs review
        return <InfoIcon color="info" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h4">체크리스트</Typography>
        <Button variant="contained" color="primary">
          새로고침
        </Button>
      </Box>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
         ISMS 인증을 위한 AWS 보안 요구사항 체크리스트입니다.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          전체 진행률
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{ height: 10, borderRadius: 5 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {completedItems} / {totalItems} 항목 ({progressPercentage}% 완료)
        </Typography>
      </Box>

      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          체크 항목
      </Typography>

      {checklistItems.map((item) => (
        <Accordion key={item.id} elevation={1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {getStatusIcon(item.status)}
              <Typography sx={{ ml: 1, flexGrow: 1, fontWeight: 'medium' }}>{item.title}</Typography>
              <Chip
                label={item.type === 'auto' ? '자동 검사' : '수동 검사'}
                size="small"
                color={item.type === 'auto' ? 'primary' : 'secondary'}
                sx={{ mr: 1 }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary" paragraph>
              {item.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color={getStatusColor(item.status)}
                size="small"
              >
                {item.status === 'completed' ? '완료됨' : '미완료'}
              </Button>
               <Button variant="outlined" size="small">
                상세 보기
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default Checklist; 