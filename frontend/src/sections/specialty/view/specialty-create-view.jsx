import { useCallback } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { iconBox } from 'src/utils/utils';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SpecialtyNewEditForm } from '../specialty-new-edit-form';

// ----------------------------------------------------------------------

export function SpecialtyCreateView() {
  const currentSpecialtyId = localStorage.getItem('currentSpecialtyId');

  const router = useRouter();

  const handleReturnList = useCallback(() => {
    router.push(paths.dashboard.specialty.list);
  }, [router]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={
          <Stack>
            <Box sx={{ display: 'flex', alignItems: 'left', flexDirection: 'row', gap: 2 }}>
              <Typography variant="h4">
                {!currentSpecialtyId ? 'Create a new specialty' : 'Edit specialty'}
              </Typography>
              {iconBox('ic-create-specialty', 30, 'notification')}
            </Box>
          </Stack>
        }
        links={[
          { name: 'Dashboard', href: paths.dashboard.general.analytics },
          { name: 'Specialty', href: paths.dashboard.specialty.list },
          { name: 'New Specialty' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SpecialtyNewEditForm
        currentSpecialtyId={currentSpecialtyId}
        onReturnList={handleReturnList}
      />
    </DashboardContent>
  );
}
