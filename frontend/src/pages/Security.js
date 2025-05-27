import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SeverityCard = ({ title, count, color, icon }) => (
  <Card>
    <CardContent>
       <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {React.cloneElement(icon, { color: color })}
        <Typography variant="h6" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ color: `${color}.main` }}>{count}</Typography>
    </CardContent>
  </Card>
);

function Security() {
  const navigate = useNavigate();

  // 임시 데이터
  const securityFindings = [
    {
      id: 1,
      service: 'IAM',
      severity: 'high',
      title: '활성화된 루트 계정 액세스 키',
      description: '루트 계정의 액세스 키가 활성화되어 있습니다.',
      recommendation: '루트 계정의 액세스 키를 비활성화하고 IAM 사용자를 생성하세요.',
      status: 'open',
      lastUpdated: '2024-03-21',
    },
    {
      id: 2,
      service: 'S3',
      severity: 'medium',
      title: '공개 액세스 가능한 버킷',
      description: '일부 S3 버킷이 공개 액세스 가능한 상태입니다.',
      recommendation: '버킷의 공개 액세스 설정을 검토하고 필요한 경우 제한하세요.',
      status: 'open',
      lastUpdated: '2024-03-20',
    },
    {
      id: 3,
      service: 'EC2',
      severity: 'low',
      title: '기본 보안 그룹 사용',
      description: '기본 보안 그룹을 사용하는 인스턴스가 있습니다.',
      recommendation: '커스텀 보안 그룹을 생성하고 필요한 규칙만 허용하세요.',
      status: 'resolved',
      lastUpdated: '2024-03-19',
    },
     {
      id: 4,
      service: 'IAM',
      severity: 'medium',
      title: 'IAM 사용자 비밀번호 정책 미흡',
      description: '사용자 비밀번호 정책이 보안 요구사항을 충족하지 못합니다.',
      recommendation: 'IAM 사용자 비밀번호 정책을 강화하세요.',
      status: 'open',
      lastUpdated: '2024-03-22',
    },
  ];

  const highSeverityCount = securityFindings.filter(f => f.severity === 'high' && f.status === 'open').length;
  const mediumSeverityCount = securityFindings.filter(f => f.severity === 'medium' && f.status === 'open').length;
  const lowSeverityCount = securityFindings.filter(f => f.severity === 'low' && f.status === 'open').length;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

   const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'error';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h4">보안</Typography>
        <Button variant="contained" color="primary">
          새로고침
        </Button>
      </Box>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
         AWS 보안 설정 분석 결과 및 권장 조치 사항입니다.
      </Typography>

      {/* 보안 요약 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <SeverityCard
            title="높음"
            count={highSeverityCount}
            color="error"
            icon={<ErrorIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SeverityCard
            title="중간"
            count={mediumSeverityCount}
            color="warning"
            icon={<WarningIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SeverityCard
            title="낮음"
            count={lowSeverityCount}
            color="info"
            icon={<InfoIcon />}
          />
        </Grid>
      </Grid>

       <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          보안 발견 사항
       </Typography>

      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>서비스</TableCell>
              <TableCell>심각도</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>마지막 업데이트</TableCell>
              <TableCell>작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {securityFindings.map((finding) => (
              <TableRow key={finding.id}>
                <TableCell>{finding.service}</TableCell>
                <TableCell>
                  <Chip
                    label={finding.severity}
                    color={getSeverityColor(finding.severity)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{finding.title}</TableCell>
                <TableCell>
                  <Chip
                    label={finding.status}
                    color={getStatusColor(finding.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{finding.lastUpdated}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => navigate(`/security/${finding.id}`)}>
                    상세 보기
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Security; 