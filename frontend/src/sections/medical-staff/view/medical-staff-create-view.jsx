import { Box, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { iconBox } from 'src/utils/utils';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { MedicalStaffNewEditForm } from '../medical-staff-new-edit-form';

// ----------------------------------------------------------------------

export function MedicalStaffCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={
          <Stack>
            <Box sx={{ display: 'flex', alignItems: 'left', flexDirection: 'row', gap: 2 }}>
              <Typography variant="h4">Create new medical staff</Typography>
              {iconBox('ic-create-medical-staff', 30, 'notification')}
            </Box>
          </Stack>
        }
        links={[
          { name: 'Dashboard', href: paths.dashboard.general.analytics },
          { name: 'Medical Staff', href: paths.dashboard.medicalStaff.list },
          { name: 'New medical staff' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <MedicalStaffNewEditForm />
    </DashboardContent>
  );
}
