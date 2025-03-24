import { Box, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { iconBox } from 'src/utils/utils';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PatientNewEditForm } from '../patient-new-edit-form';

// ----------------------------------------------------------------------

export function PatientCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={
          <Stack>
            <Box sx={{ display: 'flex', alignItems: 'left', flexDirection: 'row', gap: 2 }}>
              <Typography variant="h4">Create new patient</Typography>
              {iconBox('ic-create-patient', 30, 'notification')}
            </Box>
          </Stack>
        }
        links={[
          { name: 'Dashboard', href: paths.dashboard.general.analytics },
          { name: 'Patient', href: paths.dashboard.patient.list },
          { name: 'New patient' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PatientNewEditForm />
    </DashboardContent>
  );
}
