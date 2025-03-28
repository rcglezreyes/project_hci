import axios from 'axios';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { paths } from 'src/routes/paths';

import { iconBox } from 'src/utils/utils';

import { USER_STATUS_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useDataContext } from 'src/auth/context/data/data-context';

// ----------------------------------------------------------------------

export const UserQuickEditSchema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required!' }),
  lastName: zod.string().min(1, { message: 'Last name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  gender: zod.string().optional(),
  role: zod.string().min(1, { message: 'Role is required!' }),
  // Not required
  status: zod.string(),
});

// ----------------------------------------------------------------------

export function UserQuickEditForm({ currentUser, open, onClose, refetchUsers }) {
  const { loadedUserRoles } = useDataContext();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const GENDER_OPTIONS = [
    { label: 'M', value: 'M' },
    { label: 'F', value: 'F' },
  ];

  const defaultValues = useMemo(
    () => ({
      id: currentUser?.id || '',
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      status: currentUser?.isActive ? 'active' : 'inactive',
      role: currentUser?.userRole.id || '',
      gender: currentUser?.gender || '',
      address: currentUser?.address || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [defaultValues, reset, currentUser]);

  const onSubmit = handleSubmit(async (data) => {
    const { id } = currentUser;
    data = {
      ...data,
      username: currentUser.username,
      userReporter: JSON.stringify(userLogged?.data),
    };

    const promise = axios.put(paths.backend.api.users.user.update(id), data);

    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'User updated successfully!',
        error: 'User Update error!',
      });

      await promise;

      // console.info('DATA', data);

      if (data.username === userLogged?.data.username) {
        localStorage.removeItem('userLogged');
        sessionStorage.removeItem('userLogged');
        /* eslint-disable object-shorthand */
        localStorage.setItem('userLogged', JSON.stringify({ data: data }));
        sessionStorage.setItem('userLogged', JSON.stringify({ data: data }));
        /* eslint-enable object-shorthand */
      }

      refetchUsers?.();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 920 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          Quick User Info Update {iconBox('ic-create-user', 28, 'notification')}
        </DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            USERNAME: <b>{currentUser?.username}</b>
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Select name="status" label="Status">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  <Label>
                    <Box
                      component="span"
                      sx={{
                        width: 8,
                        height: 8,
                        mr: 1,
                        borderRadius: '50%',
                        bgcolor: status.color,
                      }}
                    />
                    {status.label}
                  </Label>
                </MenuItem>
              ))}
            </Field.Select>

            {/* <Box sx={{ display: { xs: 'none', sm: 'block' } }} /> */}
            <Field.Text name="email" label="Email address" />

            <Field.Text name="firstName" label="First name" />
            <Field.Text name="lastName" label="Last name" />

            <Field.Phone name="phoneNumber" label="Phone number" />
            <Field.Select name="role" label="Role">
              {loadedUserRoles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Field.Select>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 'bold', textAlign: 'left', color: 'grey' }}
              >
                Gender
              </Typography>
              <Field.RadioGroup row name="gender" options={GENDER_OPTIONS} sx={{ gap: 1 }} />
            </Box>
            <Field.Text multiline rows={2} name="address" label="Address" type="address" />
          </Box>
        </DialogContent>

        <DialogActions>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
