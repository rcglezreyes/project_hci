import { useCallback } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { iconBox } from 'src/utils/utils';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RoomNewEditForm } from '../room-new-edit-form';

// ----------------------------------------------------------------------

export function RoomCreateView() {
  const currentRoomId = localStorage.getItem('currentRoomId');

  const router = useRouter();

  const handleReturnList = useCallback(() => {
    router.push(paths.dashboard.room.list);
  }, [router]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={
          <Stack>
            <Box sx={{ display: 'flex', alignItems: 'left', flexDirection: 'row', gap: 2 }}>
              <Typography variant="h4">
                {!currentRoomId ? 'Create a new room' : 'Edit room'}
              </Typography>
              {iconBox('ic-create-room', 30, 'notification')}
            </Box>
          </Stack>
        }
        links={[
          { name: 'Dashboard', href: paths.dashboard.general.analytics },
          { name: 'Room', href: paths.dashboard.room.list },
          { name: 'New Room' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RoomNewEditForm currentRoomId={currentRoomId} onReturnList={handleReturnList} />
    </DashboardContent>
  );
}
