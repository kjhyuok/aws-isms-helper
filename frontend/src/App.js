import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Checklist from './pages/Checklist';
import Security from './pages/Security';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Logging from './pages/Logging';
import SecurityDetail from './pages/SecurityDetail';
import ReportDetail from './pages/ReportDetail';
import DataProtection from './pages/DataProtection';
import AccountManagement from './pages/AccountManagement';
import NetworkSecurity from './pages/NetworkSecurity';
import AmazonQChatbot from './components/AmazonQChatbot';

// ISMS 대시보드 및 세부 페이지 임포트
import IsmsDashboard from './pages/IsmsDashboard';
import IsmsControls from './pages/IsmsControls';
import IsmsAuthManagement from './pages/isms/IsmsAuthManagement';
import IsmsAccessControl from './pages/isms/IsmsAccessControl';
import IsmsEncryption from './pages/isms/IsmsEncryption';
import IsmsSecureDevelopment from './pages/isms/IsmsSecureDevelopment';
import IsmsSystemOperation from './pages/isms/IsmsSystemOperation';
import IsmsSystemSecurity from './pages/isms/IsmsSystemSecurity';

// ISMS 지원 도구 페이지 임포트
import MockInterview from './pages/tools/MockInterview';
import ReportGenerator from './pages/tools/ReportGenerator';
import IsmsAiChat from './pages/tools/IsmsAiChat';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// ISMS Context Provider 임포트
import { IsmsProvider } from './contexts/IsmsContext';

function App({ signOut, user }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <IsmsProvider>
        <Layout user={user} signOut={signOut}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/security" element={<Security />} />
            <Route path="/security/:id" element={<SecurityDetail />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/:sectionId/:findingId" element={<ReportDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logging" element={<Logging />} />
            <Route path="/data-protection" element={<DataProtection />} />
            <Route path="/account-management" element={<AccountManagement />} />
            <Route path="/network-security" element={<NetworkSecurity />} />
            
            {/* ISMS 대시보드 및 세부 페이지 라우트 */}
            <Route path="/isms-dashboard" element={<IsmsDashboard />} />
            <Route path="/isms-controls" element={<IsmsControls />} />
            <Route path="/isms-auth-management" element={<IsmsAuthManagement />} />
            <Route path="/isms-access-control" element={<IsmsAccessControl />} />
            <Route path="/isms-encryption" element={<IsmsEncryption />} />
            <Route path="/isms-secure-development" element={<IsmsSecureDevelopment />} />
            <Route path="/isms-system-operation" element={<IsmsSystemOperation />} />
            <Route path="/isms-system-security" element={<IsmsSystemSecurity />} />
            
            {/* ISMS 지원 도구 라우트 */}
            <Route path="/mock-interview" element={<MockInterview />} />
            <Route path="/report-generator" element={<ReportGenerator />} />
            <Route path="/isms-ai-chat" element={<IsmsAiChat />} />
          </Routes>
        </Layout>
        <AmazonQChatbot />
      </IsmsProvider>
    </ThemeProvider>
  );
}

export default withAuthenticator(App);
