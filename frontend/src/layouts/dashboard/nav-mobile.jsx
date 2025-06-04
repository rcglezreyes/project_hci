import { useEffect } from 'react';

import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';

import { Scrollbar } from 'src/components/scrollbar';
import { NavSectionVertical } from 'src/components/nav-section';

// ----------------------------------------------------------------------

export function NavMobile({ data, open, onClose, slots, sx, ...other }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      {/* {slots?.topArea ?? (
        <Box sx={{ pt: 2.5, pb: 1, mt: 0, display: 'flex', justifyContent: 'center' }}>
          <Logo sx={{ width: '100px', height: 'auto' }}/>
        </Box>
      )} */}

      <Scrollbar fillContent>
        <NavSectionVertical data={data} sx={{ px: 2, flex: '1 1 auto' }} {...other} />
        {/* <NavUpgrade /> */}
      </Scrollbar>

      {slots?.bottomArea}
    </Drawer>
  );
}
