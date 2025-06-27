import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import {
  QuestionAnswer as QuestionAnswerIcon,
  Person as PersonIcon,
  Computer as ComputerIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Print as PrintIcon
} from '@mui/icons-material';

const MockInterview = () => {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [conversation, setConversation] = useState([]);

  // 인터뷰 카테고리 목록
  const categories = [
    { id: 'auth', name: '인증 및 권한관리', icon: <PersonIcon /> },
    { id: 'access', name: '접근통제', icon: <PersonIcon /> },
    { id: 'encryption', name: '암호화 적용', icon: <PersonIcon /> },
    { id: 'development', name: '안전한 개발', icon: <PersonIcon /> },
    { id: 'operation', name: '시스템 및 서비스 운영관리', icon: <PersonIcon /> },
    { id: 'security', name: '시스템 및 서비스 보안관리', icon: <PersonIcon /> },
  ];

  // 샘플 질문 데이터
  const sampleQuestions = {
    auth: [
      "정보시스템과 개인정보 및 중요정보에 접근할 수 있는 사용자 계정 및 접근권한의 등록∙변경∙삭제에 관한 공식적인 절차를 수립∙이행하고 있는가?",
      "정보시스템과 개인정보 및 중요정보에 접근할 수 있는 사용자 계정 및 접근권한 생성∙등록∙변경 시 직무별 접근권한 분류 체계에 따라 업무상 필요한 최소한의 권한만을 부여하고 있는가?",
      "사용자에게 계정 및 접근권한을 부여하는 경우 해당 계정에 대한 보안책임이 본인에게 있음을 명확히 인식시키고 있는가?",
      "AWS서비스에서 사용되는 계정은 루트사용자계정, IAM사용자 계정이 있고 기본적으로 IAM을 통해서 계정생성 관리를 수행한다, 다수의 계정을 운영할 때는 직무별로 그룹 생성후에 권한을 부여해야 한다. 이것을 모두 준수하고 있는가?",
      "특수 권한 계정은 어떻게 관리하고 있나요?",
      "비밀번호 정책은 어떻게 설정되어 있나요?",
      "사용자 인증 방식은 어떤 것을 사용하고 있나요?",
      "접근 권한 검토는 얼마나 자주 수행하나요?"
    ],
    access: [
      "네트워크 접근통제 정책에 대해 설명해주세요.",
      "데이터베이스 접근통제는 어떻게 구현되어 있나요?",
      "원격 접속 시 보안 통제 방안은 무엇인가요?",
      "무선 네트워크 보안은 어떻게 관리하고 있나요?",
      "인터넷 접속 통제 방안은 무엇인가요?"
    ],
    encryption: [
      "개인정보 암호화 정책에 대해 설명해주세요.",
      "암호키는 어떻게 관리하고 있나요?",
      "전송 데이터 암호화는 어떻게 구현하고 있나요?",
      "저장 데이터 암호화는 어떻게 구현하고 있나요?",
      "암호화 알고리즘은 어떤 것을 사용하고 있나요?"
    ]
  };

  // 인터뷰 시작
  const startInterview = () => {
    if (!selectedCategory) return;
    
    setInterviewStarted(true);
    const questions = sampleQuestions[selectedCategory] || sampleQuestions.auth;
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
    setConversation([
      { type: 'system', text: '모의 인터뷰를 시작합니다. 질문에 답변해주세요.' },
      { type: 'question', text: randomQuestion }
    ]);
  };

  // 답변 제출
  const submitAnswer = () => {
    if (!answer.trim()) return;
    
    // 답변 추가
    const updatedConversation = [
      ...conversation,
      { type: 'answer', text: answer }
    ];
    
    // 피드백 생성 (실제로는 AI 기반 피드백이 될 수 있음)
    const feedback = "답변이 제출되었습니다. 실제 인터뷰에서는 더 구체적인 예시와 함께 설명하면 좋을 것 같습니다.";
    updatedConversation.push({ type: 'feedback', text: feedback });
    
    // 다음 질문 생성
    const questions = sampleQuestions[selectedCategory] || sampleQuestions.auth;
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    updatedConversation.push({ type: 'question', text: randomQuestion });
    
    setConversation(updatedConversation);
    setCurrentQuestion(randomQuestion);
    setAnswer('');
  };

  // 인터뷰 재시작
  const restartInterview = () => {
    setInterviewStarted(false);
    setCurrentQuestion(null);
    setAnswer('');
    setConversation([]);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        ISMS 모의 인터뷰
      </Typography>
      
      <Grid container spacing={3}>
        {/* 왼쪽 설정 패널 */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              인터뷰 설정
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="category-label">인터뷰 카테고리</InputLabel>
                <Select
                  labelId="category-label"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  disabled={interviewStarted}
                  label="인터뷰 카테고리"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: theme.palette.primary.main }}>
                          {category.icon}
                        </Avatar>
                        {category.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {!interviewStarted ? (
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<PlayArrowIcon />}
                  onClick={startInterview}
                  disabled={!selectedCategory}
                  sx={{ 
                    py: 1.5,
                    background: 'linear-gradient(45deg, #0078d4 30%, #4aa3f3 90%)',
                  }}
                >
                  인터뷰 시작하기
                </Button>
              ) : (
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  fullWidth 
                  startIcon={<RefreshIcon />}
                  onClick={restartInterview}
                  sx={{ py: 1.5 }}
                >
                  인터뷰 재시작
                </Button>
              )}
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              인터뷰 팁
            </Typography>
            
            <List dense>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: theme.palette.info.main }}>1</Avatar>
                </ListItemIcon>
                <ListItemText primary="구체적인 예시를 들어 설명하세요." />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: theme.palette.info.main }}>2</Avatar>
                </ListItemIcon>
                <ListItemText primary="관련 법규와 표준을 언급하세요." />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: theme.palette.info.main }}>3</Avatar>
                </ListItemIcon>
                <ListItemText primary="자신의 경험을 바탕으로 답변하세요." />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: theme.palette.info.main }}>4</Avatar>
                </ListItemIcon>
                <ListItemText primary="모르는 부분은 솔직하게 인정하세요." />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* 오른쪽 인터뷰 패널 */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {!interviewStarted ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                <QuestionAnswerIcon sx={{ fontSize: 80, color: alpha(theme.palette.primary.main, 0.3), mb: 2 }} />
                <Typography variant="h6" color="text.secondary" align="center">
                  왼쪽에서 카테고리를 선택하고 인터뷰를 시작하세요.
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ flexGrow: 1, mb: 3, overflow: 'auto', maxHeight: '400px' }}>
                  {conversation.map((item, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: item.type === 'question' 
                          ? alpha(theme.palette.primary.main, 0.05)
                          : item.type === 'answer'
                            ? alpha(theme.palette.success.main, 0.05)
                            : item.type === 'feedback'
                              ? alpha(theme.palette.warning.main, 0.05)
                              : 'transparent',
                        borderLeft: item.type === 'question' 
                          ? `4px solid ${theme.palette.primary.main}`
                          : item.type === 'answer'
                            ? `4px solid ${theme.palette.success.main}`
                            : item.type === 'feedback'
                              ? `4px solid ${theme.palette.warning.main}`
                              : 'none',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar 
                          sx={{ 
                            mr: 2, 
                            bgcolor: item.type === 'question' 
                              ? theme.palette.primary.main
                              : item.type === 'answer'
                                ? theme.palette.success.main
                                : item.type === 'feedback'
                                  ? theme.palette.warning.main
                                  : theme.palette.grey[500]
                          }}
                        >
                          {item.type === 'question' ? <ComputerIcon /> : 
                           item.type === 'answer' ? <PersonIcon /> : 
                           <QuestionAnswerIcon />}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            {item.type === 'question' ? '질문' : 
                             item.type === 'answer' ? '내 답변' : 
                             item.type === 'feedback' ? '피드백' : '시스템'}
                          </Typography>
                          <Typography variant="body2">
                            {item.text}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
                
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="답변을 입력하세요..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<SaveIcon />}
                    >
                      대화 저장
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={submitAnswer}
                      disabled={!answer.trim()}
                      startIcon={<PlayArrowIcon />}
                      sx={{ 
                        background: 'linear-gradient(45deg, #0078d4 30%, #4aa3f3 90%)',
                      }}
                    >
                      답변 제출
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MockInterview;
