import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useIsms } from '../contexts/IsmsContext';

const DataProtection = () => {
  const { ismsData, loading, error } = useIsms();
  
  // 로딩 중이면 로딩 표시
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // ISMS 2.7 암호화 적용 데이터 추출
  const encryptionData = ismsData?.isms_mapping?.['2.7'] || { items: [] };
  const sectionSummary = ismsData?.compliance_summary?.section_summary?.['2.7'] || { total: 0, compliant: 0, percentage: 0 };
  const compliancePercentage = Math.round(sectionSummary.percentage || 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>데이터 보호</Typography>
      
      {/* ISMS 준수 상태 요약 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">ISMS 준수 상태</Typography>
        
        {!ismsData ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            ISMS 데이터가 없습니다. ISMS 대시보드에서 AWS 계정 스캔을 실행해주세요.
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Box sx={{ flexGrow: 1, mr: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">준수율</Typography>
                <Typography variant="body2" fontWeight={600}>{compliancePercentage}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={compliancePercentage} 
                sx={{ height: 8, borderRadius: 4 }} 
              />
            </Box>
            <Chip 
              label={compliancePercentage >= 80 ? "양호" : "개선 필요"} 
              color={compliancePercentage >= 80 ? "success" : "warning"}
            />
          </Box>
        )}
      </Paper>
      
      {/* ISMS 항목 목록 */}
      {ismsData && (
        <Grid container spacing={3}>
          {encryptionData.items.map((item) => (
            <Grid item xs={12} md={6} key={item.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Chip 
                      icon={item.compliant ? <CheckCircleIcon /> : <ErrorIcon />}
                      label={item.compliant ? "준수" : "미준수"} 
                      color={item.compliant ? "success" : "error"}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.id} - {item.name} 관련 보안 설정 상태
                  </Typography>
                  
                  {/* 항목별 세부 정보 */}
                  {item.id === '2.7.1' && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">저장 데이터 암호화 상태</Typography>
                      
                      {/* S3 버킷 암호화 */}
                      <Typography variant="body2" sx={{ mt: 1 }}>S3 버킷 암호화:</Typography>
                      {item.details?.s3_encryption?.length > 0 ? (
                        <List dense>
                          {item.details.s3_encryption.map((bucket, index) => (
                            <ListItem key={index}>
                              <ListItemText 
                                primary={bucket.bucket_name}
                                secondary={bucket.encryption_enabled ? 
                                  `암호화 활성화 (${bucket.encryption_type})` : 
                                  '암호화 비활성화'}
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2">S3 버킷이 없습니다.</Typography>
                      )}
                      
                      {/* RDS 인스턴스 암호화 */}
                      <Typography variant="body2" sx={{ mt: 1 }}>RDS 인스턴스 암호화:</Typography>
                      {item.details?.rds_encryption?.length > 0 ? (
                        <List dense>
                          {item.details.rds_encryption.map((instance, index) => (
                            <ListItem key={index}>
                              <ListItemText 
                                primary={instance.db_instance_id}
                                secondary={instance.encryption_enabled ? 
                                  '암호화 활성화' : 
                                  '암호화 비활성화'}
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2">RDS 인스턴스가 없습니다.</Typography>
                      )}
                    </Box>
                  )}
                  
                  {item.id === '2.7.2' && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">암호키 관리 상태</Typography>
                      
                      {/* KMS 키 관리 */}
                      {item.details?.kms_keys?.length > 0 ? (
                        <List dense>
                          {item.details.kms_keys.map((key, index) => (
                            <ListItem key={index}>
                              <ListItemText 
                                primary={`키 ID: ${key.key_id}`}
                                secondary={`상태: ${key.key_state}, 키 교체: ${key.key_rotation_enabled ? '활성화' : '비활성화'}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2">KMS 키가 없습니다.</Typography>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* 기존 데이터 보호 컨텐츠 */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>데이터 보호 도구</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">암호화 관리</Typography>
                <Typography variant="body2" color="text.secondary">
                  AWS KMS, S3 암호화, RDS 암호화 등의 설정을 관리합니다.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">데이터 분류</Typography>
                <Typography variant="body2" color="text.secondary">
                  민감 데이터 식별 및 분류, 접근 제어 정책을 관리합니다.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DataProtection;
