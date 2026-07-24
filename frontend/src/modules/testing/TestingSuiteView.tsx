import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  LinearProgress,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Stack,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  PlayArrow as RunIcon,
  CheckCircle as PassIcon,
  Code as CodeIcon,
  AssignmentTurnedIn as TestIcon,
  Refresh as RefreshIcon,
  Assessment as CoverageIcon,
} from '@mui/icons-material';
import { CodeViewer } from '../../components/common/CodeViewer';
import { TEST_MODULE_JAVA_FILES } from '../../data/springBootCodeData';

interface TestCase {
  id: string;
  testClass: string;
  methodName: string;
  description: string;
  framework: 'JUnit 5' | 'Mockito' | 'MockMvc';
  status: 'PASSED' | 'FAILED' | 'PENDING' | 'RUNNING';
  durationMs: number;
}

const INITIAL_TESTS: TestCase[] = [
  {
    id: '1',
    testClass: 'EmployeeServiceTest',
    methodName: 'getEmployeeById_Success()',
    description: 'Verify Employee entity mapping and repository findById mock response',
    framework: 'Mockito',
    status: 'PASSED',
    durationMs: 42,
  },
  {
    id: '2',
    testClass: 'EmployeeServiceTest',
    methodName: 'getEmployeeById_NotFound_ThrowsException()',
    description: 'Assert ResourceNotFoundException thrown when employee ID missing',
    framework: 'JUnit 5',
    status: 'PASSED',
    durationMs: 18,
  },
  {
    id: '3',
    testClass: 'EmployeeServiceTest',
    methodName: 'createEmployee_Success_ReturnsDTO()',
    description: 'Verify employee creation and entity save interaction with repository',
    framework: 'Mockito',
    status: 'PASSED',
    durationMs: 65,
  },
  {
    id: '4',
    testClass: 'AuthControllerTest',
    methodName: 'login_Success_Returns200AndJwtToken()',
    description: 'MockMvc POST /api/auth/login validates JSON request & Bearer token response',
    framework: 'MockMvc',
    status: 'PASSED',
    durationMs: 112,
  },
  {
    id: '5',
    testClass: 'AuthControllerTest',
    methodName: 'login_InvalidCredentials_Returns41Unauthorized()',
    description: 'Assert BadCredentialsException maps to HTTP 401 status code',
    framework: 'MockMvc',
    status: 'PASSED',
    durationMs: 84,
  },
  {
    id: '6',
    testClass: 'JwtUtilsTest',
    methodName: 'generateJwtToken_ValidClaims_Success()',
    description: 'Assert HMAC-SHA256 signature, subject claims and expiration timestamp',
    framework: 'JUnit 5',
    status: 'PASSED',
    durationMs: 29,
  },
  {
    id: '7',
    testClass: 'JwtUtilsTest',
    methodName: 'validateJwtToken_ExpiredToken_ReturnsFalse()',
    description: 'Assert ExpiredJwtException returns false without crashing filter chain',
    framework: 'JUnit 5',
    status: 'PASSED',
    durationMs: 15,
  },
  {
    id: '8',
    testClass: 'SecurityConfigTest',
    methodName: 'unauthenticatedUser_AccessProtectedEndpoint_Returns401()',
    description: 'Verify AuthEntryPointJwt intercepts requests missing Authorization header',
    framework: 'MockMvc',
    status: 'PASSED',
    durationMs: 95,
  },
];

export const TestingSuiteView: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [testCases, setTestCases] = useState<TestCase[]>(INITIAL_TESTS);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [testLog, setTestLog] = useState<string[]>([
    '[INFO] --- maven-surefire-plugin:3.2.3:test (default-test) @ smartmanager-backend ---',
    '[INFO] Running com.enterprise.smartmanager.service.EmployeeServiceTest',
    '[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.125 s -- in com.enterprise.smartmanager.service.EmployeeServiceTest',
    '[INFO] Running com.enterprise.smartmanager.controller.AuthControllerTest',
    '[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.296 s -- in com.enterprise.smartmanager.controller.AuthControllerTest',
    '[INFO] Running com.enterprise.smartmanager.security.jwt.JwtUtilsTest',
    '[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.044 s -- in com.enterprise.smartmanager.security.jwt.JwtUtilsTest',
    '[INFO] BUILD SUCCESS - Total time: 1.248 s',
  ]);

  const handleRunAllTests = () => {
    setIsRunning(true);
    setProgress(0);
    setTestLog(['[INFO] Initializing Maven Surefire Test Engine...', '[INFO] Compiling Java 17 Test Sources with Mockito & JUnit 5...']);

    setTestCases((prev) => prev.map((t) => ({ ...t, status: 'RUNNING' })));

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 1;
      const pct = Math.min(100, currentStep * 12.5);
      setProgress(pct);

      if (currentStep <= testCases.length) {
        const testToUpdate = testCases[currentStep - 1];
        setTestLog((prevLog) => [
          ...prevLog,
          `[INFO] Running ${testToUpdate.testClass}#${testToUpdate.methodName} ... PASSED (${testToUpdate.durationMs}ms)`,
        ]);
      }

      if (currentStep >= testCases.length) {
        clearInterval(interval);
        setIsRunning(false);
        setTestCases((prev) => prev.map((t) => ({ ...t, status: 'PASSED' })));
        setTestLog((prevLog) => [
          ...prevLog,
          '[INFO] ------------------------------------------------------------------------',
          '[INFO] BUILD SUCCESS - 8 Tests Run, 0 Failures, 0 Errors, 0 Skipped.',
          '[INFO] JaCoCo Code Coverage Report: Line Coverage 94.8%, Branch Coverage 91.2%.',
          '[INFO] ------------------------------------------------------------------------',
        ]);
      }
    }, 300);
  };

  const totalTests = testCases.length;
  const passedCount = testCases.filter((t) => t.status === 'PASSED').length;
  const totalDuration = testCases.reduce((acc, t) => acc + t.durationMs, 0);

  return (
    <Box sx={{ p: 3 }}>
      {/* Title Banner */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <TestIcon sx={{ color: 'success.main', fontSize: 26 }} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Automated Testing Suite
            </Typography>
            <Chip
              label="JUNIT 5 + MOCKITO"
              color="success"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 800, fontSize: '0.62rem', height: 20 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Enterprise Unit & Integration Testing using JUnit 5, Mockito (@Mock, @InjectMocks, when().thenReturn()), MockMvc REST API assertion & JaCoCo Code Coverage.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="success"
          startIcon={isRunning ? <RefreshIcon className="animate-spin" /> : <RunIcon />}
          onClick={handleRunAllTests}
          disabled={isRunning}
          sx={{ fontWeight: 700, px: 3 }}
        >
          {isRunning ? 'Executing Tests...' : 'Run Entire Test Suite'}
        </Button>
      </Box>

      {/* Test Metrics Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2.5, mb: 4 }}>
        <Card variant="outlined" sx={{ p: 2.5, borderLeft: '4px solid', borderLeftColor: 'success.main' }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
            PASSED TESTS
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main', my: 0.5 }}>
            {passedCount} / {totalTests}
          </Typography>
          <Chip label="100% PASS RATE" color="success" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }} />
        </Card>

        <Card variant="outlined" sx={{ p: 2.5, borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
            JACOCO COVERAGE
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', my: 0.5 }}>
            94.8%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Target threshold &gt; 80.0%
          </Typography>
        </Card>

        <Card variant="outlined" sx={{ p: 2.5, borderLeft: '4px solid', borderLeftColor: 'warning.main' }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
            EXECUTION TIME
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main', my: 0.5 }}>
            {totalDuration} ms
          </Typography>
          <Typography variant="caption" color="text.secondary">
            In-memory Mockito execution
          </Typography>
        </Card>

        <Card variant="outlined" sx={{ p: 2.5, borderLeft: '4px solid', borderLeftColor: 'secondary.main' }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
            FRAMEWORKS ACTIVE
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
            <Chip label="JUnit 5" size="small" variant="outlined" sx={{ fontWeight: 700, height: 18 }} />
            <Chip label="Mockito 5" size="small" variant="outlined" sx={{ fontWeight: 700, height: 18 }} />
            <Chip label="MockMvc" size="small" variant="outlined" sx={{ fontWeight: 700, height: 18 }} />
          </Stack>
        </Card>
      </Box>

      {/* Main Tabs */}
      <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            px: 2,
            pt: 1,
          }}
        >
          <Tab icon={<TestIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Live Test Explorer" />
          <Tab icon={<CodeIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Java Test Code (JUnit / Mockito)" />
          <Tab icon={<CoverageIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Maven Surefire Terminal Log" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {isRunning && (
            <Box sx={{ mb: 3.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', display: 'block', mb: 1 }}>
                Running Maven Surefire Tests... ({Math.round(progress)}%)
              </Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
            </Box>
          )}

          {/* TAB 0: Test Cases Table */}
          {activeTab === 0 && (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, borderColor: 'divider' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Test Class</TableCell>
                    <TableCell>Test Method</TableCell>
                    <TableCell>Assertion Purpose</TableCell>
                    <TableCell>Framework</TableCell>
                    <TableCell align="right">Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testCases.map((tc) => (
                    <TableRow key={tc.id} hover>
                      <TableCell>
                        <Chip
                          icon={<PassIcon sx={{ fontSize: 14 }} />}
                          label={tc.status}
                          size="small"
                          color={tc.status === 'PASSED' ? 'success' : tc.status === 'RUNNING' ? 'info' : 'default'}
                          variant="outlined"
                          sx={{ fontWeight: 700, height: 20, fontSize: '0.65rem' }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                        <code>{tc.testClass}</code>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        <code>{tc.methodName}</code>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{tc.description}</TableCell>
                      <TableCell>
                        <Chip label={tc.framework} variant="outlined" size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                        {tc.durationMs} ms
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* TAB 1: Java Source Code */}
          {activeTab === 1 && (
            <CodeViewer
              files={TEST_MODULE_JAVA_FILES}
              title="SPRING BOOT JUNIT 5 & MOCKITO TEST CLASSES"
              subtitle="PRODUCTION READY UNIT & INTEGRATION TESTS"
            />
          )}

          {/* TAB 2: Surefire Terminal Logs */}
          {activeTab === 2 && (
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                bgcolor: theme.palette.mode === 'light' ? '#0F172A' : '#020617',
                color: '#E2E8F0',
                fontFamily: 'monospace',
                borderRadius: 1.5,
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 1, borderBottom: '1px solid', borderColor: theme.palette.mode === 'light' ? '#1E293B' : '#334155' }}>
                <Typography variant="caption" sx={{ color: theme.palette.mode === 'light' ? '#38BDF8' : '#60A5FA', fontWeight: 700, fontFamily: 'monospace' }}>
                  terminal@enterprise-ci-cd:~/app/target/surefire-reports
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontFamily: 'monospace' }}>
                  Java 17 + Maven Surefire 3.2.3
                </Typography>
              </Box>
              <Box sx={{ maxHeight: 350, overflowY: 'auto' }}>
                {testLog.map((line, idx) => (
                  <Typography key={idx} variant="caption" sx={{ display: 'block', fontFamily: 'monospace', fontSize: '0.8rem', color: line.includes('BUILD SUCCESS') || line.includes('PASSED') ? 'success.main' : line.includes('Running') ? 'primary.main' : 'inherit', mb: 0.5 }}>
                    {line}
                  </Typography>
                ))}
              </Box>
            </Paper>
          )}
        </Box>
      </Card>
    </Box>
  );
};
