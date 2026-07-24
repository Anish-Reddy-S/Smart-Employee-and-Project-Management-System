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
  TextField,
  MenuItem,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import {
  History as AuditIcon,
  Search as SearchIcon,
  GetApp as ExportCsvIcon,
  PictureAsPdf as ExportPdfIcon,
} from '@mui/icons-material';
import { useData } from '../../context/DataContext';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = filterAction === 'ALL' || log.action.startsWith(filterAction);

    return matchesSearch && matchesAction;
  });

  const paginatedLogs = filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleExportCSV = () => {
    const headers = ['ID', 'Username', 'Action', 'Entity', 'Entity ID', 'Details', 'IP Address', 'Timestamp'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.username,
      l.action,
      l.entityName,
      l.entityId,
      l.details,
      l.ipAddress,
      l.timestamp,
    ]);
    exportToCSV('Audit_Logs_Report', headers, rows);
  };

  const handleExportPDF = () => {
    const headers = ['ID', 'User', 'Action', 'Entity', 'Details', 'IP', 'Timestamp'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.username,
      l.action,
      `${l.entityName} #${l.entityId}`,
      l.details,
      l.ipAddress,
      l.timestamp,
    ]);
    exportToPDF('SYSTEM AUDIT LOGS REPORT', 'Enterprise Compliance & Security Audit Records', headers, rows, 'Audit_Logs_PDF');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Title Banner */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <AuditIcon sx={{ color: 'primary.main', fontSize: 26 }} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              System Compliance & Audit Logs
            </Typography>
            <Chip
              label="COMPLIANCE TRACKER"
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 800, fontSize: '0.62rem', height: 20 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Immutable system activity logging capturing user mutations, authorization checks, IP addresses, entity changes, and export options.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<ExportCsvIcon />} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="contained" color="error" startIcon={<ExportPdfIcon />} onClick={handleExportPDF}>
            Export PDF Report
          </Button>
        </Box>
      </Box>

      {/* Filter Bar */}
      <Card variant="outlined" sx={{ p: 2.5, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, alignItems: 'center' }}>
          <TextField
            placeholder="Search by Username, Action, Details, Entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ flexGrow: 1, minWidth: 260 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            select
            label="Category"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="ALL">All Event Types</MenuItem>
            <MenuItem value="AUTH">Authentication (AUTH)</MenuItem>
            <MenuItem value="EMPLOYEE">Employee Events</MenuItem>
            <MenuItem value="PROJECT">Project Events</MenuItem>
            <MenuItem value="TASK">Task Board Events</MenuItem>
            <MenuItem value="LEAVE">Leave Approvals</MenuItem>
            <MenuItem value="ATTENDANCE">Attendance Events</MenuItem>
          </TextField>
        </Box>
      </Card>

      {/* Audit Table */}
      <Card variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden', borderColor: 'divider' }}>
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Log ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action Code</TableCell>
                <TableCell>Entity & ID</TableCell>
                <TableCell>Action Details</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>#{log.id}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                    <code>{log.username}</code>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.action}
                      size="small"
                      color={
                        log.action.includes('CREATE') || log.action.includes('LOGIN')
                          ? 'success'
                          : log.action.includes('DELETE') || log.action.includes('REJECT')
                          ? 'error'
                          : 'info'
                      }
                      variant="outlined"
                      sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                    {log.entityName} #{log.entityId}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{log.details}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' }}>
                    <code>{log.ipAddress}</code>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{log.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredLogs.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </Card>
    </Box>
  );
};
