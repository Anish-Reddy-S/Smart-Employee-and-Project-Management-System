import React from 'react';
import { Box, Card, Typography, Button, Chip, Stack } from '@mui/material';
import {
  Lock as LockIcon,
  Security as SecurityIcon,
  ArrowBack as ArrowBackIcon,
  SwapHoriz as SwapIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { RoleType } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: RoleType[];
  requiredPermission?: string;
  onNavigateToAllowed?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission,
  onNavigateToAllowed,
}) => {
  const { isAuthenticated, activeRole, hasPermission, switchRole } = useAuth();

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Card variant="outlined" sx={{ p: 4, maxWidth: 520, width: '100%', textAlign: 'center', borderRadius: 2 }}>
          <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: 'rgba(0, 120, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
            <SecurityIcon sx={{ fontSize: 32, color: '#0078D4' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            401 Unauthorized: Session Required
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You must be authenticated with a valid Spring Security JWT Bearer token to access this enterprise module.
          </Typography>
          <Button variant="contained" sx={{ bgcolor: '#0078D4', fontWeight: 700 }} onClick={() => window.location.reload()}>
            Sign In Again
          </Button>
        </Card>
      </Box>
    );
  }

  // Check Role authorization
  if (allowedRoles && !allowedRoles.includes(activeRole)) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Card variant="outlined" sx={{ p: 4, maxWidth: 560, width: '100%', borderRadius: 2, borderLeft: '6px solid #A80000' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'rgba(168, 0, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LockIcon sx={{ fontSize: 26, color: '#A80000' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#A80000' }}>
                403 Access Denied: Restricted
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Spring Security @PreAuthorize Method Guard Exception
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" component="div" sx={{ mb: 2.5 }}>
            Your active security role <code>{activeRole}</code> does not have sufficient RBAC permissions to access this view. Allowed roles: {allowedRoles.map((r) => (
              <Chip key={r} label={r} size="small" color="primary" sx={{ mx: 0.5, fontWeight: 700 }} />
            ))}.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
            {onNavigateToAllowed && (
              <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onNavigateToAllowed} sx={{ fontWeight: 700 }}>
                Return to My Allowed Views
              </Button>
            )}
            <Button
              variant="contained"
              color="error"
              startIcon={<SwapIcon />}
              onClick={() => switchRole('ADMIN')}
              sx={{ fontWeight: 700 }}
            >
              Switch to ADMIN
            </Button>
          </Stack>
        </Card>
      </Box>
    );
  }

  // Check specific permission if supplied
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Card variant="outlined" sx={{ p: 4, maxWidth: 520, width: '100%', textAlign: 'center', borderRadius: 2 }}>
          <LockIcon sx={{ fontSize: 40, color: '#D97706', mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            Missing Permission: {requiredPermission}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            You require the <code>{requiredPermission}</code> authority to perform or view this operation.
          </Typography>
        </Card>
      </Box>
    );
  }

  return <>{children}</>;
};
