import { useCallback } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { iconBox } from 'src/utils/utils';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DiagnosisNewEditForm } from '../diagnosis-new-edit-form';

// ----------------------------------------------------------------------

export function DiagnosisCreateView() {
  const currentDiagnosisId = localStorage.getItem('currentDiagnosisId');

  const router = useRouter();

  const handleReturnList = useCallback(() => {
    router.push(paths.dashboard.diagnosis.list);
  }, [router]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={
          <Stack>
            <Box sx={{ display: 'flex', alignItems: 'left', flexDirection: 'row', gap: 2 }}>
              <Typography variant="h4">
                {!currentDiagnosisId ? 'Create a new diagnosis' : 'Edit diagnosis'}
              </Typography>
              {iconBox('ic-create-diagnosis', 30, 'notification')}
            </Box>
          </Stack>
        }
        links={[
          { name: 'Dashboard', href: paths.dashboard.general.analytics },
          { name: 'Diagnosis', href: paths.dashboard.diagnosis.list },
          { name: 'New Diagnosis' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DiagnosisNewEditForm
        currentDiagnosisId={currentDiagnosisId}
        onReturnList={handleReturnList}
      />
    </DashboardContent>
  );
}
