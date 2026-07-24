import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';
import {
  Email as EmailIcon,
  Send as SendIcon,
  Preview as PreviewIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';
import { useData } from '../../context/DataContext';

interface EmailLogItem {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  type: 'WELCOME' | 'PASSWORD_RESET' | 'PAYSLIP' | 'LEAVE_APPROVAL';
  status: 'DELIVERED' | 'QUEUED';
  sentTimestamp: string;
  htmlContent: string;
}

const INITIAL_EMAIL_LOGS: EmailLogItem[] = [
  {
    id: 'MAIL-101',
    recipientEmail: 's.jenkins@enterprise.com',
    recipientName: 'Sarah Jenkins',
    subject: 'Welcome to Enterprise Smart Manager Portal',
    type: 'WELCOME',
    status: 'DELIVERED',
    sentTimestamp: '2026-07-22 10:15:30',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #2563EB; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Welcome to Smart Manager Portal</h2>
        </div>
        <div style="padding: 20px; color: #0f172a;">
          <p>Dear Sarah Jenkins,</p>
          <p>Your enterprise employee account has been created successfully.</p>
          <p><strong>Username:</strong> sarah_jenkins</p>
          <p><strong>Role:</strong> Senior Lead Architect (ROLE_MANAGER)</p>
          <p>Please log in and update your security credentials.</p>
        </div>
        <div style="background-color: #f8fafc; padding: 12px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
          Confidential Enterprise System Notification — Do Not Reply
        </div>
      </div>
    `,
  },
  {
    id: 'MAIL-102',
    recipientEmail: 'm.chen@enterprise.com',
    recipientName: 'Michael Chen',
    subject: 'Official Payslip Disbursement — July 2026',
    type: 'PAYSLIP',
    status: 'DELIVERED',
    sentTimestamp: '2026-07-22 11:30:00',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #16A34A; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Salary Disbursed — July 2026</h2>
        </div>
        <div style="padding: 20px; color: #0f172a;">
          <p>Dear Michael Chen,</p>
          <p>Your salary for the month of July 2026 has been deposited into your bank account.</p>
          <p><strong>Net Amount Disbursed:</strong> $11,250.00</p>
          <p>You can download your full PDF payslip directly from the Employee Portal.</p>
        </div>
      </div>
    `,
  },
];

export const EmailNotificationView: React.FC = () => {
  const { showSnackbar } = useData();
  const [emailLogs, setEmailLogs] = useState<EmailLogItem[]>(INITIAL_EMAIL_LOGS);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [previewEmail, setPreviewEmail] = useState<EmailLogItem | null>(null);

  // Form State
  const [recipientEmail, setRecipientEmail] = useState('employee@enterprise.com');
  const [recipientName, setRecipientName] = useState('Alexander Wright');
  const [emailType, setEmailType] = useState<EmailLogItem['type']>('WELCOME');

  const handleSendEmail = () => {
    let subject = '';
    let htmlContent = '';

    if (emailType === 'WELCOME') {
      subject = 'Welcome to Enterprise Smart Manager Portal';
      htmlContent = `<div style="padding:20px; border:1px solid #2563EB; border-radius: 6px; font-family: Arial, sans-serif;"><h3>Welcome ${recipientName}!</h3><p>Your account has been prepared successfully.</p></div>`;
    } else if (emailType === 'PASSWORD_RESET') {
      subject = 'Security Notification: Password Reset Link Request';
      htmlContent = `<div style="padding:20px; border:1px solid #F59E0B; border-radius: 6px; font-family: Arial, sans-serif;"><h3>Password Reset Request</h3><p>Click link below to reset credentials within 15 minutes.</p></div>`;
    } else if (emailType === 'PAYSLIP') {
      subject = 'Monthly Salary Disbursement Notice & Payslip';
      htmlContent = `<div style="padding:20px; border:1px solid #16A34A; border-radius: 6px; font-family: Arial, sans-serif;"><h3>Salary Disbursed</h3><p>Your monthly compensation has been transferred.</p></div>`;
    } else {
      subject = 'Leave Request Approval Notification';
      htmlContent = `<div style="padding:20px; border:1px solid #2563EB; border-radius: 6px; font-family: Arial, sans-serif;"><h3>Leave Request Approved</h3><p>Your requested leave days have been approved by HR.</p></div>`;
    }

    const newLog: EmailLogItem = {
      id: `MAIL-${Math.floor(100 + Math.random() * 900)}`,
      recipientEmail,
      recipientName,
      subject,
      type: emailType,
      status: 'DELIVERED',
      sentTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      htmlContent,
    };

    setEmailLogs([newLog, ...emailLogs]);
    setOpenSendModal(false);
    showSnackbar(`Simulated email sent to ${recipientEmail} via JavaMailSender!`, 'success');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Title Banner */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <EmailIcon sx={{ color: 'primary.main', fontSize: 26 }} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Email Notification Center
            </Typography>
            <Chip
              label="JAVAMAILSENDER"
              color="info"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 800, fontSize: '0.62rem', height: 20 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Asynchronous JavaMailSender service sending Thymeleaf HTML email templates for onboarding, password resets, payslips, and approvals.
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<SendIcon />} onClick={() => setOpenSendModal(true)}>
          Trigger Email Dispatcher
        </Button>
      </Box>

      {/* Outbox Table */}
      <Card variant="outlined" sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2.5 }}>
          SMTP Server Outbox Logs
        </Typography>

        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, borderColor: 'divider' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Mail ID</TableCell>
                <TableCell>Recipient</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Sent Time</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {emailLogs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{log.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {log.recipientName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {log.recipientEmail}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{log.subject}</TableCell>
                  <TableCell>
                    <Chip label={log.type} size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<SuccessIcon sx={{ fontSize: 14 }} />}
                      label={log.status}
                      color="success"
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 700, height: 20, fontSize: '0.65rem' }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{log.sentTimestamp}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<PreviewIcon />}
                      onClick={() => setPreviewEmail(log)}
                    >
                      Preview HTML
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Trigger Email Modal */}
      <Dialog open={openSendModal} onClose={() => setOpenSendModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3, py: 2 }}>
          Trigger Email Notification
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 3 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Recipient Name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Recipient Email Address"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              select
              label="Notification Template Type"
              value={emailType}
              onChange={(e) => setEmailType(e.target.value as any)}
              fullWidth
              size="small"
            >
              <MenuItem value="WELCOME">Welcome Onboarding Email</MenuItem>
              <MenuItem value="PASSWORD_RESET">Security Password Reset Link</MenuItem>
              <MenuItem value="PAYSLIP">Monthly Payslip Disbursement Notice</MenuItem>
              <MenuItem value="LEAVE_APPROVAL">Leave Request Approval Notice</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setOpenSendModal(false)} color="secondary">Cancel</Button>
          <Button variant="contained" onClick={handleSendEmail} startIcon={<SendIcon />}>
            Dispatch Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* HTML Email Preview Modal */}
      <Dialog open={Boolean(previewEmail)} onClose={() => setPreviewEmail(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3, py: 2 }}>
          Email Preview: {previewEmail?.subject}
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 3 }}>
          {previewEmail && (
            <Box
              sx={{
                p: 2.5,
                bgcolor: 'background.default',
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'center',
                mt: 1,
              }}
              dangerouslySetInnerHTML={{ __html: previewEmail.htmlContent }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setPreviewEmail(null)} color="secondary">Close Preview</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
