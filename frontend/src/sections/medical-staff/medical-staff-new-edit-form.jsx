import axios from 'axios';
import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers';
import LoadingButton from '@mui/lab/LoadingButton';
import { Chip, Avatar, Button, ListItem } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useDataContext } from 'src/auth/context/data/data-context';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function MedicalStaffNewEditForm({ currentMedicalStaff }) {
  const router = useRouter();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const {
      loadedMedicalStaffs,
      refetchMedicalStaffs,
      loadedUsers,
      loadedSpecialties,
      loadedDepartments,
  } = useDataContext();

  const filteredUsers = useMemo(() => {
    if (loadedUsers) {
      return loadedUsers.filter(
        (user) =>
          user.isActive &&
          user.userRole?.name.toLowerCase().indexOf(CONFIG.roles.medicalStaff.toLowerCase()) > -1 &&
          !loadedMedicalStaffs.some((m) => m.user.id === user.id)
      );
    }
    return [];
  }, [loadedUsers, loadedMedicalStaffs]);

  const NewSchema = zod.object({
    user: zod
      .object({
        id: zod.string(),
        firstName: zod.string(),
        lastName: zod.string(),
        avatarUrl: zod.string(),
        username: zod.string(),
        email: zod.string(),
        isActive: zod.boolean(),
        user_role: zod
          .object({
            id: zod.string(),
            name: zod.string(),
            description: zod.string(),
          })
          .optional(),
      })
      .refine((data) => data.id !== '', { message: 'User is required!' }),
    specialty: zod.object({
          id: zod.string(),
          name: zod.string(),
          description: zod.string(),
        })
        .refine((data) => data.id !== '', { message: 'Specialty is required!' }),
    department: zod.object({
          id: zod.string(),
          name: zod.string(),
          description: zod.string(),
      })
          .refine((data) => data.id !== '', { message: 'Department is required!' }),
    graduatedDate: zod.preprocess(
      (arg) => {
        if (arg === null || arg === undefined) return '';
        if (dayjs.isDayjs(arg)) {
          return arg.format('YYYY-MM-DD');
        }
        if (typeof arg === 'string') {
          return arg.trim();
        }
        return '';
      },
      zod.string().min(1, { message: 'Graduated Date is required!' })
    ),
  });

  const defaultValues = useMemo(
    () => ({
      user: currentMedicalStaff?.user || null,
      specialty: currentMedicalStaff?.specialty || null,
      department: currentMedicalStaff?.department || null,
      graduatedDate: currentMedicalStaff?.graduatedDate ? dayjs(currentMedicalStaff.graduatedDate) : '',
    }),
    [currentMedicalStaff]
  );

  const methods = useForm({
    mode: 'onChange',
    resolver: zodResolver(NewSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const randomNumber = Math.floor(Math.random() * 25) + 1;
      await axios.post(paths.backend.api.main.medicalStaff.create, {
        ...data,
        userReporter: JSON.stringify(userLogged?.data),
      });
      await refetchMedicalStaffs?.();
      reset();
      toast.success(
        currentMedicalStaff ? 'Medical Staff Updated successfully!' : 'Medical Staff Created successfully!'
      );
      router.push(paths.dashboard.medicalStaff.list);
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
              <Field.Autocomplete
                name="user"
                placeholder="user"
                control={control}
                label="Medical Staff"
                value={watch('user') || null}
                options={filteredUsers || []}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}` || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValue) => {
                  setValue('user', newValue);
                }}
                renderOption={(props, user) => (
                  <li {...props} key={user.id}>
                    <Avatar
                      key={user.id}
                      alt={user.avatarUrl}
                      src={user.avatarUrl}
                      sx={{ mr: 1, width: 24, height: 24, flexShrink: 0 }}
                    />
                    {user.firstName} {user.lastName}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((user, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={user.id}
                      size="small"
                      variant="soft"
                      label={user.name}
                      avatar={<Avatar alt={user.name} src={user.avatarUrl} />}
                    />
                  ))
                }
              />

              <Controller
                name="graduatedDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Graduated Date"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    error={!!error}
                    helperText={error?.message}
                    maxDate={dayjs(new Date()).subtract(24, 'year')}
                    inputFormat="yyyy-MM-dd"
                    sx={{ width: '100%' }}
                  />
                )}
              />
                <Field.Autocomplete
                    name="specialty"
                    placeholder="Specialty"
                    value={watch('specialty') || null}
                    control={control}
                    options={loadedSpecialties || []}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderOption={(props, item) => (
                        <ListItem {...props} key={item.id}>
                            {item.name}
                        </ListItem>
                    )}
                    renderTags={(selected, getTagProps) =>
                        selected.map((item, index) => (
                            <Chip
                                {...getTagProps({ index })}
                                key={item.id}
                                size="small"
                                variant="soft"
                                label={item.name}
                            />
                        ))
                    }
                />
                <Field.Autocomplete
                    name="department"
                    placeholder="Department"
                    value={watch('department') || null}
                    control={control}
                    options={loadedDepartments || []}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderOption={(props, item) => (
                        <ListItem {...props} key={item.id}>
                            {item.name}
                        </ListItem>
                    )}
                    renderTags={(selected, getTagProps) =>
                        selected.map((item, index) => (
                            <Chip
                                {...getTagProps({ index })}
                                key={item.id}
                                size="small"
                                variant="soft"
                                label={item.name}
                            />
                        ))
                    }
                />
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
                {!currentMedicalStaff ? 'Create medicalStaff' : 'Save changes'}
              </LoadingButton>
              <Button
                type="button"
                variant="outlined"
                onClick={() => router.push(paths.dashboard.medicalStaff.list)}
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
