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
  LinearProgress
} from '@mui/material';
import {
  Storage as StorageIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import StatusSummary from '../components/StatusSummary';

const DataProtection = () => {
  // 상태 요약을 위한 데이터
  const statusCategories = [
    { name: 'S3 암호화', compliant: 3, total: 3 },
    { name: 'S3 퍼블릭 액세스', compliant: 2, total: 3 },
    { name: 'EBS 암호화', compliant: 2, total: 2 },
    { name: 'RDS 암호화', compliant: 1, total: 2 },
    { name: '백업 정책', compliant: 1, total: 2 },
    { name: '데이터 분류', compliant: 2, total: 3 }
  ];
  // 샘플 데이터
  const s3Buckets = [
    {
      name: 'isms-logs-bucket',
      encrypted: true,
      publicAccess: false,
      versioning: true,
      status: 'ok'
    },
    {
      name: 'app-assets-bucket',
      encrypted: true,
      publicAccess: true,
      versioning: false,
      status: 'medium'
    },
    {
      name: 'customer-data-bucket',
      encrypted: true,
      publicAccess: false,
      versioning: true,
      status: 'ok'
    }
  ];

  const ebsVolumes = [
    {
      id: 'vol-0123456789abcdef0',
      size: '100 GB',
      type: 'gp3',
      encrypted: true,
      status: 'ok'
    },
    {
      id: 'vol-0123456789abcdef1',
      size: '500 GB',
      type: 'io2',
      encrypted: true,
      status: 'ok'
    }
  ];

  const rdsInstances = [
    {
      identifier: 'isms-prod-db',
      engine: 'PostgreSQL',
      encrypted: true,
      backupRetention: 7,
      status: 'ok'
    },
    {
      identifier: 'isms-dev-db',
      engine: 'MySQL',
      encrypted: false,
      backupRetention: 1,
      status: 'high'
    }
  ];

  // 암호화 상태 계산
  const totalResources = s3Buckets.length + ebsVolumes.length + rdsInstances.length;
  const encryptedResources = 
    s3Buckets.filter(b => b.encrypted).length + 
    ebsVolumes.filter(v => v.encrypted).length + 
    rdsInstances.filter(db => db.encrypted).length;
  
  const encryptionPercentage = Math.round((encryptedResources / totalResources) * 100);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        데이터 보호
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        AWS 환경의 데이터 암호화 및 보호 상태를 확인하고 ISMS 요구사항에 맞게 관리합니다.
      </Typography>
      
      {/* 상태 요약 카드 */}
      <StatusSummary categories={statusCategories} />

      {/* 암호화 상태 요약 */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>암호화 상태 요약</Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            전체 리소스 암호화 상태
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {encryptionPercentage}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={encryptionPercentage} 
          color={encryptionPercentage >= 90 ? "success" : encryptionPercentage >= 70 ? "warning" : "error"}
          sx={{ height: 10, borderRadius: 5, mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            암호화된 리소스: {encryptedResources}/{totalResources}
          </Typography>
          <Chip 
            size="small" 
            color={encryptionPercentage >= 90 ? "success" : encryptionPercentage >= 70 ? "warning" : "error"}
            label={encryptionPercentage >= 90 ? "양호" : encryptionPercentage >= 70 ? "주의" : "위험"}
          />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* S3 버킷 섹션 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StorageIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">S3 버킷</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {s3Buckets.map((bucket) => (
              <Card key={bucket.name} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {bucket.name}
                    </Typography>
                    <Chip 
                      size="small" 
                      color={bucket.status === 'ok' ? "success" : bucket.status === 'medium' ? "warning" : "error"}
                      label={bucket.status === 'ok' ? "양호" : bucket.status === 'medium' ? "주의" : "위험"}
                    />
                  </Box>
                  
                  <List dense disablePadding>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        {bucket.encrypted ? <LockIcon color="success" /> : <LockOpenIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText 
                        primary="서버 측 암호화" 
                        secondary={bucket.encrypted ? "활성화됨" : "비활성화됨"} 
                      />
                    </ListItem>
                    
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        {!bucket.publicAccess ? <CheckCircleIcon color="success" /> : <WarningIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText 
                        primary="퍼블릭 액세스 차단" 
                        secondary={!bucket.publicAccess ? "활성화됨" : "비활성화됨"} 
                      />
                    </ListItem>
                    
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        {bucket.versioning ? <CheckCircleIcon color="success" /> : <WarningIcon color="warning" />}
                      </ListItemIcon>
                      <ListItemText 
                        primary="버전 관리" 
                        secondary={bucket.versioning ? "활성화됨" : "비활성화됨"} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>

        {/* EBS 및 RDS 섹션 */}
        <Grid item xs={12} md={6}>
          {/* EBS 볼륨 */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StorageIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">EBS 볼륨</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {ebsVolumes.map((volume) => (
              <Card key={volume.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {volume.id}
                    </Typography>
                    <Chip 
                      size="small" 
                      color={volume.status === 'ok' ? "success" : volume.status === 'medium' ? "warning" : "error"}
                      label={volume.status === 'ok' ? "양호" : volume.status === 'medium' ? "주의" : "위험"}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {volume.size} ({volume.type})
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {volume.encrypted ? <LockIcon color="success" sx={{ mr: 1 }} /> : <LockOpenIcon color="error" sx={{ mr: 1 }} />}
                    <Typography variant="body2">
                      {volume.encrypted ? "암호화됨" : "암호화되지 않음"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Paper>

          {/* RDS 인스턴스 */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StorageIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">RDS 인스턴스</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {rdsInstances.map((db) => (
              <Card key={db.identifier} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {db.identifier}
                    </Typography>
                    <Chip 
                      size="small" 
                      color={db.status === 'ok' ? "success" : db.status === 'medium' ? "warning" : "error"}
                      label={db.status === 'ok' ? "양호" : db.status === 'medium' ? "주의" : "위험"}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {db.engine} (백업 보존: {db.backupRetention}일)
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {db.encrypted ? <LockIcon color="success" sx={{ mr: 1 }} /> : <LockOpenIcon color="error" sx={{ mr: 1 }} />}
                    <Typography variant="body2">
                      {db.encrypted ? "암호화됨" : "암호화되지 않음"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DataProtection;