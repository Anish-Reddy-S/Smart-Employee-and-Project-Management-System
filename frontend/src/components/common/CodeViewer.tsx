import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Chip,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ContentCopy as CopyIcon, Check as CheckIcon, Download as DownloadIcon, Code as CodeIcon } from '@mui/icons-material';
import { CodeFile } from '../../types';

interface CodeViewerProps {
  files: CodeFile[];
  title?: string;
  subtitle?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ files, title, subtitle }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!files || files.length === 0) return null;

  const currentFile = files[activeTab] || files[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([currentFile.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = currentFile.filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 1.5, borderColor: 'divider', overflow: 'hidden' }}>
      {/* Header bar */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === 'light' ? '#0F172A' : '#0B0F19',
          color: '#CCCCCC',
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: theme.palette.mode === 'light' ? '#1E293B' : '#1E293B',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CodeIcon sx={{ color: 'primary.main', fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ color: '#FFFFFF', fontWeight: 700, fontFamily: 'monospace' }}>
            {title || 'SOURCE CODE'}
          </Typography>
          {subtitle && (
            <Chip
              label={subtitle}
              size="small"
              sx={{
                bgcolor: 'primary.main',
                color: '#FFFFFF',
                fontWeight: 700,
                height: 18,
                fontSize: '0.62rem',
                border: 'none',
              }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Copy Code">
            <IconButton size="small" onClick={handleCopy} sx={{ color: '#CCCCCC', '&:hover': { color: '#FFF' } }}>
              {copied ? <CheckIcon fontSize="small" sx={{ color: 'success.main' }} /> : <CopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Download File">
            <IconButton size="small" onClick={handleDownload} sx={{ color: '#CCCCCC', '&:hover': { color: '#FFF' } }}>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ bgcolor: theme.palette.mode === 'light' ? '#1E293B' : '#111827', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 36,
            '& .MuiTab-root': {
              minHeight: 36,
              color: '#94A3B8',
              textTransform: 'none',
              fontSize: '0.72rem',
              fontFamily: 'monospace',
              fontWeight: 600,
              px: 2,
              '&.Mui-selected': {
                color: '#FFFFFF',
                bgcolor: theme.palette.mode === 'light' ? '#0F172A' : '#0B0F19',
                borderTop: '2px solid',
                borderTopColor: 'primary.main',
              },
            },
            '& .MuiTabs-indicator': { display: 'none' },
          }}
        >
          {files.map((file, idx) => (
            <Tab key={idx} label={file.filename} />
          ))}
        </Tabs>
      </Box>

      {/* Package path & Description */}
      <Box sx={{ bgcolor: theme.palette.mode === 'light' ? '#1E293B' : '#111827', color: '#94A3B8', px: 2, py: 0.75, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.light', fontWeight: 600 }}>
          {currentFile.path}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
          • {currentFile.description}
        </Typography>
      </Box>

      {/* Code Editor Body */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === 'light' ? '#0F172A' : '#0B0F19',
          color: '#E2E8F0',
          p: 2.5,
          maxHeight: 500,
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          lineHeight: 1.55,
          whiteSpace: 'pre',
          tabSize: 4,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <code>{currentFile.content}</code>
      </Box>

      {/* Footer bar */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: '#FFFFFF',
          px: 2,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="caption" sx={{ fontSize: '0.68rem', fontWeight: 600 }}>
          Language: {currentFile.language.toUpperCase()} | Stack: Java 17 / Spring Boot 3.2
        </Typography>
        <Typography variant="caption" sx={{ fontSize: '0.68rem', fontWeight: 600 }}>
          UTF-8
        </Typography>
      </Box>
    </Card>
  );
};
