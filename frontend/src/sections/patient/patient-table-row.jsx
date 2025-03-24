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

import { PatientQuickEditForm } from './patient-quick-edit-form';

// ----------------------------------------------------------------------

export function PatientTableRow({ row, selected, onSelectRow, onDeleteRow, refetchPatients }) {
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
              <Avatar alt={row.user.username} src={row.user.avatarUrl} />

              <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                <Link color="inherit" onClick={quickEdit.onTrue} sx={{ cursor: 'pointer' }}>
                  {row.user.firstName} {row.user.lastName}
                </Link>
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  {row.user.email}
                </Box>
              </Stack>
            </Stack>
          </TableCell>

          <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={quickEdit.onTrue}>
            {fDate(row.birthDate)}
          </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={quickEdit.onTrue}>
                {fDuration(row.birthDate, dayjs(new Date()))}
            </TableCell>

          <TableCell sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={quickEdit.onTrue}>
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              {row.disabilities.map((disability, index) => (
                <Box component="span" sx={{ color: 'text.disabled' }} key={`disability-${index}`}>
                  {disability.name}
                </Box>
              ))}
            </Stack>
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
            <Stack spacing={2} direction="row" alignItems="center">
              <Avatar alt={row.user.username} src={row.user.avatarUrl} />

              <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                <Link color="inherit" onClick={quickEdit.onTrue} sx={{ cursor: 'pointer' }}>
                  {row.user.firstName} {row.user.lastName}
                </Link>
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  {row.user.email}
                </Box>
              </Stack>
            </Stack>
            <br />
            Birth Date: {fDate(row.birthDate)}
            <br />
              Age: {fDuration(row.birthDate, dayjs(new Date()))}
              <br/>
            Disabilities: <br />
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              {row.disabilities.map((disability, index) => (
                <Box component="span" sx={{ color: 'text.disabled' }} key={`disability-${index}`}>
                  {disability.name}
                </Box>
              ))}
            </Stack>
            <br />
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

      <PatientQuickEditForm
        currentPatient={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
        refetchPatients={refetchPatients}
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
        title="Delete Patient"
        content={
          <ListItemText
            primary={`Do you want to delete this patient (${row.user.firstName} ${row.user.lastName}) ?`}
            secondary="Once you delete this patient, you can't recover it."
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
