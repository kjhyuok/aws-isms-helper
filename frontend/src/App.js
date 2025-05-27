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

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App({ signOut, user }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
        </Routes>
      </Layout>
      <AmazonQChatbot />
    </ThemeProvider>
  );
}

export default withAuthenticator(App);