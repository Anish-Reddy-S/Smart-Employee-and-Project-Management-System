import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Avatar,
  Divider,
  Stack,
  Chip,
  Paper,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Save as SaveIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Badge as BadgeIcon,
  Work as WorkIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const ProfileSettingsView: React.FC = () => {
  const theme = useTheme();
  const { user, updateProfile } = useAuth();
  const { showSnackbar } = useData();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || 'Aarav',
    lastName: user?.lastName || 'Sharma',
    email: user?.email || 'aarav.sharma@enterprise.com',
    department: user?.department || 'Software Engineering',
    designation: user?.designation || 'Senior Full Stack Java Engineer',
    employeeCode: user?.employeeCode || 'EMP-1001',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar('File size exceeds 5MB limit defined in application.properties!', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        showSnackbar('Profile avatar image uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setAvatarUrl(null);
    showSnackbar('Profile avatar removed', 'info');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData.employeeCode.trim()) {
      showSnackbar('Employee ID is a mandatory field!', 'error');
      return;
    }
    updateProfile(profileData);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Title */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <BadgeIcon sx={{ color: 'primary.main', fontSize: 26 }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            My Corporate Profile
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Manage your enterprise profile details, contact emails, professional skills, and custom avatar pictures.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Account Details */}
        <Grid item xs={12} md={7}>
          <Card variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2.5 }}>
              Edit Profile Details
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3, mb: 3 }}>
              <Avatar
                src={avatarUrl || user?.profilePictureUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394A3B8'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>"}
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {!avatarUrl && `${profileData.firstName.charAt(0)}${profileData.lastName.charAt(0)}`}
              </Avatar>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Profile Avatar Image
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                  Supports JPG, PNG or WEBP (Max 5MB Multipart Upload limit)
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    startIcon={<UploadIcon />}
                    sx={{ fontWeight: 700 }}
                  >
                    Upload Image
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                  </Button>

                  {avatarUrl && (
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </Button>
                  )}
                </Stack>
              </Box>
            </Box>

            <Divider sx={{ my: 2.5, borderColor: 'divider' }} />

            <form onSubmit={handleUpdateProfile}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="First Name"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Last Name"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  />
                </Grid>
                 <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    label="Employee ID"
                    value={profileData.employeeCode}
                    onChange={(e) => setProfileData({ ...profileData, employeeCode: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Corporate Email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" startIcon={<SaveIcon />} sx={{ fontWeight: 700 }}>
                  Save Profile
                </Button>
              </Box>
            </form>
          </Card>
        </Grid>

        {/* Right Column: Corporate Placement & Professional Skills */}
        <Grid item xs={12} md={5}>
          <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <WorkIcon sx={{ color: 'primary.main', fontSize: 20 }} /> Corporate Placement
            </Typography>

            <Paper variant="outlined" sx={{ p: 2.5, bgcolor: 'background.default', borderRadius: 1.5, borderColor: 'divider' }}>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Designation</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>{profileData.designation}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Department</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>{profileData.department}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Account Privileges</Typography>
                  <Chip
                    label={user?.roles && user.roles.length > 0 ? user.roles[0] : 'EMPLOYEE'}
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 700, fontSize: '0.62rem', height: 20 }}
                  />
                </Box>
              </Stack>
            </Paper>
          </Card>

          <Card variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon sx={{ color: 'warning.main', fontSize: 20 }} /> Professional Skills
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
              {user?.roles && user.roles.includes('ADMIN') ? (
                ['System Security', 'JPA Hibernate', 'Database Operations', 'CI/CD Pipelines'].map((skill) => (
                  <Chip key={skill} label={skill} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                ))
              ) : (
                ['React', 'Spring Boot', 'Material UI', 'REST APIs', 'Java Development'].map((skill) => (
                  <Chip key={skill} label={skill} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                ))
              )}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
