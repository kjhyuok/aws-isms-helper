import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';

const AwsCredentialsForm = ({ onSave }) => {
  const [credentials, setCredentials] = useState({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'ap-northeast-2'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 간단한 유효성 검사
      if (!credentials.accessKeyId || !credentials.secretAccessKey) {
        throw new Error('Access Key ID와 Secret Access Key를 모두 입력해주세요.');
      }

      // 실제로는 AWS SDK를 사용하여 자격 증명을 검증해야 합니다.
      // 해커톤 목적으로 간단히 구현합니다.
      
      // 자격 증명을 로컬 스토리지에 저장
      localStorage.setItem('awsCredentials', JSON.stringify(credentials));
      
      // 성공 상태 설정
      setSuccess(true);
      
      // 부모 컴포넌트에 알림
      if (onSave) {
        onSave(credentials);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          AWS 자격 증명이 성공적으로 저장되었습니다.
        </Alert>
      )}
      
      <TextField
        fullWidth
        label="AWS Access Key ID"
        name="accessKeyId"
        value={credentials.accessKeyId}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="AWS Secret Access Key"
        name="secretAccessKey"
        value={credentials.secretAccessKey}
        onChange={handleChange}
        margin="normal"
        type="password"
        required
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel>AWS 리전</InputLabel>
        <Select
          name="region"
          value={credentials.region}
          onChange={handleChange}
          label="AWS 리전"
        >
          <MenuItem value="ap-northeast-2">서울 (ap-northeast-2)</MenuItem>
          <MenuItem value="ap-northeast-1">도쿄 (ap-northeast-1)</MenuItem>
          <MenuItem value="us-east-1">버지니아 북부 (us-east-1)</MenuItem>
          <MenuItem value="us-west-2">오레곤 (us-west-2)</MenuItem>
        </Select>
      </FormControl>
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}
        sx={{ mt: 3, mb: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'AWS 계정 연결'}
      </Button>
    </Box>
  );
};

export default AwsCredentialsForm;
