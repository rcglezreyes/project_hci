import { Box } from '@mui/material';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

export const icon = (name, folder = 'navbar') => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/${folder}/${name}.svg`} />
);

export const iconBox = (name, width, folder = 'navbar') => (
  <Box
    component="img"
    src={`${CONFIG.assetsDir}/assets/icons/${folder}/${name}.svg`}
    alt={name}
    sx={{ width, height: width }}
  />
);
