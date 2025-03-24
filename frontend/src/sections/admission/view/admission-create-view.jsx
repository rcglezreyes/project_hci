import { Box, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { iconBox } from 'src/utils/utils';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AdmissionNewEditForm } from '../admission-new-edit-form';

// ----------------------------------------------------------------------

export function AdmissionCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={
          <Stack>
            <Box sx={{ display: 'flex', alignItems: 'left', flexDirection: 'row', gap: 2 }}>
              <Typography variant="h4">Create new admission</Typography>
              {iconBox('ic-create-admission', 30, 'notification')}
            </Box>
          </Stack>
        }
        links={[
          { name: 'Dashboard', href: paths.dashboard.general.analytics },
          { name: 'Admission', href: paths.dashboard.admission.list },
          { name: 'New admission' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AdmissionNewEditForm />
    </DashboardContent>
  );
}
