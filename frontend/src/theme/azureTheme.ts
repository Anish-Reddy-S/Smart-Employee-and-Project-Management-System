import { createTheme } from '@mui/material/styles';

// Enterprise Color Palette configuration
export const getAzureTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#2563EB' : '#3B82F6', // Blue
        light: mode === 'light' ? '#3B82F6' : '#60A5FA',
        dark: mode === 'light' ? '#1D4ED8' : '#2563EB', // Primary Hover is 1D4ED8 in light, 2563EB in dark
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#475569', // Slate
        light: '#64748B',
        dark: '#334155',
        contrastText: '#FFFFFF',
      },
      background: {
        default: mode === 'light' ? '#F8FAFC' : '#020617',
        paper: mode === 'light' ? '#FFFFFF' : '#111827',
      },
      text: {
        primary: mode === 'light' ? '#0F172A' : '#F8FAFC',
        secondary: mode === 'light' ? '#64748B' : '#94A3B8',
        disabled: mode === 'light' ? '#94A3B8' : '#475569',
      },
      divider: mode === 'light' ? '#E2E8F0' : '#334155',
      success: {
        main: mode === 'light' ? '#16A34A' : '#22C55E',
        contrastText: '#FFFFFF',
      },
      warning: {
        main: '#F59E0B',
        contrastText: '#FFFFFF',
      },
      error: {
        main: mode === 'light' ? '#DC2626' : '#EF4444',
        contrastText: '#FFFFFF',
      },
      info: {
        main: mode === 'light' ? '#0284C7' : '#38BDF8',
        contrastText: '#FFFFFF',
      },
      action: {
        hover: mode === 'light' ? 'rgba(37, 99, 235, 0.04)' : 'rgba(59, 130, 246, 0.05)',
        selected: mode === 'light' ? 'rgba(37, 99, 235, 0.08)' : 'rgba(59, 130, 246, 0.1)',
        focus: mode === 'light' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(59, 130, 246, 0.15)',
      },
    },
    typography: {
      fontFamily: [
        'Inter',
        '"Segoe UI"',
        '-apple-system',
        'BlinkMacSystemFont',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      fontSize: 20,
      htmlFontSize: 16,
      h1: {
        fontWeight: 400,
        fontSize: '1.3rem', // 26px
        lineHeight: 1.2,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
      },
      h2: {
        fontWeight: 400,
        fontSize: '1.2rem', // 24px
        lineHeight: 1.25,
        letterSpacing: '0.015em',
        textTransform: 'uppercase',
      },
      h3: {
        fontWeight: 400,
        fontSize: '1.1rem', // 22px
        lineHeight: 1.3,
        letterSpacing: '0.01em',
        textTransform: 'uppercase',
      },
      h4: {
        fontWeight: 400,
        fontSize: '1.1rem', // 22px
        lineHeight: 1.35,
        letterSpacing: '0.01em',
        textTransform: 'uppercase',
      },
      h5: {
        fontWeight: 400,
        fontSize: '1.1rem', // 22px
        lineHeight: 1.4,
        textTransform: 'uppercase',
      },
      h6: {
        fontWeight: 400,
        fontSize: '1rem', // 20px
        lineHeight: 1.45,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
      },
      body1: {
        fontSize: '1rem', // 20px
        lineHeight: 1.5,
        letterSpacing: '0.005em',
      },
      body2: {
        fontSize: '0.875rem', // 17.5px
        lineHeight: 1.5,
        letterSpacing: '0.005em',
      },
      subtitle1: {
        fontSize: '1rem', // 20px
        lineHeight: 1.5,
        fontWeight: 500,
      },
      subtitle2: {
        fontSize: '0.875rem', // 17.5px
        lineHeight: 1.4,
        fontWeight: 600,
      },
      caption: {
        fontSize: '0.8rem', // 16px
        lineHeight: 1.4,
        letterSpacing: '0.01em',
      },
      overline: {
        fontSize: '0.75rem', // 15px
        fontWeight: 700,
        lineHeight: 1.4,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.9rem', // 18px
        letterSpacing: '0.01em',
      },
    },
    shape: {
      borderRadius: 6, // Refined modern border radius (Linear/Jira style)
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '6px',
              height: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: mode === 'light' ? '#F1F5F9' : '#0F172A',
            },
            '&::-webkit-scrollbar-thumb': {
              background: mode === 'light' ? '#CBD5E1' : '#334155',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: mode === 'light' ? '#94A3B8' : '#475569',
            },
          },
          'h1, h2, h3, h4, h5, h6, .MuiTypography-h1, .MuiTypography-h2, .MuiTypography-h3, .MuiTypography-h4, .MuiTypography-h5, .MuiTypography-h6': {
            fontWeight: '400 !important',
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 600,
            padding: '6px 16px',
            transition: 'all 0.15s ease-in-out',
            textTransform: 'none',
            '&.Mui-focusVisible': {
              outline: `2px solid ${mode === 'light' ? '#2563EB' : '#3B82F6'}`,
              outlineOffset: '2px',
            },
          },
          contained: {
            backgroundColor: mode === 'light' ? '#2563EB' : '#3B82F6',
            color: '#FFFFFF',
            border: '1px solid transparent',
            '&:hover': {
              backgroundColor: mode === 'light' ? '#1D4ED8' : '#2563EB',
            },
          },
          outlined: {
            borderColor: mode === 'light' ? '#E2E8F0' : '#334155',
            color: mode === 'light' ? '#0F172A' : '#F8FAFC',
            backgroundColor: 'transparent',
            '&:hover': {
              borderColor: mode === 'light' ? '#CBD5E1' : '#475569',
              backgroundColor: mode === 'light' ? 'rgba(15, 23, 42, 0.04)' : 'rgba(248, 250, 252, 0.04)',
            },
          },
          text: {
            color: mode === 'light' ? '#2563EB' : '#3B82F6',
            '&:hover': {
              backgroundColor: mode === 'light' ? 'rgba(37, 99, 235, 0.04)' : 'rgba(59, 130, 246, 0.05)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            border: `1px solid ${mode === 'light' ? '#E2E8F0' : '#334155'}`,
            boxShadow: 'none',
            backgroundColor: mode === 'light' ? '#FFFFFF' : '#111827',
            backgroundImage: 'none',
            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: 'none',
          },
          outlined: {
            borderColor: mode === 'light' ? '#E2E8F0' : '#334155',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${mode === 'light' ? '#E2E8F0' : '#334155'}`,
            padding: '12px 16px',
          },
          head: {
            fontWeight: 600,
            fontSize: '0.875rem',
            backgroundColor: mode === 'light' ? '#F8FAFC' : '#0B0F19',
            color: mode === 'light' ? '#64748B' : '#94A3B8',
            padding: '10px 16px',
            borderBottom: `2px solid ${mode === 'light' ? '#E2E8F0' : '#334155'}`,
          },
          body: {
            fontSize: '0.875rem',
            color: mode === 'light' ? '#0F172A' : '#F8FAFC',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            backgroundColor: mode === 'light' ? '#FFFFFF' : '#020617',
            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#E2E8F0' : '#334155',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#CBD5E1' : '#475569',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#2563EB' : '#3B82F6',
              borderWidth: '1px',
            },
            '&.Mui-focused': {
              boxShadow: mode === 'light' ? '0 0 0 3px rgba(37, 99, 235, 0.15)' : '0 0 0 3px rgba(59, 130, 246, 0.2)',
            },
          },
          input: {
            padding: '8.5px 14px',
            fontSize: '1rem',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: '1rem',
            transform: 'translate(14px, 9px) scale(1)',
            '&.MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.75)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontSize: '0.8125rem',
            fontWeight: 600,
            borderRadius: 4, // More modern boxy/clean chips
            height: 24,
          },
          outlined: {
            borderColor: mode === 'light' ? '#E2E8F0' : '#334155',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            minHeight: 40,
            color: mode === 'light' ? '#64748B' : '#94A3B8',
            '&.Mui-selected': {
              color: mode === 'light' ? '#2563EB' : '#3B82F6',
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 40,
            borderBottom: `1px solid ${mode === 'light' ? '#E2E8F0' : '#334155'}`,
          },
          indicator: {
            height: 2,
            borderRadius: '2px 2px 0 0',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 8,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: `1px solid ${mode === 'light' ? '#E2E8F0' : '#334155'}`,
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            padding: '20px 24px',
            fontSize: '1.2rem',
            fontWeight: 700,
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            padding: '8px 24px 20px 24px',
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: '16px 24px',
            borderTop: `1px solid ${mode === 'light' ? '#E2E8F0' : '#334155'}`,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            transition: 'all 0.15s ease-in-out',
            '&.Mui-selected': {
              backgroundColor: mode === 'light' ? 'rgba(37, 99, 235, 0.08)' : 'rgba(59, 130, 246, 0.12)',
              color: mode === 'light' ? '#2563EB' : '#3B82F6',
              '&:hover': {
                backgroundColor: mode === 'light' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(59, 130, 246, 0.16)',
              },
            },
          },
        },
      },
    },
  });
