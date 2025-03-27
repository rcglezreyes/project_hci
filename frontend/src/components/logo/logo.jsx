import { useId, forwardRef } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export const Logo = forwardRef(
  (
    { width, href = '/', height, isSingle = true, disableLink = false, className, sx, ...other },
    ref
  ) => {
    const theme = useTheme();

    const gradientId = useId();

    const TEXT_PRIMARY = theme.vars.palette.text.primary;
    const PRIMARY_LIGHT = theme.vars.palette.primary.light;
    const PRIMARY_MAIN = theme.vars.palette.primary.main;
    const PRIMARY_DARKER = theme.vars.palette.primary.dark;

    const fullLogo = (
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
        <polygon points="250,50 230,50 250,70" fill="#eee" />
        <rect x="135" y="105" width="30" height="90" fill="#d32f2f" />
        <rect x="105" y="135" width="90" height="30" fill="#d32f2f" />
        <path d="M50,100 C20,150,20,200,150,250" fill="none" stroke="#2e7d32" strokeWidth="4" />
        <path d="M250,100 C280,150,280,200,150,250" fill="none" stroke="#2e7d32" strokeWidth="4" />
        <circle cx="150" cy="250" r="15" fill="#2e7d32" />
        <path d="M150,265 C150,280,150,290,150,310" fill="none" stroke="#2e7d32" strokeWidth="4" />
      </svg>
    );

    const singleLogo = (
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
        <polygon points="250,50 230,50 250,70" fill="#eee" />
        <rect x="135" y="105" width="30" height="90" fill="#d32f2f" />
        <rect x="105" y="135" width="90" height="30" fill="#d32f2f" />
        <path d="M50,100 C20,150,20,200,150,250" fill="none" stroke="#2e7d32" strokeWidth="4" />
        <path d="M250,100 C280,150,280,200,150,250" fill="none" stroke="#2e7d32" strokeWidth="4" />
        <circle cx="150" cy="250" r="15" fill="#2e7d32" />
        <path d="M150,265 C150,280,150,290,150,310" fill="none" stroke="#2e7d32" strokeWidth="4" />
      </svg>
    );

    const baseSize = {
      width: width ?? 150,
      height: height ?? 60,
      ...(!isSingle && {
        width: width ?? 102,
        height: height ?? 36,
      }),
    };

    return (
      <Box
        ref={ref}
        component={RouterLink}
        href={href}
        className={logoClasses.root.concat(className ? ` ${className}` : '')}
        aria-label="Logo"
        sx={{
          ...baseSize,
          flexShrink: 0,
          display: 'inline-flex',
          verticalAlign: 'middle',
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        {isSingle ? singleLogo : fullLogo}
        {/* {fullLogo} */}
        {/* {localStorage.getItem('userLogged') !== null && ( */}
        {/* <img src="/files/color_white_back" alt="logo" style={{ width: '50%', height: '70%'}}/> */}
        {/* )} */}
      </Box>
    );
  }
);
