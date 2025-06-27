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
  Stepper,
  Step,
  StepLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const ReportGenerator = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [reportType, setReportType] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [selectedSections, setSelectedSections] = useState([]);
  const [generatedReport, setGeneratedReport] = useState(null);

  // 보고서 유형 목록
  const reportTypes = [
    { id: 'gap', name: 'ISMS 갭 분석 보고서' },
    { id: 'risk', name: '위험 평가 보고서' },
    { id: 'implementation', name: '이행 계획 보고서' },
    { id: 'audit', name: '내부 감사 보고서' },
    { id: 'status', name: '보안 현황 보고서' }
  ];

  // 보고서 섹션 목록
  const reportSections = {
    gap: [
      { id: 'intro', name: '개요', selected: true },
      { id: 'methodology', name: '평가 방법론', selected: true },
      { id: 'findings', name: '주요 발견사항', selected: true },
      { id: 'auth', name: '인증 및 권한관리 갭 분석', selected: true },
      { id: 'access', name: '접근통제 갭 분석', selected: true },
      { id: 'encryption', name: '암호화 적용 갭 분석', selected: true },
      { id: 'development', name: '안전한 개발 갭 분석', selected: false },
      { id: 'operation', name: '시스템 및 서비스 운영관리 갭 분석', selected: true },
      { id: 'security', name: '시스템 및 서비스 보안관리 갭 분석', selected: true },
      { id: 'recommendations', name: '개선 권고사항', selected: true },
      { id: 'conclusion', name: '결론', selected: true }
    ],
    risk: [
      { id: 'intro', name: '개요', selected: true },
      { id: 'methodology', name: '위험 평가 방법론', selected: true },
      { id: 'assets', name: '정보자산 식별', selected: true },
      { id: 'threats', name: '위협 식별', selected: true },
      { id: 'vulnerabilities', name: '취약점 식별', selected: true },
      { id: 'risk_analysis', name: '위험 분석', selected: true },
      { id: 'risk_evaluation', name: '위험 평가', selected: true },
      { id: 'risk_treatment', name: '위험 처리 방안', selected: true },
      { id: 'conclusion', name: '결론', selected: true }
    ]
  };

  // 단계 정의
  const steps = ['보고서 유형 선택', '기본 정보 입력', '섹션 선택', '보고서 생성'];

  // 다음 단계로 이동
  const handleNext = () => {
    if (activeStep === 2) {
      generateReport();
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // 이전 단계로 이동
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // 섹션 선택 토글
  const toggleSection = (sectionId) => {
    setSelectedSections(prevSections => {
      const updatedSections = [...prevSections];
      const sectionIndex = updatedSections.findIndex(section => section.id === sectionId);
      
      if (sectionIndex !== -1) {
        updatedSections[sectionIndex].selected = !updatedSections[sectionIndex].selected;
      }
      
      return updatedSections;
    });
  };

  // 보고서 유형 변경 시 섹션 업데이트
  const handleReportTypeChange = (e) => {
    const type = e.target.value;
    setReportType(type);
    setSelectedSections(reportSections[type] || []);
  };

  // 보고서 생성
  const generateReport = () => {
    const selectedSectionsList = selectedSections
      .filter(section => section.selected)
      .map(section => section.name)
      .join(', ');
    
    const report = {
      type: reportTypes.find(type => type.id === reportType)?.name || '',
      title: reportTitle,
      organization,
      sections: selectedSectionsList,
      date: new Date().toLocaleDateString()
    };
    
    setGeneratedReport(report);
  };

  // 현재 단계에 따른 컨텐츠 렌더링
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              생성할 보고서 유형을 선택하세요
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="report-type-label">보고서 유형</InputLabel>
              <Select
                labelId="report-type-label"
                value={reportType}
                onChange={handleReportTypeChange}
                label="보고서 유형"
              >
                {reportTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                보고서 유형 설명
              </Typography>
              {reportType === 'gap' && (
                <Typography variant="body2" color="text.secondary">
                  ISMS 갭 분석 보고서는 조직의 현재 정보보호 관리체계와 ISMS 인증 요구사항 간의 차이를 분석하여 문서화합니다. 
                  이 보고서는 ISMS 인증 준비를 위한 기초 자료로 활용됩니다.
                </Typography>
              )}
              {reportType === 'risk' && (
                <Typography variant="body2" color="text.secondary">
                  위험 평가 보고서는 조직의 정보자산에 대한 위협과 취약점을 식별하고, 위험을 분석 및 평가하여 적절한 처리 방안을 제시합니다.
                  ISMS 인증의 핵심 요구사항 중 하나인 위험관리 활동의 결과물입니다.
                </Typography>
              )}
              {reportType === 'implementation' && (
                <Typography variant="body2" color="text.secondary">
                  이행 계획 보고서는 ISMS 인증을 위해 필요한 보안 통제의 구현 계획을 상세히 기술합니다.
                  각 통제별 이행 일정, 담당자, 예산 등을 포함합니다.
                </Typography>
              )}
              {reportType === 'audit' && (
                <Typography variant="body2" color="text.secondary">
                  내부 감사 보고서는 조직의 정보보호 관리체계가 ISMS 요구사항에 따라 적절히 운영되고 있는지 검증한 결과를 문서화합니다.
                  ISMS 인증 유지를 위한 필수 활동인 내부 감사의 결과물입니다.
                </Typography>
              )}
              {reportType === 'status' && (
                <Typography variant="body2" color="text.secondary">
                  보안 현황 보고서는 조직의 현재 정보보호 상태를 종합적으로 분석하여 경영진에게 보고하기 위한 문서입니다.
                  주요 보안 지표, 사고 현황, 취약점 현황 등을 포함합니다.
                </Typography>
              )}
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              보고서 기본 정보를 입력하세요
            </Typography>
            <TextField
              fullWidth
              label="보고서 제목"
              variant="outlined"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              sx={{ mb: 3, mt: 2 }}
            />
            <TextField
              fullWidth
              label="조직명"
              variant="outlined"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="작성자"
              variant="outlined"
              defaultValue="관리자"
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="작성일"
              variant="outlined"
              defaultValue={new Date().toLocaleDateString()}
              disabled
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              보고서에 포함할 섹션을 선택하세요
            </Typography>
            <List>
              {selectedSections.map((section) => (
                <ListItem 
                  key={section.id}
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      checked={section.selected}
                      onChange={() => toggleSection(section.id)}
                    />
                  }
                  sx={{ 
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: section.selected ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                >
                  <ListItemText 
                    primary={section.name} 
                    primaryTypographyProps={{ fontWeight: section.selected ? 600 : 400 }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              보고서가 생성되었습니다
            </Typography>
            
            {generatedReport && (
              <Card variant="outlined" sx={{ mt: 2, mb: 3 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {generatedReport.title || '제목 없음'}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {generatedReport.type}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" gutterBottom>
                    <strong>조직명:</strong> {generatedReport.organization}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>작성일:</strong> {generatedReport.date}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>포함된 섹션:</strong> {generatedReport.sections}
                  </Typography>
                </CardContent>
              </Card>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined" 
                startIcon={<SaveIcon />}
              >
                보고서 저장
              </Button>
              <Button 
                variant="contained" 
                startIcon={<DownloadIcon />}
                sx={{ 
                  background: 'linear-gradient(45deg, #0078d4 30%, #4aa3f3 90%)',
                }}
              >
                PDF 다운로드
              </Button>
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        ISMS 보고서 생성기
      </Typography>
      
      <Paper elevation={0} sx={{ borderRadius: 2, mb: 3 }}>
        <Stepper activeStep={activeStep} sx={{ p: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ borderRadius: 2, minHeight: '400px' }}>
            {getStepContent(activeStep)}
            
            <Divider />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3 }}>
              <Button
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
              >
                이전
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  (activeStep === 0 && !reportType) ||
                  (activeStep === 1 && (!reportTitle || !organization)) ||
                  (activeStep === 2 && !selectedSections.some(section => section.selected)) ||
                  activeStep === steps.length - 1
                }
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  background: 'linear-gradient(45deg, #0078d4 30%, #4aa3f3 90%)',
                }}
              >
                {activeStep === steps.length - 2 ? '보고서 생성' : '다음'}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              보고서 템플릿
            </Typography>
            
            <List>
              <ListItem 
                button
                sx={{ 
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                <ListItemIcon>
                  <DescriptionIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="ISMS 갭 분석 보고서 템플릿" 
                  secondary="기본 템플릿"
                />
              </ListItem>
              <ListItem 
                button
                sx={{ 
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                <ListItemIcon>
                  <DescriptionIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="위험 평가 보고서 템플릿" 
                  secondary="기본 템플릿"
                />
              </ListItem>
              <ListItem 
                button
                sx={{ 
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                <ListItemIcon>
                  <DescriptionIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="이행 계획 보고서 템플릿" 
                  secondary="기본 템플릿"
                />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              최근 생성된 보고서
            </Typography>
            
            <List>
              <ListItem 
                button
                sx={{ 
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                <ListItemText 
                  primary="2023년 ISMS 갭 분석 보고서" 
                  secondary="2023-05-15 생성"
                />
              </ListItem>
              <ListItem 
                button
                sx={{ 
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                <ListItemText 
                  primary="2023년 위험 평가 보고서" 
                  secondary="2023-06-22 생성"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportGenerator;
