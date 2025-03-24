import dayjs from 'dayjs';
import { useContext } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { ListItemText } from '@mui/material';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fDuration } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { LoadingContext } from 'src/auth/context/loading-context';

import { AdmissionQuickEditForm } from './admission-quick-edit-form';

// ----------------------------------------------------------------------

export function AdmissionTableRow({ row, selected, onSelectRow, onDeleteRow, refetchAdmissions }) {
  const userLogged = JSON.parse(sessionStorage.getItem('userLogged'));

  const { isMobile } = useContext(LoadingContext);

  const confirm = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();

  const quickChangePassword = useBoolean();

  return (
    <>
      {!isMobile ? (
        <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
          <TableCell padding="checkbox">
            {userLogged?.data.id !== row.id && (
              <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
            )}
          </TableCell>

          <TableCell sx={{ cursor: 'pointer' }}>
            <Stack spacing={2} direction="row" alignItems="center">
              <Avatar alt={row.patient.user.username} src={row.patient.user.avatarUrl} />

              <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                <Link color="inherit" onClick={quickEdit.onTrue} sx={{ cursor: 'pointer' }}>
                  {row.patient.user.firstName} {row.patient.user.lastName}
                </Link>
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  {row.patient.user.email}
                </Box>
              </Stack>
            </Stack>
          </TableCell>

            <TableCell sx={{ cursor: 'pointer' }}>
                <Stack spacing={2} direction="row" alignItems="center">
                    <Avatar alt={row.medicalStaff.user.username} src={row.medicalStaff.user.avatarUrl} />

                    <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                        <Link color="inherit" onClick={quickEdit.onTrue} sx={{ cursor: 'pointer' }}>
                            {row.medicalStaff.user.firstName} {row.medicalStaff.user.lastName}
                        </Link>
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                            {row.medicalStaff.user.email}
                        </Box>
                    </Stack>
                </Stack>
            </TableCell>

          <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={quickEdit.onTrue}>
            {fDate(row.date)}
          </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={quickEdit.onTrue}>
                {row.daysInAdmission}
            </TableCell>

          <TableCell>
            <Stack direction="row" alignItems="center">
              <Tooltip title="Quick Edit" placement="top" arrow>
                <IconButton
                  color={quickEdit.value ? 'inherit' : 'default'}
                  onClick={quickEdit.onTrue}
                >
                  <Iconify icon="solar:pen-bold" />
                </IconButton>
              </Tooltip>

              <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            </Stack>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
          <TableCell padding="checkbox">
            <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
          </TableCell>

          <TableCell sx={{ cursor: 'pointer' }}>
            Patient: <Stack spacing={2} direction="row" alignItems="center">
              <Avatar alt={row.patient.user.username} src={row.patient.user.avatarUrl} />

              <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                <Link color="inherit" onClick={quickEdit.onTrue} sx={{ cursor: 'pointer' }}>
                  {row.patient.user.firstName} {row.patient.user.lastName}
                </Link>
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  {row.patient.user.email}
                </Box>
              </Stack>
            </Stack>
              Medical Staff: <Stack spacing={2} direction="row" alignItems="center">
              <Avatar alt={row.medicalStaff.user.username} src={row.medicalStaff.user.avatarUrl} />

              <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                  <Link color="inherit" onClick={quickEdit.onTrue} sx={{ cursor: 'pointer' }}>
                      {row.medicalStaff.user.firstName} {row.medicalStaff.user.lastName}
                  </Link>
                  <Box component="span" sx={{ color: 'text.disabled' }}>
                      {row.medicalStaff.user.email}
                  </Box>
              </Stack>
          </Stack>
            Date: {fDate(row.date)}
            <br />
              Days: {row.daysInAdmission}
              <br/>
            <ListItemText
              secondary={
                <IconButton
                  color={quickEdit.value ? 'inherit' : 'info'}
                  onClick={quickEdit.onTrue}
                  sx={{ fontSize: '1rem' }}
                >
                  Edit <Iconify icon="solar:pen-bold" />
                </IconButton>
              }
            />
          </TableCell>
        </TableRow>
      )}

      <AdmissionQuickEditForm
        currentAdmission={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
        refetchAdmissions={refetchAdmissions}
      />

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              quickEdit.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
          {userLogged?.data.username !== row.username && (
            <MenuItem
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          )}
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Admission"
        content={
          <ListItemText
            primary={`Do you want to delete this admission (${row.patient.user.firstName} ${row.patient.user.lastName}) ?`}
            secondary="Once you delete this admission, you can't recover it."
          />
        }
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
