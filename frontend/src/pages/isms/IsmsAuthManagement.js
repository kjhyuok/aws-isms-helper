import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  VpnKey as VpnKeyIcon
} from '@mui/icons-material';
import { useIsms } from '../../contexts/IsmsContext';
import { getMockScanResult } from '../../services/ismsService';

const IsmsAuthManagement = () => {
  const theme = useTheme();
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
  let authManagementData;
  let sectionSummary;
  let compliancePercentage;

  if (!ismsData || !ismsData.isms_mapping || !ismsData.isms_mapping['2.5']) {
    console.log('IsmsAuthManagement: 데이터 없음, 모의 데이터 사용');
    const mockData = getMockScanResult();
    authManagementData = mockData.isms_mapping['2.5'] || { items: [] };
    sectionSummary = mockData.compliance_summary?.section_summary?.['2.5'] || { total: 0, compliant: 0, percentage: 0 };
    compliancePercentage = Math.round(sectionSummary.percentage || 0);
  } else {
    // 2.5 인증 및 권한관리 데이터 추출
    authManagementData = ismsData.isms_mapping['2.5'] || { items: [] };
    sectionSummary = ismsData.compliance_summary?.section_summary?.['2.5'] || { total: 0, compliant: 0, percentage: 0 };
    compliancePercentage = Math.round(sectionSummary.percentage || 0);
  }
  
  // 각 항목별 데이터 추출
  const userAuthItem = authManagementData.items?.find(item => item.id === '2.5.1') || { compliant: false, details: {} };
  const userAccountItem = authManagementData.items?.find(item => item.id === '2.5.2') || { compliant: false, details: {} };
  const passwordItem = authManagementData.items?.find(item => item.id === '2.5.3') || { compliant: false, details: {} };

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            background: 'linear-gradient(45deg, #0078d4 30%, #4aa3f3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          2.5 인증 및 권한관리
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          사용자 인증, 접근권한 관리, 특수 권한 관리, 사용자 인증 정보 관리에 대한 보안 요구사항
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: alpha(
            compliancePercentage >= 80 ? theme.palette.success.main : 
            compliancePercentage >= 50 ? theme.palette.warning.main : 
            theme.palette.error.main, 0.1
          ),
          p: 2,
          borderRadius: 2
        }}>
          <Box sx={{ 
            width: 60, 
            height: 60, 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: alpha(
              compliancePercentage >= 80 ? theme.palette.success.main : 
              compliancePercentage >= 50 ? theme.palette.warning.main : 
              theme.palette.error.main, 0.2
            ),
            mr: 2
          }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 700,
              color: compliancePercentage >= 80 ? theme.palette.success.main : 
                    compliancePercentage >= 50 ? theme.palette.warning.main : 
                    theme.palette.error.main
            }}>
              {compliancePercentage}%
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>준수율</Typography>
            <Typography variant="body2">
              총 {sectionSummary.total || 0}개 항목 중 {sectionSummary.compliant || 0}개 준수
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* 사용자 인증 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            borderLeft: `4px solid ${userAuthItem.compliant ? theme.palette.success.main : theme.palette.error.main}`
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  2.5.1 사용자 인증
                </Typography>
                <Chip 
                  icon={userAuthItem.compliant ? <CheckCircleIcon /> : <CancelIcon />} 
                  label={userAuthItem.compliant ? "준수" : "미준수"} 
                  color={userAuthItem.compliant ? "success" : "error"}
                  variant="outlined"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                사용자 인증 메커니즘 구현 및 다중 인증(MFA) 적용 여부
              </Typography>
              
              <Alert severity={userAuthItem.compliant ? "success" : "error"} sx={{ mb: 3 }}>
                {userAuthItem.compliant 
                  ? "모든 사용자에게 MFA가 적절히 적용되어 있습니다." 
                  : "일부 사용자에게 MFA가 적용되지 않았습니다. MFA 활성화가 필요합니다."}
              </Alert>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>MFA 활성화 현황</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ 
                    width: '100%', 
                    height: 8, 
                    bgcolor: alpha(theme.palette.error.main, 0.2), 
                    borderRadius: 4,
                    mr: 2,
                    flex: 1
                  }}>
                    <Box 
                      sx={{ 
                        width: `${userAuthItem.details?.mfa_percentage || 0}%`, 
                        height: '100%', 
                        bgcolor: theme.palette.success.main, 
                        borderRadius: 4 
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 40, textAlign: 'right' }}>
                    {Math.round(userAuthItem.details?.mfa_percentage || 0)}%
                  </Typography>
                </Box>
              </Box>
              
              {userAuthItem.details?.users_without_mfa?.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>MFA 미적용 사용자</Typography>
                  <List dense disablePadding>
                    {userAuthItem.details.users_without_mfa.map((user, index) => (
                      <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <PersonIcon fontSize="small" color="action" />
                        </ListItemIcon>
                        <ListItemText primary={user} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* 사용자 계정 관리 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            borderLeft: `4px solid ${userAccountItem.compliant ? theme.palette.success.main : theme.palette.error.main}`
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  2.5.2 사용자 계정 관리
                </Typography>
                <Chip 
                  icon={userAccountItem.compliant ? <CheckCircleIcon /> : <CancelIcon />} 
                  label={userAccountItem.compliant ? "준수" : "미준수"} 
                  color={userAccountItem.compliant ? "success" : "error"}
                  variant="outlined"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                사용자 계정 및 액세스 키 관리 상태
              </Typography>
              
              <Alert severity={userAccountItem.compliant ? "success" : "error"} sx={{ mb: 3 }}>
                {userAccountItem.compliant 
                  ? "모든 액세스 키가 적절히 관리되고 있습니다." 
                  : "일부 액세스 키가 90일 이상 교체되지 않았습니다. 액세스 키 교체가 필요합니다."}
              </Alert>
              
              {userAccountItem.details?.old_access_keys?.length > 0 ? (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>90일 이상 된 액세스 키</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>사용자</TableCell>
                          <TableCell>키 ID</TableCell>
                          <TableCell align="right">경과일</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userAccountItem.details.old_access_keys.map((key, index) => (
                          <TableRow key={index}>
                            <TableCell>{key.user}</TableCell>
                            <TableCell>{key.key_id}</TableCell>
                            <TableCell align="right">{key.age_days}일</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography>90일 이상 된 액세스 키가 없습니다.</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* 비밀번호 관리 */}
        <Grid item xs={12}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            borderLeft: `4px solid ${passwordItem.compliant ? theme.palette.success.main : theme.palette.error.main}`
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  2.5.3 비밀번호 관리
                </Typography>
                <Chip 
                  icon={passwordItem.compliant ? <CheckCircleIcon /> : <CancelIcon />} 
                  label={passwordItem.compliant ? "준수" : "미준수"} 
                  color={passwordItem.compliant ? "success" : "error"}
                  variant="outlined"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                계정 비밀번호 정책 설정 상태
              </Typography>
              
              <Alert severity={passwordItem.compliant ? "success" : "error"} sx={{ mb: 3 }}>
                {passwordItem.compliant 
                  ? "비밀번호 정책이 적절히 설정되어 있습니다." 
                  : "비밀번호 정책이 설정되지 않았거나 ISMS 요구사항을 충족하지 않습니다."}
              </Alert>
              
              {passwordItem.details?.password_policy ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <VpnKeyIcon color={passwordItem.details.password_policy.MinimumPasswordLength >= 8 ? "success" : "error"} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="최소 길이" 
                          secondary={`${passwordItem.details.password_policy.MinimumPasswordLength || 0} 자 (권장: 8자 이상)`} 
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemIcon>
                          <VpnKeyIcon color={passwordItem.details.password_policy.RequireSymbols ? "success" : "error"} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="특수 문자 포함" 
                          secondary={passwordItem.details.password_policy.RequireSymbols ? "필수" : "미설정"} 
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <VpnKeyIcon color={passwordItem.details.password_policy.RequireNumbers ? "success" : "error"} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="숫자 포함" 
                          secondary={passwordItem.details.password_policy.RequireNumbers ? "필수" : "미설정"} 
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemIcon>
                          <VpnKeyIcon color={passwordItem.details.password_policy.MaxPasswordAge ? "success" : "error"} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="비밀번호 만료 기간" 
                          secondary={passwordItem.details.password_policy.MaxPasswordAge ? `${passwordItem.details.password_policy.MaxPasswordAge}일` : "미설정"} 
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CancelIcon color="error" sx={{ mr: 1 }} />
                  <Typography>비밀번호 정책이 설정되지 않았습니다. AWS 계정 비밀번호 정책을 설정하세요.</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IsmsAuthManagement;
