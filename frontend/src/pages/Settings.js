import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Divider,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

const Settings = () => {
  const [awsRegion, setAwsRegion] = useState('ap-northeast-2');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoScanInterval, setAutoScanInterval] = useState('daily');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [slackWebhookUrl, setSlackWebhookUrl] = useState('');
  const [slackChannel, setSlackChannel] = useState('#security-alerts');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // 샘플 데이터
  const connectedAccounts = [
    {
      id: '123456789012',
      name: '프로덕션 계정',
      role: 'isms-helper-role',
      lastScan: '2023-06-15 14:30:45'
    },
    {
      id: '098765432109',
      name: '개발 계정',
      role: 'isms-helper-role',
      lastScan: '2023-06-14 10:22:15'
    }
  ];

  const handleSaveSettings = () => {
    // 설정 저장 로직 구현
    setSnackbarMessage('설정이 저장되었습니다.');
    setSnackbarOpen(true);
  };

  const handleDeleteAccount = (accountId) => {
    // 계정 삭제 로직 구현
    console.log(`Delete account: ${accountId}`);
  };

  const handleRefreshAccount = (accountId) => {
    // 계정 새로고침 로직 구현
    console.log(`Refresh account: ${accountId}`);
  };

  const handleSaveSlackSettings = () => {
    // Slack 설정 저장 로직
    setSnackbarMessage('Slack 알림 설정이 저장되었습니다.');
    setSnackbarOpen(true);
  };

  const handleTestSlackNotification = () => {
    // Slack 테스트 알림 전송 로직
    setSnackbarMessage('테스트 알림이 전송되었습니다.');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        설정
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        애플리케이션 설정 및 AWS 계정 연결을 관리합니다.
      </Typography>

      <Grid container spacing={3}>
        {/* 일반 설정 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SettingsIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">일반 설정</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="aws-region-label">기본 AWS 리전</InputLabel>
                  <Select
                    labelId="aws-region-label"
                    value={awsRegion}
                    label="기본 AWS 리전"
                    onChange={(e) => setAwsRegion(e.target.value)}
                  >
                    <MenuItem value="ap-northeast-2">서울 (ap-northeast-2)</MenuItem>
                    <MenuItem value="ap-northeast-1">도쿄 (ap-northeast-1)</MenuItem>
                    <MenuItem value="us-east-1">버지니아 북부 (us-east-1)</MenuItem>
                    <MenuItem value="us-west-2">오레곤 (us-west-2)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="scan-interval-label">자동 스캔 주기</InputLabel>
                  <Select
                    labelId="scan-interval-label"
                    value={autoScanInterval}
                    label="자동 스캔 주기"
                    onChange={(e) => setAutoScanInterval(e.target.value)}
                  >
                    <MenuItem value="hourly">매시간</MenuItem>
                    <MenuItem value="daily">매일</MenuItem>
                    <MenuItem value="weekly">매주</MenuItem>
                    <MenuItem value="monthly">매월</MenuItem>
                    <MenuItem value="never">사용 안함</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="report-format-label">기본 보고서 형식</InputLabel>
                  <Select
                    labelId="report-format-label"
                    value={reportFormat}
                    label="기본 보고서 형식"
                    onChange={(e) => setReportFormat(e.target.value)}
                  >
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="excel">Excel</MenuItem>
                    <MenuItem value="html">HTML</MenuItem>
                    <MenuItem value="json">JSON</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationsEnabled}
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="알림 활성화"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSettings}
                >
                  설정 저장
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* AWS 계정 연결 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SettingsIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">AWS 계정 연결</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <List>
              {connectedAccounts.map((account) => (
                <Card key={account.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {account.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      계정 ID: {account.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      IAM 역할: {account.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      마지막 스캔: {account.lastScan}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleRefreshAccount(account.id)}
                      >
                        <RefreshIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteAccount(account.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </List>
            
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              fullWidth
              sx={{ mt: 2 }}
            >
              AWS 계정 추가
            </Button>
          </Paper>
        </Grid>
        
        {/* Slack 알림 설정 */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotificationsIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Slack 알림 설정</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  보안 이벤트 발생 시 Slack으로 알림을 받을 수 있습니다. Slack Webhook URL을 설정하세요.
                </Alert>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Slack Webhook URL"
                  placeholder="https://hooks.slack.com/services/..."
                  value={slackWebhookUrl}
                  onChange={(e) => setSlackWebhookUrl(e.target.value)}
                  variant="outlined"
                  helperText="Slack 앱 설정에서 Incoming Webhook URL을 생성하세요"
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Slack 채널"
                  value={slackChannel}
                  onChange={(e) => setSlackChannel(e.target.value)}
                  variant="outlined"
                  placeholder="#channel-name"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationsEnabled}
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="중요 알림만 전송"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<SaveIcon />}
                    onClick={handleSaveSlackSettings}
                  >
                    설정 저장
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<NotificationsIcon />}
                    onClick={handleTestSlackNotification}
                    disabled={!slackWebhookUrl}
                  >
                    테스트 알림 전송
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* 조직 설정 */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SettingsIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">조직 설정</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="조직명"
                  defaultValue="모두의 ISMS"
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="인증 담당자"
                  defaultValue="홍길동"
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="담당자 이메일"
                  defaultValue="security@example.com"
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="담당자 연락처"
                  defaultValue="010-1234-5678"
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="인증 범위"
                  defaultValue="AWS 클라우드 환경 내 모든 리소스"
                  multiline
                  rows={2}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSettings}
                >
                  조직 설정 저장
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Settings;