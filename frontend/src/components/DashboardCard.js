import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  alpha,
  useTheme
} from '@mui/material';
import {
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const DashboardCard = ({ title, icon, status, statusText, itemCount, onDetailClick }) => {
  const theme = useTheme();
  
  let statusColor = theme.palette.info.main;
  let statusIcon = <InfoIcon fontSize="small" color="info" />;
  let bgColor = alpha(theme.palette.info.main, 0.08);

  switch (status) {
    case 'high':
      statusColor = theme.palette.error.main;
      statusIcon = <ErrorIcon fontSize="small" color="error" />;
      bgColor = alpha(theme.palette.error.main, 0.08);
      break;
    case 'medium':
      statusColor = theme.palette.warning.main;
      statusIcon = <WarningIcon fontSize="small" color="warning" />;
      bgColor = alpha(theme.palette.warning.main, 0.08);
      break;
    case 'low':
      statusColor = theme.palette.info.main;
      statusIcon = <InfoIcon fontSize="small" color="info" />;
      bgColor = alpha(theme.palette.info.main, 0.08);
      break;
    case 'ok':
      statusColor = theme.palette.success.main;
      statusIcon = <CheckCircleIcon fontSize="small" color="success" />;
      bgColor = alpha(theme.palette.success.main, 0.08);
      break;
    default:
      statusColor = theme.palette.info.main;
      statusIcon = <InfoIcon fontSize="small" color="info" />;
      bgColor = alpha(theme.palette.info.main, 0.08);
  }

  return (
    <Card 
      className="hover-card"
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'visible',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: bgColor,
              mr: 2
            }}
          >
            {React.cloneElement(icon, { sx: { color: statusColor } })}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
            {title}
          </Typography>
          {statusIcon}
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            flexGrow: 1,
            lineHeight: 1.6
          }}
        >
          {statusText}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600,
              color: statusColor,
              display: 'flex',
              alignItems: 'center',
              p: 0.75,
              px: 1.5,
              borderRadius: 5,
              bgcolor: bgColor
            }}
          >
            {itemCount} 항목
          </Typography>
          <Button 
            size="small" 
            onClick={onDetailClick}
            endIcon={<ArrowForwardIcon fontSize="small" />}
            sx={{ 
              fontWeight: 600,
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            자세히 보기
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;