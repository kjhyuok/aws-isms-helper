import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { scanAwsAccount } from '../services/ismsService';
import { useIsms } from '../contexts/IsmsContext';

const IsmsScanner = ({ onScanComplete }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accountId, setAccountId] = useState('195275662470');
  const [region, setRegion] = useState('us-east-1');
  const { fetchIsmsData } = useIsms();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('스캔 시작:', accountId, region);
      
      // 실제 API 호출
      const result = await scanAwsAccount(accountId, region);
      console.log('스캔 결과:', result);
      
      // 스캔 완료 후 약간의 지연 시간을 두어 DynamoDB에 데이터가 저장될 시간을 확보
      console.log('스캔 완료, 2초 후 데이터 새로고침');
      setTimeout(async () => {
        // 스캔 완료 후 ISMS 데이터 새로고침
        await fetchIsmsData();
        console.log('ISMS 데이터 새로고침 완료');
        
        setLoading(false);
        setOpen(false);
        
        // 부모 컴포넌트에 스캔 완료 알림
        if (onScanComplete) {
          onScanComplete();
        }
      }, 2000);
    } catch (err) {
      console.error('스캔 오류:', err);
      setError('스캔 중 오류가 발생했습니다: ' + (err.message || '알 수 없는 오류'));
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={handleClickOpen}
        sx={{ 
          background: 'linear-gradient(45deg, #0078d4 30%, #4aa3f3 90%)',
          boxShadow: '0 4px 12px rgba(0, 120, 212, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0, 120, 212, 0.4)',
          }
        }}
      >
        AWS 계정 스캔
      </Button>

      <Dialog open={open} onClose={loading ? undefined : handleClose}>
        <DialogTitle>AWS 계정 보안 스캔</DialogTitle>
        <DialogContent>
          <DialogContentText>
            AWS 계정의 보안 설정을 스캔하여 ISMS 요구사항 충족 여부를 확인합니다.
            스캔에는 약 1-2분이 소요될 수 있습니다.
          </DialogContentText>
          
          <Box sx={{ mt: 3 }}>
            <TextField
              label="AWS 계정 ID"
              fullWidth
              margin="normal"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              disabled={loading}
            />
            <TextField
              label="리전"
              fullWidth
              margin="normal"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              disabled={loading}
            />
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
              <CircularProgress size={24} sx={{ mr: 2 }} />
              <Typography>스캔 중입니다. 잠시만 기다려주세요...</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            취소
          </Button>
          <Button 
            onClick={handleScan} 
            disabled={loading || !accountId || !region}
            variant="contained"
          >
            스캔 시작
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IsmsScanner;
