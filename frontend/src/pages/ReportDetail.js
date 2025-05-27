import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';

function ReportDetail() {
  const { sectionId, findingId } = useParams();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        보고서 항목 상세
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        선택한 보고서 항목 ({sectionId} - {findingId})의 상세 정보입니다.
      </Typography>

      {/* 여기에 보고서 항목 상세 정보 표시 */}
      <Box sx={{ mt: 4 }}>
         <Typography variant="h6">섹션 ID: {sectionId}, 발견 사항 ID: {findingId}</Typography>
         <Typography variant="body2" color="text.secondary">해당 보고서 항목에 대한 상세 내용이 여기에 표시될 예정입니다.</Typography>
      </Box>

    </Box>
  );
}

export default ReportDetail; 