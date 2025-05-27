import React, { useState } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Collapse,
  Fade,
  useTheme
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon
} from '@mui/icons-material';

const AmazonQChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: '안녕하세요! Amazon Q입니다. 무엇을 도와드릴까요?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const theme = useTheme();

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleSend = () => {
    if (input.trim() === '') return;
    
    // 사용자 메시지 추가
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
    
    // 챗봇 응답 시뮬레이션 (실제로는 Amazon Q API와 연동)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: '현재 Amazon Q 연동 준비 중입니다. 곧 서비스가 제공될 예정입니다.', 
        sender: 'bot' 
      }]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* 챗봇 버튼 */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(45deg, #0078d4 30%, #4aa3f3 90%)',
          boxShadow: '0 4px 12px rgba(0, 120, 212, 0.3)',
          zIndex: 1300,
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0, 120, 212, 0.4)',
          }
        }}
        onClick={handleToggle}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {/* 챗봇 창 */}
      <Fade in={open}>
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            width: 340,
            height: 480,
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1200,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* 헤더 */}
          <Box
            sx={{
              p: 2,
              bgcolor: theme.palette.primary.main,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: 'white',
                color: theme.palette.primary.main,
                width: 32,
                height: 32,
                mr: 1
              }}
            >
              <BotIcon fontSize="small" />
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>
              Amazon Q
            </Typography>
            <IconButton size="small" onClick={handleToggle} sx={{ color: 'white' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* 메시지 영역 */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: '#f5f7fa',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1.5,
                  maxWidth: '80%',
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: message.sender === 'user' 
                      ? theme.palette.primary.main 
                      : 'white',
                    color: message.sender === 'user' ? 'white' : 'inherit',
                    boxShadow: message.sender === 'user'
                      ? 'none'
                      : '0 2px 8px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <Typography variant="body2">{message.text}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>

          {/* 입력 영역 */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'white',
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="메시지를 입력하세요..."
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
            />
            <IconButton 
              color="primary" 
              onClick={handleSend} 
              disabled={input.trim() === ''}
              sx={{ ml: 1 }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

export default AmazonQChatbot;