import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  Chip,
  Divider,
  Stack,
  IconButton,
  Grid,
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as DateIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface UserProfileDialogProps {
  open: boolean;
  onClose: () => void;
  employee: any | null;
}

export const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ open, onClose, employee }) => {
  const { activeRole } = useAuth();
  if (!employee) return null;

  const isAdmin = activeRole === 'ADMIN';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="body">
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Employee Profile Details
        </Typography>
        <IconButton aria-label="close" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3, mb: 3 }}>
          <Avatar
            src={employee.profilePictureUrl}
            sx={{
              width: 90,
              height: 90,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontSize: '2rem',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
          </Avatar>
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flexGrow: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1, mb: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {employee.firstName} {employee.lastName}
              </Typography>
              <Chip
                label={employee.status}
                size="small"
                color={
                  employee.status === 'ACTIVE'
                    ? 'success'
                    : employee.status === 'ON_LEAVE'
                    ? 'warning'
                    : employee.status === 'INACTIVE'
                    ? 'default'
                    : 'error'
                }
                variant="outlined"
                sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }}
              />
            </Box>
            <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
              {employee.designation}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 0.5 }}>
              <WorkIcon sx={{ fontSize: 16 }} /> {employee.department}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {/* Detailed Properties Grid */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
              EMPLOYEE CODE
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.main' }}>
              {employee.employeeCode}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
              HIRE DATE
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <DateIcon sx={{ fontSize: 16, color: 'text.secondary' }} /> {employee.hireDate || 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
              EMAIL ADDRESS
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} /> {employee.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
              PHONE NUMBER
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} /> {employee.phone || 'N/A'}
            </Typography>
          </Grid>

          {/* Salary Grid Item (Protected by Role check) */}
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
              ANNUAL SALARY
            </Typography>
            {isAdmin ? (
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <MoneyIcon sx={{ fontSize: 16 }} /> ₹{employee.salary ? employee.salary.toLocaleString('en-IN') : '0'}/yr
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <MoneyIcon sx={{ fontSize: 16 }} /> [REDACTED FOR PRIVACY]
              </Typography>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Skills & Competencies */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
            SKILLS & COMPETENCIES
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
            {employee.skills && employee.skills.length > 0 ? (
              employee.skills.map((skill: string) => (
                <Chip key={skill} label={skill} size="small" variant="filled" sx={{ fontWeight: 600 }} />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No specific skills listed
              </Typography>
            )}
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="primary">
          Close Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
};
