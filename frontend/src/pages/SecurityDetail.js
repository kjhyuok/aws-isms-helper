import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';

function SecurityDetail() {
  const { id } = useParams();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        보안 발견 사항 상세
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        선택한 보안 발견 사항의 상세 정보와 권장 조치 사항입니다.
      </Typography>

      {/* 여기에 발견 사항 상세 정보 표시 */}
      <Box sx={{ mt: 4 }}>
         <Typography variant="h6">발견 사항 ID: {id}</Typography>
         <Typography variant="body2" color="text.secondary">해당 발견 사항에 대한 상세 내용과 해결 방법이 여기에 표시될 예정입니다.</Typography>
      </Box>

    </Box>
  );
}

export default SecurityDetail; 