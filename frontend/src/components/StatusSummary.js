import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const StatusSummary = ({ categories }) => {
  const theme = useTheme();
  
  // 전체 준수율 계산
  const totalItems = categories.reduce((sum, category) => sum + category.total, 0);
  const compliantItems = categories.reduce((sum, category) => sum + category.compliant, 0);
  const overallPercentage = totalItems > 0 ? Math.round((compliantItems / totalItems) * 100) : 0;
  
  // 상태에 따른 색상 결정
  const getStatusColor = (percentage) => {
    if (percentage >= 90) return theme.palette.success.main;
    if (percentage >= 70) return theme.palette.warning.main;
    return theme.palette.error.main;
  };
  
  const getStatusIcon = (percentage) => {
    if (percentage >= 90) return <CheckCircleIcon fontSize="small" color="success" />;
    if (percentage >= 70) return <WarningIcon fontSize="small" color="warning" />;
    return <ErrorIcon fontSize="small" color="error" />;
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        mb: 3, 
        borderRadius: 2,
        background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,242,245,0.9) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
            준수 상태 요약
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                fontSize: '1.5rem',
                color: getStatusColor(overallPercentage)
              }}
            >
              {overallPercentage}%
            </Typography>
            <Box sx={{ ml: 1 }}>{getStatusIcon(overallPercentage)}</Box>
          </Box>
        </Box>
        
        <Grid container spacing={1}>
          {categories.map((category) => {
            const percentage = category.total > 0 
              ? Math.round((category.compliant / category.total) * 100) 
              : 0;
            
            return (
              <Grid item xs={6} sm={4} md={2} key={category.name}>
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      {category.name}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: getStatusColor(percentage) }}>
                      {percentage}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={percentage} 
                    sx={{ 
                      height: 4, 
                      borderRadius: 2,
                      backgroundColor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getStatusColor(percentage),
                      }
                    }}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StatusSummary;