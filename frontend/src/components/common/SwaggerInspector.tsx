import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  Chip,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Close as CloseIcon,
  Api as ApiIcon,
  PlayArrow as ExecuteIcon,
} from '@mui/icons-material';
import { authService } from '../../services/api';

interface SwaggerInspectorProps {
  open: boolean;
  onClose: () => void;
}

export const SwaggerInspector: React.FC<SwaggerInspectorProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/auth/login');
  const [httpMethod, setHttpMethod] = useState<'GET' | 'POST'>('POST');
  const [requestBody, setRequestBody] = useState('{\n  "username": "admin",\n  "password": "admin123"\n}');
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedEndpoint === '/api/auth/login') {
      setHttpMethod('POST');
      setRequestBody('{\n  "username": "admin",\n  "password": "admin123"\n}');
    } else if (selectedEndpoint === '/api/auth/register') {
      setHttpMethod('POST');
      setRequestBody('{\n  "username": "new_engineer",\n  "email": "eng@enterprise.com",\n  "password": "password123",\n  "firstName": "Robert",\n  "lastName": "Miller",\n  "role": "ROLE_EMPLOYEE"\n}');
    } else if (selectedEndpoint === '/api/users') {
      setHttpMethod('GET');
      setRequestBody('');
    } else if (selectedEndpoint === '/api/roles') {
      setHttpMethod('GET');
      setRequestBody('');
    } else if (selectedEndpoint === '/api/health') {
      setHttpMethod('GET');
      setRequestBody('');
    }
  }, [selectedEndpoint]);

  const handleExecute = async () => {
    setLoading(true);
    setResponseOutput(null);
    try {
      if (selectedEndpoint === '/api/auth/login') {
        const body = JSON.parse(requestBody);
        const res = await authService.login(body.username, body.password);
        setResponseOutput({ status: 200, statusText: '200 OK', data: res });
      } else if (selectedEndpoint === '/api/auth/register') {
        const body = JSON.parse(requestBody);
        const res = await authService.register(body);
        setResponseOutput({ status: 201, statusText: '201 Created', data: res });
      } else if (selectedEndpoint === '/api/users') {
        const res = await authService.getUsers();
        setResponseOutput({ status: 200, statusText: '200 OK', data: res });
      } else if (selectedEndpoint === '/api/roles') {
        const res = await authService.getRoles();
        setResponseOutput({ status: 200, statusText: '200 OK', data: res });
      } else if (selectedEndpoint === '/api/health') {
        const res = await authService.getHealth();
        setResponseOutput({ status: 200, statusText: '200 OK', data: res });
      }
    } catch (err: any) {
      setResponseOutput({
        status: err.response?.status || 500,
        statusText: err.response?.statusText || 'Error',
        data: err.response?.data || { message: err.message },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth slotProps={{ paper: { sx: { borderRadius: 2 } } }}>
      <DialogTitle
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ApiIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem' }}>
            OpenAPI Interactive REST Studio
          </Typography>
          <Chip
            label="v1.0.0"
            size="small"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 800, height: 18, fontSize: '0.62rem' }}
          />
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: 'background.default' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Test Spring Boot REST Controller endpoints live against Express Java-styled backend server.
        </Typography>

        {/* Endpoint Selector */}
        <Card variant="outlined" sx={{ p: 2.5, mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Method</InputLabel>
              <Select value={httpMethod} disabled label="Method">
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ flexGrow: 1, minWidth: 260 }}>
              <InputLabel>Route Path</InputLabel>
              <Select
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
                label="Route Path"
              >
                <MenuItem value="/api/auth/login">[POST] /api/auth/login - Authenticate & Get JWT</MenuItem>
                <MenuItem value="/api/auth/register">[POST] /api/auth/register - Register User</MenuItem>
                <MenuItem value="/api/users">[GET] /api/users - Fetch All Account Profiles</MenuItem>
                <MenuItem value="/api/roles">[GET] /api/roles - Fetch RBAC Roles & Permissions</MenuItem>
                <MenuItem value="/api/health">[GET] /api/health - Spring Actuator Health Check</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="success"
              startIcon={<ExecuteIcon />}
              onClick={handleExecute}
              disabled={loading}
              sx={{ fontWeight: 700, px: 3, height: 38 }}
            >
              {loading ? 'Executing...' : 'Execute'}
            </Button>
          </Box>
        </Card>

        {/* Request Payload Editor */}
        {httpMethod === 'POST' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary' }}>
              Request Body (JSON DTO Payload):
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={5}
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              variant="outlined"
              slotProps={{
                input: {
                  style: {
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    backgroundColor: theme.palette.mode === 'light' ? '#0F172A' : '#0B0F19',
                    color: '#CE9178',
                  },
                },
              }}
            />
          </Box>
        )}

        {/* Response Section */}
        {responseOutput && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Server Response:
              </Typography>
              <Chip
                label={responseOutput.statusText}
                color={responseOutput.status < 300 ? 'success' : 'error'}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 700, height: 20 }}
              />
            </Box>
            <Box
              sx={{
                bgcolor: theme.palette.mode === 'light' ? '#0F172A' : '#0B0F19',
                color: '#D4D4D4',
                p: 2.5,
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                maxHeight: 300,
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
              }}
            >
              <pre style={{ margin: 0, fontFamily: 'monospace' }}>{JSON.stringify(responseOutput.data, null, 2)}</pre>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} color="secondary">
          Close Studio
        </Button>
      </DialogActions>
    </Dialog>
  );
};
