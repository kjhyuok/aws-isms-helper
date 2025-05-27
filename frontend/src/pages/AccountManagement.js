import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  VpnKey as VpnKeyIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Key as KeyIcon
} from '@mui/icons-material';
import StatusSummary from '../components/StatusSummary';

const AccountManagement = () => {
  const [activeTab, setActiveTab] = useState('users');
  
  // 상태 요약을 위한 데이터
  const statusCategories = [
    { name: 'MFA 활성화', compliant: 1, total: 3 },
    { name: '비밀번호 정책', compliant: 2, total: 3 },
    { name: '액세스 키 관리', compliant: 2, total: 4 },
    { name: '최소 권한', compliant: 3, total: 3 },
    { name: '미사용 자격 증명', compliant: 2, total: 2 },
    { name: '권한 검토', compliant: 1, total: 2 }
  ];

  // 샘플 데이터
  const iamUsers = [
    {
      username: 'admin',
      created: '2022-01-15',
      lastActivity: '2023-06-15',
      mfaEnabled: true,
      accessKeys: 1,
      passwordLastChanged: '2023-05-01',
      status: 'ok'
    },
    {
      username: 'developer1',
      created: '2022-03-10',
      lastActivity: '2023-06-14',
      mfaEnabled: false,
      accessKeys: 1,
      passwordLastChanged: '2023-01-15',
      status: 'medium'
    },
    {
      username: 'system-user',
      created: '2022-05-20',
      lastActivity: '2023-06-10',
      mfaEnabled: false,
      accessKeys: 2,
      passwordLastChanged: '2022-05-20',
      status: 'high'
    }
  ];

  const accessKeys = [
    {
      id: 'AKIAIOSFODNN7EXAMPLE',
      username: 'admin',
      created: '2022-01-15',
      lastUsed: '2023-06-15',
      status: 'active',
      age: 150,
      riskLevel: 'ok'
    },
    {
      id: 'AKIAI44QH8DHBEXAMPLE',
      username: 'developer1',
      created: '2022-03-10',
      lastUsed: '2023-06-14',
      status: 'active',
      age: 90,
      riskLevel: 'ok'
    },
    {
      id: 'AKIAIOSFODNN7EXAMPLE2',
      username: 'system-user',
      created: '2022-05-20',
      lastUsed: '2023-01-10',
      status: 'active',
      age: 390,
      riskLevel: 'high'
    },
    {
      id: 'AKIAI44QH8DHBEXAMPLE2',
      username: 'system-user',
      created: '2022-05-20',
      lastUsed: '2023-06-10',
      status: 'active',
      age: 30,
      riskLevel: 'ok'
    }
  ];

  const iamRoles = [
    {
      name: 'AdminRole',
      created: '2022-01-15',
      lastActivity: '2023-06-15',
      trustedEntities: 'AWS 계정',
      status: 'ok'
    },
    {
      name: 'LambdaExecutionRole',
      created: '2022-03-10',
      lastActivity: '2023-06-14',
      trustedEntities: 'Lambda',
      status: 'ok'
    },
    {
      name: 'EC2Role',
      created: '2022-05-20',
      lastActivity: '2023-06-10',
      trustedEntities: 'EC2',
      status: 'ok'
    }
  ];

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

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        계정 및 접근 관리
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        AWS IAM 사용자, 액세스 키, 역할을 관리하고 ISMS 요구사항에 맞게 설정합니다.
      </Typography>
      
      {/* 상태 요약 카드 */}
      <StatusSummary categories={statusCategories} />

      {/* 탭 버튼 */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        <Button 
          variant={activeTab === 'users' ? 'contained' : 'outlined'} 
          onClick={() => setActiveTab('users')}
          startIcon={<AccountCircleIcon />}
        >
          IAM 사용자
        </Button>
        <Button 
          variant={activeTab === 'keys' ? 'contained' : 'outlined'} 
          onClick={() => setActiveTab('keys')}
          startIcon={<VpnKeyIcon />}
        >
          액세스 키
        </Button>
        <Button 
          variant={activeTab === 'roles' ? 'contained' : 'outlined'} 
          onClick={() => setActiveTab('roles')}
          startIcon={<SecurityIcon />}
        >
          IAM 역할
        </Button>
      </Box>

      {/* IAM 사용자 탭 */}
      {activeTab === 'users' && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountCircleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">IAM 사용자</Typography>
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                size="small"
              >
                사용자 추가
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>사용자 이름</TableCell>
                    <TableCell>생성일</TableCell>
                    <TableCell>마지막 활동</TableCell>
                    <TableCell>MFA</TableCell>
                    <TableCell>액세스 키</TableCell>
                    <TableCell>비밀번호 변경일</TableCell>
                    <TableCell>상태</TableCell>
                    <TableCell>작업</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {iamUsers.map((user) => (
                    <TableRow key={user.username}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.created}</TableCell>
                      <TableCell>{user.lastActivity}</TableCell>
                      <TableCell>
                        {user.mfaEnabled ? 
                          <Chip size="small" color="success" label="활성화" /> : 
                          <Chip size="small" color="error" label="비활성화" />
                        }
                      </TableCell>
                      <TableCell>{user.accessKeys}</TableCell>
                      <TableCell>{user.passwordLastChanged}</TableCell>
                      <TableCell>{getStatusChip(user.status)}</TableCell>
                      <TableCell>
                        <Tooltip title="사용자 관리">
                          <IconButton size="small">
                            <SecurityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="삭제">
                          <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">보안 권장사항</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <WarningIcon color="warning" />
                </ListItemIcon>
                <ListItemText 
                  primary="MFA가 활성화되지 않은 사용자가 있습니다." 
                  secondary="모든 IAM 사용자에 대해 다중 인증(MFA)을 활성화하는 것이 좋습니다." 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WarningIcon color="warning" />
                </ListItemIcon>
                <ListItemText 
                  primary="90일 이상 비밀번호를 변경하지 않은 사용자가 있습니다." 
                  secondary="ISMS 요구사항에 따라 비밀번호는 90일마다 변경해야 합니다." 
                />
              </ListItem>
            </List>
          </Paper>
        </>
      )}

      {/* 액세스 키 탭 */}
      {activeTab === 'keys' && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <VpnKeyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">액세스 키</Typography>
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                size="small"
              >
                액세스 키 생성
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>액세스 키 ID</TableCell>
                    <TableCell>사용자</TableCell>
                    <TableCell>생성일</TableCell>
                    <TableCell>마지막 사용</TableCell>
                    <TableCell>상태</TableCell>
                    <TableCell>사용 기간(일)</TableCell>
                    <TableCell>위험도</TableCell>
                    <TableCell>작업</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accessKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell>{key.id}</TableCell>
                      <TableCell>{key.username}</TableCell>
                      <TableCell>{key.created}</TableCell>
                      <TableCell>{key.lastUsed}</TableCell>
                      <TableCell>
                        <Chip size="small" color="success" label={key.status} />
                      </TableCell>
                      <TableCell>{key.age}</TableCell>
                      <TableCell>{getStatusChip(key.riskLevel)}</TableCell>
                      <TableCell>
                        <Tooltip title="비활성화">
                          <IconButton size="small">
                            <KeyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="삭제">
                          <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">보안 권장사항</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <ErrorIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="90일 이상 된 액세스 키가 있습니다." 
                  secondary="ISMS 요구사항에 따라 액세스 키는 90일마다 교체해야 합니다." 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WarningIcon color="warning" />
                </ListItemIcon>
                <ListItemText 
                  primary="일부 사용자에게 여러 개의 액세스 키가 있습니다." 
                  secondary="각 사용자는 필요한 최소한의 액세스 키만 보유하는 것이 좋습니다." 
                />
              </ListItem>
            </List>
          </Paper>
        </>
      )}

      {/* IAM 역할 탭 */}
      {activeTab === 'roles' && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SecurityIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">IAM 역할</Typography>
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                size="small"
              >
                역할 추가
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>역할 이름</TableCell>
                    <TableCell>생성일</TableCell>
                    <TableCell>마지막 활동</TableCell>
                    <TableCell>신뢰할 수 있는 엔터티</TableCell>
                    <TableCell>상태</TableCell>
                    <TableCell>작업</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {iamRoles.map((role) => (
                    <TableRow key={role.name}>
                      <TableCell>{role.name}</TableCell>
                      <TableCell>{role.created}</TableCell>
                      <TableCell>{role.lastActivity}</TableCell>
                      <TableCell>{role.trustedEntities}</TableCell>
                      <TableCell>{getStatusChip(role.status)}</TableCell>
                      <TableCell>
                        <Tooltip title="역할 관리">
                          <IconButton size="small">
                            <SecurityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="삭제">
                          <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">보안 권장사항</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="모든 IAM 역할이 최소 권한 원칙을 준수합니다." 
                  secondary="현재 역할 구성에 문제가 없습니다." 
                />
              </ListItem>
            </List>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default AccountManagement;