import axios from 'axios';
import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Chip, ListItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { paths } from 'src/routes/paths';

import { iconBox } from 'src/utils/utils';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useDataContext } from 'src/auth/context/data/data-context';

// ----------------------------------------------------------------------

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
  specialty: zod
    .object({
      id: zod.string(),
      name: zod.string(),
      description: zod.string(),
    })
    .refine((data) => data.id !== '', { message: 'Specialty is required!' }),
  department: zod
    .object({
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

// ----------------------------------------------------------------------

export function MedicalStaffQuickEditForm({
  currentMedicalStaff,
  open,
  onClose,
  refetchMedicalStaffs,
}) {
  const { loadedUsers, loadedSpecialties, loadedDepartments } = useDataContext();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const defaultValues = useMemo(
    () => ({
      user: currentMedicalStaff?.user || null,
      specialty: currentMedicalStaff?.specialty || null,
      department: currentMedicalStaff?.department || null,
      graduatedDate: currentMedicalStaff?.graduatedDate
        ? dayjs(currentMedicalStaff.graduatedDate)
        : '',
    }),
    [currentMedicalStaff]
  );

  const methods = useForm({
    mode: 'all',
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

  useEffect(() => {
    if (currentMedicalStaff) {
      reset(defaultValues);
    }
  }, [defaultValues, reset, currentMedicalStaff]);

  const onSubmit = handleSubmit(async (data) => {
    const { id } = currentMedicalStaff;
    data = {
      ...data,
      userReporter: JSON.stringify(userLogged?.data),
      user: JSON.stringify(data.user),
      specialty: JSON.stringify(data.specialty),
      department: JSON.stringify(data.department),
      graduatedDate: data.graduatedDate,
    };

    const promise = axios.put(paths.backend.api.main.medicalStaff.update(id), data);

    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Medical staff updated successfully!',
        error: 'Medical staff Update error!',
      });

      await promise;

      refetchMedicalStaffs?.();
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
          Quick Medical Staff Info Update {iconBox('ic-create-medical-staff', 30, 'notification')}
        </DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            MEDICAL STAFF:{' '}
            <b>
              {currentMedicalStaff?.user?.firstName} {currentMedicalStaff?.user?.lastName}
            </b>
          </Alert>

          <Box
            rowGap={3}
            columnGap={1}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
          >
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
