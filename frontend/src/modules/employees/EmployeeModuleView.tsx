import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Stack,
  Skeleton,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  People as PeopleIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FileDownload as ExportIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as DateIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { useData } from '../../context/DataContext';
import { Employee } from '../../types';

export const EmployeeModuleView: React.FC = () => {
  const theme = useTheme();
  const { employees, addEmployee, updateEmployee, deleteEmployee, showSnackbar } = useData();

  // Search, Filter, Sort & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [orderBy, setOrderBy] = useState<keyof Employee>('firstName');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  // Modal Dialog States
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    designation: '',
    department: 'Software Engineering',
    hireDate: new Date().toISOString().split('T')[0],
    salary: 95000,
    status: 'ACTIVE',
    profilePictureUrl: '',
    skills: ['Java 17', 'Spring Boot', 'React'],
  });

  const [skillsInput, setSkillsInput] = useState('Java 17, Spring Boot, React');

  // Handle Sort
  const handleRequestSort = (property: keyof Employee) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Filter & Sort Employees
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const matchesSearch =
          emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.designation.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept = selectedDepartment === 'ALL' || emp.department === selectedDepartment;
        const matchesStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;

        return matchesSearch && matchesDept && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[orderBy] || '';
        let valB = b[orderBy] || '';

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      });
  }, [employees, searchQuery, selectedDepartment, selectedStatus, orderBy, order]);

  // Paginated data
  const paginatedEmployees = useMemo(() => {
    return filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredEmployees, page, rowsPerPage]);

  const handleOpenAdd = () => {
    setFormData({
      employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      designation: '',
      department: 'Software Engineering',
      hireDate: new Date().toISOString().split('T')[0],
      salary: 95000,
      status: 'ACTIVE',
      profilePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      skills: ['Java 17', 'Spring Boot'],
    });
    setSkillsInput('Java 17, Spring Boot');
    setOpenAddModal(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setSelectedEmployee(emp);
    setFormData({
      employeeCode: emp.employeeCode,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      designation: emp.designation,
      department: emp.department,
      hireDate: emp.hireDate,
      salary: emp.salary,
      status: emp.status,
      profilePictureUrl: emp.profilePictureUrl || '',
      skills: emp.skills || [],
    });
    setSkillsInput((emp.skills || []).join(', '));
    setOpenEditModal(true);
  };

  const handleOpenDetails = (emp: Employee) => {
    setSelectedEmployee(emp);
    setOpenDetailsModal(true);
  };

  const handleOpenDelete = (emp: Employee) => {
    setSelectedEmployee(emp);
    setOpenDeleteDialog(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
    addEmployee({ ...formData, skills: skillsArray });
    setOpenAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    const skillsArray = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
    updateEmployee(selectedEmployee.id, { ...formData, skills: skillsArray });
    setOpenEditModal(false);
  };

  const handleConfirmDelete = () => {
    if (selectedEmployee) {
      deleteEmployee(selectedEmployee.id);
      setOpenDeleteDialog(false);
    }
  };

  const handleExportCSV = () => {
    const headers = 'EmployeeCode,FirstName,LastName,Email,Phone,Department,Designation,Salary,Status\n';
    const rows = filteredEmployees
      .map((e) => `${e.employeeCode},${e.firstName},${e.lastName},${e.email},${e.phone},${e.department},${e.designation},${e.salary},${e.status}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employee_directory_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showSnackbar('Exported Employee directory CSV file successfully', 'info');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Module Title Banner */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <PeopleIcon sx={{ color: 'primary.main', fontSize: 26 }} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Employee Directory Management
            </Typography>
            <Chip
              label="DATA GRID"
              color="success"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 800, fontSize: '0.62rem', height: 20 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Manage employee master records, contact details, department mappings, salary structures, and skills.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<ExportIcon />} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
            Add Employee
          </Button>
        </Box>
      </Box>

      {/* Filter and Search Bar */}
      <Card variant="outlined" sx={{ p: 2.5, mb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' }, gap: 2.5, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search by name, email, code, designation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControl size="small" fullWidth>
            <InputLabel>Department</InputLabel>
            <Select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} label="Department">
              <MenuItem value="ALL">All Departments</MenuItem>
              <MenuItem value="Software Engineering">Software Engineering</MenuItem>
              <MenuItem value="Executive">Executive</MenuItem>
              <MenuItem value="Cloud Infrastructure">Cloud Infrastructure</MenuItem>
              <MenuItem value="UI/UX Design">UI/UX Design</MenuItem>
              <MenuItem value="Quality Assurance">Quality Assurance</MenuItem>
              <MenuItem value="Human Resources">Human Resources</MenuItem>
              <MenuItem value="Finance & Accounting">Finance & Accounting</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} label="Status">
              <MenuItem value="ALL">All Statuses</MenuItem>
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="ON_LEAVE">ON LEAVE</MenuItem>
              <MenuItem value="INACTIVE">INACTIVE</MenuItem>
              <MenuItem value="TERMINATED">TERMINATED</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      {/* Main Employee Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, mb: 2, borderColor: 'divider' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'employeeCode'}
                  direction={orderBy === 'employeeCode' ? order : 'asc'}
                  onClick={() => handleRequestSort('employeeCode')}
                >
                  Code
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'department'}
                  direction={orderBy === 'department' ? order : 'asc'}
                  onClick={() => handleRequestSort('department')}
                >
                  Department & Title
                </TableSortLabel>
              </TableCell>
              <TableCell>Contact Info</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'salary'}
                  direction={orderBy === 'salary' ? order : 'asc'}
                  onClick={() => handleRequestSort('salary')}
                >
                  Salary
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton variant="circular" width={32} height={32} sx={{ display: 'inline-block', mr: 1.5, verticalAlign: 'middle' }} /><Skeleton variant="text" width={120} sx={{ display: 'inline-block', verticalAlign: 'middle' }} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={120} /></TableCell>
                  <TableCell><Skeleton width={140} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell align="right"><Skeleton width={100} /></TableCell>
                </TableRow>
              ))
            ) : paginatedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.3 }} />
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                      No employees found
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Try widening your search queries or resetting status/department filters.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedEmployees.map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        src={emp.profilePictureUrl}
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                        }}
                      >
                        {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          onClick={() => handleOpenDetails(emp)}
                          sx={{
                            fontWeight: 700,
                            cursor: 'pointer',
                            '&:hover': { color: 'primary.main', textDecoration: 'underline' }
                          }}
                        >
                          {emp.firstName} {emp.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Joined {emp.hireDate}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                    <code>{emp.employeeCode}</code>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {emp.designation}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {emp.department}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 500 }}>
                      {emp.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {emp.phone}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ fontWeight: 700, color: 'success.main' }}>
                    ₹{emp.salary.toLocaleString('en-IN')}/yr
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={emp.status}
                      size="small"
                      color={
                        emp.status === 'ACTIVE'
                          ? 'success'
                          : emp.status === 'ON_LEAVE'
                          ? 'warning'
                          : emp.status === 'INACTIVE'
                          ? 'default'
                          : 'error'
                      }
                      variant="outlined"
                      sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                      <Tooltip title="View Profile">
                        <IconButton size="small" onClick={() => handleOpenDetails(emp)} color="secondary" sx={{ p: 0.5 }}>
                          <ViewIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Employee">
                        <IconButton size="small" onClick={() => handleOpenEdit(emp)} color="secondary" sx={{ p: 0.5 }}>
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Record">
                        <IconButton size="small" onClick={() => handleOpenDelete(emp)} color="error" sx={{ p: 0.5 }}>
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredEmployees.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Dialog: Add Employee */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSaveAdd}>
          <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3, py: 2 }}>
            Create New Employee Master Record
          </DialogTitle>
          <DialogContent sx={{ px: 3, py: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, mt: 1 }}>
              <TextField
                required
                size="small"
                label="Employee Code"
                value={formData.employeeCode}
                onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
              />
              <TextField
                required
                size="small"
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <TextField
                required
                size="small"
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
              <TextField
                required
                type="email"
                size="small"
                label="Corporate Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                required
                size="small"
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <TextField
                required
                size="small"
                label="Designation / Title"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
              <FormControl size="small" fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  label="Department"
                >
                  <MenuItem value="Software Engineering">Software Engineering</MenuItem>
                  <MenuItem value="Executive">Executive</MenuItem>
                  <MenuItem value="Cloud Infrastructure">Cloud Infrastructure</MenuItem>
                  <MenuItem value="UI/UX Design">UI/UX Design</MenuItem>
                  <MenuItem value="Quality Assurance">Quality Assurance</MenuItem>
                  <MenuItem value="Human Resources">Human Resources</MenuItem>
                  <MenuItem value="Finance & Accounting">Finance & Accounting</MenuItem>
                </Select>
              </FormControl>

              <TextField
                type="number"
                size="small"
                label="Annual Salary (₹)"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
              />

              <TextField
                type="date"
                size="small"
                label="Hire Date"
                value={formData.hireDate}
                onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <FormControl size="small" fullWidth>
                <InputLabel>Employment Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  label="Employment Status"
                >
                  <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  <MenuItem value="ON_LEAVE">ON LEAVE</MenuItem>
                  <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                  <MenuItem value="TERMINATED">TERMINATED</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Profile Picture URL"
                value={formData.profilePictureUrl}
                onChange={(e) => setFormData({ ...formData, profilePictureUrl: e.target.value })}
                placeholder="https://..."
              />

              <TextField
                size="small"
                label="Skills (Comma Separated)"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Java, Spring Boot, React, Docker"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button onClick={() => setOpenAddModal(false)} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save Employee
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog: Edit Employee */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSaveEdit}>
          <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3, py: 2 }}>
            Edit Employee: {selectedEmployee?.firstName} {selectedEmployee?.lastName}
          </DialogTitle>
          <DialogContent sx={{ px: 3, py: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, mt: 1 }}>
              <TextField
                required
                size="small"
                label="Employee Code"
                value={formData.employeeCode}
                onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
              />
              <TextField
                required
                size="small"
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <TextField
                required
                size="small"
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
              <TextField
                required
                type="email"
                size="small"
                label="Corporate Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                required
                size="small"
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <TextField
                required
                size="small"
                label="Designation / Title"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
              <FormControl size="small" fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  label="Department"
                >
                  <MenuItem value="Software Engineering">Software Engineering</MenuItem>
                  <MenuItem value="Executive">Executive</MenuItem>
                  <MenuItem value="Cloud Infrastructure">Cloud Infrastructure</MenuItem>
                  <MenuItem value="UI/UX Design">UI/UX Design</MenuItem>
                  <MenuItem value="Quality Assurance">Quality Assurance</MenuItem>
                  <MenuItem value="Human Resources">Human Resources</MenuItem>
                  <MenuItem value="Finance & Accounting">Finance & Accounting</MenuItem>
                </Select>
              </FormControl>

              <TextField
                type="number"
                size="small"
                label="Annual Salary (₹)"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
              />

              <TextField
                type="date"
                size="small"
                label="Hire Date"
                value={formData.hireDate}
                onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <FormControl size="small" fullWidth>
                <InputLabel>Employment Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  label="Employment Status"
                >
                  <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  <MenuItem value="ON_LEAVE">ON LEAVE</MenuItem>
                  <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                  <MenuItem value="TERMINATED">TERMINATED</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Profile Picture URL"
                value={formData.profilePictureUrl}
                onChange={(e) => setFormData({ ...formData, profilePictureUrl: e.target.value })}
              />

              <TextField
                size="small"
                label="Skills (Comma Separated)"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button onClick={() => setOpenEditModal(false)} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Update Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal: View Details */}
      <Dialog open={openDetailsModal} onClose={() => setOpenDetailsModal(false)} maxWidth="sm" fullWidth>
        {selectedEmployee && (
          <Box>
            <DialogTitle
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                px: 3,
                py: 2.5,
              }}
            >
              <Avatar
                src={selectedEmployee.profilePictureUrl}
                sx={{
                  width: 48,
                  height: 48,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'primary.main',
                  fontSize: '1rem',
                  fontWeight: 700,
                }}
              >
                {selectedEmployee.firstName.charAt(0)}{selectedEmployee.lastName.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedEmployee.designation} • {selectedEmployee.employeeCode}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Department</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedEmployee.department}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Employment Status</Typography>
                    <Chip
                      label={selectedEmployee.status}
                      size="small"
                      color={
                        selectedEmployee.status === 'ACTIVE'
                          ? 'success'
                          : selectedEmployee.status === 'ON_LEAVE'
                          ? 'warning'
                          : selectedEmployee.status === 'INACTIVE'
                          ? 'default'
                          : 'error'
                      }
                      variant="outlined"
                      sx={{ fontWeight: 700, height: 20 }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Corporate Email</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedEmployee.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Phone Number</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedEmployee.phone}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Hire Date</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedEmployee.hireDate}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Annual Salary</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                      ₹{selectedEmployee.salary.toLocaleString('en-IN')}/yr
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ borderColor: 'divider' }} />

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontWeight: 700, letterSpacing: '0.05em' }}>
                    TECHNICAL SKILLS & COMPETENCIES
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {(selectedEmployee.skills || ['Java', 'Spring Boot']).map((skill, i) => (
                      <Chip
                        key={i}
                        label={skill}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          bgcolor: theme.palette.mode === 'light' ? 'rgba(37, 99, 235, 0.04)' : 'rgba(59, 130, 246, 0.08)',
                          borderColor: theme.palette.mode === 'light' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(59, 130, 246, 0.2)',
                          color: 'primary.main',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button onClick={() => setOpenDetailsModal(false)} variant="contained">
                Close Profile
              </Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid', borderColor: 'divider', px: 3, py: 2 }}>Confirm Delete</DialogTitle>
        <DialogContent sx={{ px: 3, py: 2.5 }}>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Are you sure you want to permanently delete the employee record for <strong>{selectedEmployee?.firstName} {selectedEmployee?.lastName}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete Record
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
