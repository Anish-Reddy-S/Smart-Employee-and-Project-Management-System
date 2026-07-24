import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Chip,
  Paper,
  Tabs,
  Tab,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  DirectionsBoat as DockerIcon,
  Terminal as TerminalIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { CodeViewer } from '../../components/common/CodeViewer';
import { BACKEND_CONFIG_FILES } from '../../data/springBootCodeData';
import { CodeFile } from '../../types';

const K8S_DEPLOYMENT_FILE: CodeFile = {
  filename: 'k8s-deployment.yaml',
  path: 'k8s/deployment.yaml',
  language: 'yaml',
  description: 'Kubernetes Deployment & Service manifest with HorizontalPodAutoscaler, Readiness & Liveness probes',
  content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: smartmanager-backend
  namespace: enterprise-production
  labels:
    app: smartmanager-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: smartmanager-backend
  template:
    metadata:
      labels:
        app: smartmanager-backend
    spec:
      containers:
      - name: spring-app
        image: enterprise-registry.azurecr.io/smartmanager-backend:1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: SPRING_DATASOURCE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
        resources:
          limits:
            cpu: "1000m"
            memory: "1024Mi"
          requests:
            cpu: "250m"
            memory: "512Mi"
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 20
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: smartmanager-backend-service
  namespace: enterprise-production
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
  selector:
    app: smartmanager-backend
`,
};

export const DockerDevOpsView: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [containerLogs, setContainerLogs] = useState<string[]>([
    '2026-07-22 23:30:00.102 [main] INFO  c.e.s.SmartManagerApplication - Starting SmartManagerApplication v1.0.0 using Java 17.0.10 on smartmanager-backend-78f9c-2xklq',
    '2026-07-22 23:30:01.450 [main] INFO  o.s.b.w.e.tomcat.TomcatHttp11Protocol - Initializing ProtocolHandler ["http-nio-8080"]',
    '2026-07-22 23:30:01.890 [main] INFO  com.zaxxer.hikari.HikariDataSource - HikariPool-1 - Starting...',
    '2026-07-22 23:30:02.310 [main] INFO  com.zaxxer.hikari.HikariDataSource - HikariPool-1 - Start completed.',
    '2026-07-22 23:30:03.110 [main] INFO  o.h.e.t.j.p.i.JtaPlatformInitiator - HHH000490: Using JtaPlatform implementation: [org.hibernate.engine.transaction.jta.platform.internal.NoJtaPlatform]',
    '2026-07-22 23:30:04.200 [main] INFO  c.e.s.s.c.SecurityConfig - SecurityFilterChain initialized with JWT Bearer Auth & BCrypt Password Encoder',
    '2026-07-22 23:30:04.850 [main] INFO  c.e.s.SmartManagerApplication - Started SmartManagerApplication in 4.748 seconds (JVM running for 5.210)',
    '2026-07-22 23:35:12.402 [http-nio-8080-exec-1] INFO  c.e.s.c.AuthController - POST /api/auth/login - User [admin] authenticated successfully (200 OK)',
  ]);

  const allDevOpsFiles = [...BACKEND_CONFIG_FILES.filter((f) => f.filename.includes('Docker')), K8S_DEPLOYMENT_FILE];

  const handleRefreshLogs = () => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setContainerLogs((prev) => [
      ...prev,
      `${timestamp} [http-nio-8080-exec-${Math.floor(Math.random() * 5 + 1)}] INFO  c.e.s.c.EmployeeController - GET /api/employees - Status: 200 OK (Execution Time: 14ms)`,
    ]);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Title Banner */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <DockerIcon sx={{ color: 'primary.main', fontSize: 26 }} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              DevOps Container Pipeline
            </Typography>
            <Chip
              label="DOCKER + K8S"
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 800, fontSize: '0.62rem', height: 20 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Production multi-stage Dockerfile (Eclipse Temurin JDK 17), docker-compose orchestrator with MySQL 8.0, and Kubernetes deployment specs.
          </Typography>
        </Box>

        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefreshLogs}>
          Ping Health Endpoint
        </Button>
      </Box>

      {/* Live Container Cluster Metrics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2.5, mb: 4 }}>
        <Card variant="outlined" sx={{ p: 2.5, borderLeft: '4px solid', borderLeftColor: 'success.main' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
              SPRING BACKEND
            </Typography>
            <Chip label="RUNNING" color="success" size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800 }} />
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
            smartmanager_backend:1.0.0
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Port 8080:8080 | CPU: 1.2% | RAM: 320MB
          </Typography>
        </Card>

        <Card variant="outlined" sx={{ p: 2.5, borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
              MYSQL 8.0 DATABASE
            </Typography>
            <Chip label="HEALTHY" color="success" size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800 }} />
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
            smartmanager_mysql:8.0
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Port 3306:3306 | Volume: mysql_data
          </Typography>
        </Card>

        <Card variant="outlined" sx={{ p: 2.5, borderLeft: '4px solid', borderLeftColor: 'warning.main' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
              REDIS CACHE CLUSTER
            </Typography>
            <Chip label="HEALTHY" color="success" size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800 }} />
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
            redis:7.2-alpine
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Port 6379:6379 | Token Blacklist Cache
          </Typography>
        </Card>

        <Card variant="outlined" sx={{ p: 2.5, borderLeft: '4px solid', borderLeftColor: 'secondary.main' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
              NGINX REVERSE PROXY
            </Typography>
            <Chip label="ONLINE" color="info" size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800 }} />
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
            nginx:1.25-alpine
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Port 80 / 443 SSL Ingress Router
          </Typography>
        </Card>
      </Box>

      {/* Main Container Specs */}
      <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            px: 2,
            pt: 1,
          }}
        >
          <Tab icon={<DockerIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Dockerfile & Orchestrator Specs" />
          <Tab icon={<TerminalIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Container Console Logs" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* TAB 0: Files CodeViewer */}
          {activeTab === 0 && (
            <CodeViewer
              files={allDevOpsFiles}
              title="CONTAINER & KUBERNETES MANIFESTS"
              subtitle="PRODUCTION DEPLOYMENT CONFIGURATIONS"
            />
          )}

          {/* TAB 1: Console Logs */}
          {activeTab === 1 && (
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1, borderBottom: '1px solid', borderColor: theme.palette.mode === 'light' ? '#1E293B' : '#334155' }}>
                <Typography variant="caption" sx={{ color: theme.palette.mode === 'light' ? '#38BDF8' : '#60A5FA', fontWeight: 700, fontFamily: 'monospace' }}>
                  docker logs -f smartmanager_backend
                </Typography>
                <Button size="small" variant="text" sx={{ fontWeight: 700 }} onClick={handleRefreshLogs}>
                  Refresh logs
                </Button>
              </Box>
              <Box sx={{ maxHeight: 350, overflowY: 'auto' }}>
                {containerLogs.map((log, idx) => (
                  <Typography key={idx} variant="caption" sx={{ display: 'block', fontFamily: 'monospace', fontSize: '0.8rem', color: log.includes('ERROR') ? 'error.main' : log.includes('200 OK') ? 'success.main' : 'inherit', mb: 0.5 }}>
                    {log}
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
