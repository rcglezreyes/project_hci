import { useCallback } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { iconBox } from 'src/utils/utils';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DepartmentNewEditForm } from '../department-new-edit-form';

// ----------------------------------------------------------------------

export function DepartmentCreateView() {
  const currentDepartmentId = localStorage.getItem('currentDepartmentId');

  const router = useRouter();

  const handleReturnList = useCallback(() => {
    router.push(paths.dashboard.department.list);
  }, [router]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={
          <Stack>
            <Box sx={{ display: 'flex', alignItems: 'left', flexDirection: 'row', gap: 2 }}>
              <Typography variant="h4">
                {!currentDepartmentId ? 'Create a new department' : 'Edit department'}
              </Typography>
              {iconBox('ic-create-department', 28, 'notification')}
            </Box>
          </Stack>
        }
        links={[
          { name: 'Dashboard', href: paths.dashboard.general.analytics },
          { name: 'Department', href: paths.dashboard.department.list },
          { name: 'New Department' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DepartmentNewEditForm
        currentDepartmentId={currentDepartmentId}
        onReturnList={handleReturnList}
      />
    </DashboardContent>
  );
}
