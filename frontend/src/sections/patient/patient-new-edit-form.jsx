import axios from 'axios';
import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useMemo, useEffect } from 'react';
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

export function PatientNewEditForm({ currentPatient }) {
  const router = useRouter();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const { loadedPatients, refetchPatients, loadedUsers, loadedDisabilities } = useDataContext();

  const filteredUsers = useMemo(() => {
    if (loadedUsers) {
      return loadedUsers.filter(
        (user) =>
          user.isActive &&
          user.userRole?.name.toLowerCase().indexOf(CONFIG.roles.patient.toLowerCase()) > -1 &&
          !loadedPatients.some((patient) => patient.user.id === user.id)
      );
    }
    return [];
  }, [loadedUsers, loadedPatients]);

  const NewPatientSchema = zod.object({
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
    disabilities: zod
      .array(
        zod.object({
          id: zod.string(),
          name: zod.string(),
          description: zod.string(),
        })
      )
      .optional(),
    birthDate: zod.preprocess(
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
      zod.string().min(1, { message: 'Birth Date is required!' })
    ),
  });

  const defaultValues = useMemo(
    () => ({
      user: currentPatient?.user || null,
      disabilities: currentPatient?.disabilities || [],
      birthDate: currentPatient?.birthDate ? dayjs(currentPatient.birthDate) : '',
    }),
    [currentPatient]
  );

  const methods = useForm({
    mode: 'onChange',
    resolver: zodResolver(NewPatientSchema),
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

  const disabilitiesValue = useMemo(() => watch('disabilities') || [], [watch]);

  const isNoneSelected = useMemo(
    () => disabilitiesValue.some((item) => item.name.toLowerCase().includes('none')),
    [disabilitiesValue]
  );

  useEffect(() => {
    if (isNoneSelected && disabilitiesValue.length > 1) {
      const noneItem = disabilitiesValue.find((item) => item.name.toLowerCase().includes('none'));
      setValue('disabilities', [noneItem]);
    }
  }, [disabilitiesValue, isNoneSelected, setValue]);

  const handleDisabilitiesChange = (event, newValue) => {
    if (newValue.some((item) => item.name.toLowerCase().includes('none'))) {
      const noneItem = newValue.find((item) => item.name.toLowerCase().includes('none'));
      setValue('disabilities', [noneItem]);
    } else {
      setValue('disabilities', newValue);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const randomNumber = Math.floor(Math.random() * 25) + 1;
      await axios.post(paths.backend.api.main.patient.create, {
        ...data,
        userReporter: JSON.stringify(userLogged?.data),
      });
      await refetchPatients?.();
      reset();
      toast.success(
        currentPatient ? 'Patient Updated successfully!' : 'Patient Created successfully!'
      );
      router.push(paths.dashboard.patient.list);
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
                label="Patient"
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
                name="birthDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Birth Date"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    error={!!error}
                    helperText={error?.message}
                    maxDate={dayjs(new Date())}
                    inputFormat="yyyy-MM-dd"
                    sx={{ width: '100%' }}
                  />
                )}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Field.Autocomplete
                multiple={!isNoneSelected}
                onChange={(event, newValue) => {
                  handleDisabilitiesChange(event, newValue);
                }}
                name="disabilities"
                placeholder="+ Disabilities"
                value={watch('disabilities') || []}
                control={control}
                disableCloseOnSelect
                options={loadedDisabilities || []}
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
                {!currentPatient ? 'Create patient' : 'Save changes'}
              </LoadingButton>
              <Button
                type="button"
                variant="outlined"
                onClick={() => router.push(paths.dashboard.patient.list)}
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
