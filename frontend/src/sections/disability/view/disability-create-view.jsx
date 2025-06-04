import { useCallback } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { iconBox } from 'src/utils/utils';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DisabilityNewEditForm } from '../disability-new-edit-form';

// ----------------------------------------------------------------------

export function DisabilityCreateView() {
  const currentDisabilityId = localStorage.getItem('currentDisabilityId');

  const router = useRouter();

  const handleReturnList = useCallback(() => {
    router.push(paths.dashboard.disability.list);
  }, [router]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={
          <Stack>
            <Box sx={{ display: 'flex', alignItems: 'left', flexDirection: 'row', gap: 2 }}>
              <Typography variant="h4">
                {!currentDisabilityId ? 'Create a new disability' : 'Edit disability'}
              </Typography>
              {iconBox('ic-create-disability', 30, 'notification')}
            </Box>
          </Stack>
        }
        links={[
          { name: 'Dashboard', href: paths.dashboard.general.analytics },
          { name: 'Disability', href: paths.dashboard.disability.list },
          { name: 'New Disability' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DisabilityNewEditForm
        currentDisabilityId={currentDisabilityId}
        onReturnList={handleReturnList}
      />
    </DashboardContent>
  );
}
