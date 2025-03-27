import axios from 'axios';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useContext } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, MenuItem, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { _mock } from 'src/_mock/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { LoadingContext } from 'src/auth/context/loading-context';
import { useDataContext } from 'src/auth/context/data/data-context';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function UserNewEditForm({ currentUser }) {
  const router = useRouter();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const { isMobile } = useContext(LoadingContext);

  const GENDER_OPTIONS = [
    { label: 'M', value: 'M' },
    { label: 'F', value: 'F' },
  ];

  const { loadedUsers, refetchUsers, loadedUserRoles, refetchUserRoles } = useDataContext();

  const [users, setUsers] = useState([]);

  const [listUserRoles, setListUserRoles] = useState([]);

  useEffect(() => {
    if (loadedUsers && loadedUsers.length > 0) {
      setUsers(loadedUsers);
    }
  }, [loadedUsers]);

  useEffect(() => {
    if (loadedUserRoles && loadedUserRoles.length > 0) {
      setListUserRoles(loadedUserRoles);
    }
  }, [loadedUserRoles]);

  useEffect(() => {
    if (refetchUsers) {
      refetchUsers();
    }
  }, [refetchUsers]);

  useEffect(() => {
    if (refetchUserRoles) {
      refetchUserRoles();
    }
  }, [refetchUserRoles]);

  const NewUserSchema = zod
    .object({
      username: zod.string().min(1, { message: 'Username is required!' }),
      firstName: zod.string().min(1, { message: 'First name is required!' }),
      lastName: zod.string().min(1, { message: 'Last name is required!' }),
      email: zod
        .string()
        .min(1, { message: 'Email is required!' })
        .email({ message: 'Email must be a valid email address!' }),
      phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
      role: zod.string().min(1, { message: 'Role is required!' }),
      password: currentUser
        ? zod.string()
        : zod.string().min(1, { message: 'Password is required!' }),
      confirmPassword: currentUser
        ? zod.string()
        : zod.string().min(1, { message: 'Confirm Password is required!' }),
      gender: zod.string().optional(),
      address: zod.string().min(1, { message: 'Address is required!' }),
    })
    .refine(
      (data) => {
        if (!currentUser) {
          return data.password === data.confirmPassword;
        }
        return true;
      },
      {
        message: 'Passwords must match',
        path: ['confirmPassword'],
      }
    )
    .refine(
      (data) => {
        if (!currentUser) {
          const usernameExists = users?.some(
            (user) => user.username.toLowerCase() === data.username.toLowerCase()
          );
          return !usernameExists;
        }
        return true;
      },
      {
        message: 'Username already exists',
        path: ['username'],
      }
    );

  const defaultValues = useMemo(
    () => ({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      role: currentUser?.userRole || '',
      isActive: currentUser?.isActive || true,
      gender: currentUser?.gender || 'M',
      address: currentUser?.address || '',
      password: '',
      confirmPassword: '',
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const randomNumber = Math.floor(Math.random() * 25) + 1;
      await axios.post(paths.backend.api.users.user.create, {
        ...data,
        userReporter: JSON.stringify(userLogged?.data),
        avatarUrl: _mock.image.avatar(randomNumber),
      });
      await refetchUsers?.();
      reset();
      toast.success(currentUser ? 'User Updated successfully!' : 'User Created successfully!');
      router.push(paths.dashboard.user.list);
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: !isMobile ? 'row' : 'column',
                  gap: 2,
                }}
              >
                <Box sx={{ width: !isMobile ? '70%' : '100%' }}>
                  <Field.Text name="username" label="Username" />
                </Box>
                <Box
                  sx={{
                    width: !isMobile ? '30%' : '60%',
                    display: 'flex',
                    flexDirection: !isMobile ? 'column' : 'row',
                    gap: 0,
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 'bold', textAlign: 'left', color: 'grey' }}
                  >
                    Gender
                  </Typography>
                  <Field.RadioGroup
                    row
                    name="gender"
                    options={GENDER_OPTIONS}
                    sx={{ gap: !isMobile ? 1 : 0, mt: !isMobile ? 0 : -1 }}
                  />
                </Box>
              </Box>
              <Field.Text name="email" label="Email address" />
              <Field.Text name="firstName" label="First name" />
              <Field.Text name="lastName" label="Last name" />
              <Field.Phone name="phoneNumber" label="Phone number" />
              <Field.Select name="role" label="Role">
                {listUserRoles?.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Field.Select>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  gap: 2,
                  width: '100%',
                }}
              >
                <Field.Text multiline rows={2} name="address" label="Address" type="address" />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  gap: 2,
                  width: '100%',
                }}
              >
                <Field.Text name="password" label="Password" type="password" />
                <Field.Text name="confirmPassword" label="Confirm Password" type="password" />
              </Box>
            </Box>

            <Stack
              alignItems="flex-end"
              sx={{
                mt: 3,
                flexDirection: 'row',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
              }}
            >
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Create user' : 'Save changes'}
              </LoadingButton>
              <Button
                type="button"
                variant="outlined"
                onClick={() => router.push(paths.dashboard.user.list)}
              >
                Cancel
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
