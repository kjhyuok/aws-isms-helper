import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  SmartToy as SmartToyIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const IsmsAiChat = () => {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    { 
      type: 'bot', 
      text: '안녕하세요! ISMS-AI 어시스턴트입니다. ISMS 인증과 관련된 질문이 있으시면 무엇이든 물어보세요.' 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // 샘플 대화 기록
  const chatHistory = [
    { id: 1, title: 'ISMS 인증 준비 절차', date: '2023-06-15', messages: 5 },
    { id: 2, title: '위험 평가 방법론', date: '2023-06-22', messages: 8 },
    { id: 3, title: '보안 정책 수립 방법', date: '2023-07-05', messages: 12 }
  ];

  // 추천 질문
  const suggestedQuestions = [
    'ISMS 인증을 받기 위한 기본 요구사항은 무엇인가요?',
    '위험 평가는 어떻게 수행해야 하나요?',
    '보안 정책 문서는 어떻게 작성해야 하나요?',
    'ISMS 인증 심사 준비는 어떻게 해야 하나요?',
    '개인정보 암호화 요구사항은 무엇인가요?'
  ];

  // 메시지 전송 시 스크롤 자동 이동
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 메시지 전송
  const sendMessage = () => {
    if (!message.trim()) return;
    
    // 사용자 메시지 추가
    const updatedConversation = [
      ...conversation,
      { type: 'user', text: message }
    ];
    
    setConversation(updatedConversation);
    setMessage('');
    setIsTyping(true);
    
    // AI 응답 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
      let response = '';
      
      // 간단한 응답 로직 (실제로는 AI 모델이 처리)
      if (message.toLowerCase().includes('isms')) {
        response = 'ISMS(정보보호 관리체계)는 조직의 정보자산을 보호하기 위해 수립, 관리, 운영하는 종합적인 체계입니다. ISMS 인증은 한국인터넷진흥원(KISA)에서 주관하며, 관리체계 수립 및 운영, 보호대책 요구사항 등을 심사합니다.';
      } else if (message.toLowerCase().includes('위험') || message.toLowerCase().includes('risk')) {
        response = '위험 평가는 ISMS 인증의 핵심 요소입니다. 정보자산 식별, 위협 및 취약점 분석, 위험 분석 및 평가, 위험 처리 등의 단계로 수행됩니다. 위험 평가 방법론으로는 정성적, 정량적, 복합적 방법이 있습니다.';
      } else if (message.toLowerCase().includes('정책') || message.toLowerCase().includes('policy')) {
        response = '보안 정책은 조직의 정보보호 목표와 방향을 제시하는 문서입니다. 일반적으로 정보보호 정책, 지침, 절차의 3단계로 구성됩니다. 정책은 경영진의 승인을 받아야 하며, 정기적으로 검토 및 개정해야 합니다.';
      } else {
        response = '좋은 질문입니다. ISMS 인증과 관련하여 더 구체적인 내용이 필요하시면 알려주세요. 인증 준비, 위험 평가, 보안 통제 구현, 내부 감사, 인증 심사 등 다양한 주제에 대해 도움을 드릴 수 있습니다.';
      }
      
      setConversation([...updatedConversation, { type: 'bot', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  // 추천 질문 선택
  const selectSuggestedQuestion = (question) => {
    setMessage(question);
  };

  // 대화 초기화
  const resetConversation = () => {
    setConversation([
      { 
        type: 'bot', 
        text: '안녕하세요! ISMS-AI 어시스턴트입니다. ISMS 인증과 관련된 질문이 있으시면 무엇이든 물어보세요.' 
      }
    ]);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        ISMS-AI 챗봇
      </Typography>
      
      <Grid container spacing={3}>
        {/* 왼쪽 사이드바 */}
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Button 
              variant="contained" 
              fullWidth 
              startIcon={<RefreshIcon />}
              onClick={resetConversation}
              sx={{ 
                mb: 3,
                py: 1.5,
                background: 'linear-gradient(45deg, #0078d4 30%, #4aa3f3 90%)',
              }}
            >
              새 대화 시작
            </Button>
            
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              대화 기록
            </Typography>
            
            <List>
              {chatHistory.map((chat) => (
                <ListItem 
                  key={chat.id}
                  button
                  sx={{ 
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <HistoryIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={chat.title} 
                    secondary={`${chat.date} · ${chat.messages}개 메시지`}
                    primaryTypographyProps={{ fontSize: '0.9rem' }}
                    secondaryTypographyProps={{ fontSize: '0.8rem' }}
                  />
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                ISMS-AI 챗봇 정보
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ISMS-AI 챗봇은 ISMS 인증 준비와 관련된 질문에 답변하고 가이드를 제공합니다. 
                인증 요구사항, 보안 통제, 위험 평가, 정책 수립 등 다양한 주제에 대해 문의하세요.
              </Typography>
            </Box>
            
            <Card 
              variant="outlined" 
              sx={{ 
                borderRadius: 2, 
                bgcolor: alpha(theme.palette.info.main, 0.05),
                borderColor: alpha(theme.palette.info.main, 0.3)
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <InfoIcon color="info" sx={{ mr: 1, mt: 0.3 }} fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    이 챗봇은 일반적인 ISMS 지식을 제공하며, 조직의 특수한 상황에 맞는 법적 조언이나 컨설팅을 대체할 수 없습니다.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
        
        {/* 메인 채팅 영역 */}
        <Grid item xs={12} md={9}>
          <Paper elevation={0} sx={{ borderRadius: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {/* 채팅 메시지 영역 */}
            <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
              {conversation.map((msg, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex',
                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  {msg.type === 'bot' && (
                    <Avatar 
                      sx={{ 
                        mr: 2, 
                        bgcolor: theme.palette.primary.main
                      }}
                    >
                      <SmartToyIcon />
                    </Avatar>
                  )}
                  
                  <Box 
                    sx={{ 
                      maxWidth: '70%',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: msg.type === 'user' 
                        ? alpha(theme.palette.primary.main, 0.1)
                        : alpha(theme.palette.grey[100], 0.8),
                      boxShadow: msg.type === 'user'
                        ? `0 2px 5px ${alpha(theme.palette.primary.main, 0.1)}`
                        : '0 2px 5px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Typography variant="body1">
                      {msg.text}
                    </Typography>
                  </Box>
                  
                  {msg.type === 'user' && (
                    <Avatar 
                      sx={{ 
                        ml: 2, 
                        bgcolor: theme.palette.secondary.main
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                  )}
                </Box>
              ))}
              
              {isTyping && (
                <Box 
                  sx={{ 
                    display: 'flex',
                    mb: 2
                  }}
                >
                  <Avatar 
                    sx={{ 
                      mr: 2, 
                      bgcolor: theme.palette.primary.main
                    }}
                  >
                    <SmartToyIcon />
                  </Avatar>
                  
                  <Box 
                    sx={{ 
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.grey[100], 0.8),
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      입력 중...
                    </Typography>
                  </Box>
                </Box>
              )}
              
              <div ref={messagesEndRef} />
            </Box>
            
            {/* 추천 질문 영역 */}
            {conversation.length <= 2 && (
              <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  추천 질문
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {suggestedQuestions.map((question, index) => (
                    <Chip 
                      key={index}
                      label={question}
                      onClick={() => selectSuggestedQuestion(question)}
                      sx={{ 
                        borderRadius: '16px',
                        py: 2.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            {/* 메시지 입력 영역 */}
            <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  placeholder="메시지를 입력하세요..."
                  variant="outlined"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  sx={{ mr: 1 }}
                />
                <IconButton 
                  color="primary" 
                  onClick={sendMessage}
                  disabled={!message.trim() || isTyping}
                  sx={{ 
                    p: 2,
                    bgcolor: message.trim() ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.1),
                    color: message.trim() ? '#fff' : alpha(theme.palette.primary.main, 0.5),
                    '&:hover': {
                      bgcolor: message.trim() ? theme.palette.primary.dark : alpha(theme.palette.primary.main, 0.1),
                    },
                    '&.Mui-disabled': {
                      bgcolor: alpha(theme.palette.grey[500], 0.1),
                      color: alpha(theme.palette.grey[500], 0.5),
                    }
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                ISMS-AI는 일반적인 정보를 제공합니다. 중요한 결정에는 전문가와 상담하세요.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IsmsAiChat;
