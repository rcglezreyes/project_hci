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

export const PatientQuickEditSchema = zod.object({
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

// ----------------------------------------------------------------------

export function PatientQuickEditForm({ currentPatient, open, onClose, refetchPatients }) {
  const { loadedUsers, loadedDisabilities } = useDataContext();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const defaultValues = useMemo(
    () => ({
      user: currentPatient?.user || null,
      disabilities: currentPatient?.disabilities || [],
      birthDate: currentPatient?.birthDate ? dayjs(currentPatient.birthDate) : '',
    }),
    [currentPatient]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(PatientQuickEditSchema),
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
    if (currentPatient) {
      reset(defaultValues);
    }
  }, [defaultValues, reset, currentPatient]);

  const disabilitiesValue = useMemo(() => watch('disabilities') || [], [watch]);

  const isNoneSelected = useMemo(
    () => disabilitiesValue.some((item) => item?.name?.toLowerCase().includes('none')),
    [disabilitiesValue]
  );

  useEffect(() => {
    if (isNoneSelected && disabilitiesValue.length > 1) {
      const noneItem = disabilitiesValue.find((item) => item?.name?.toLowerCase().includes('none'));
      setValue('disabilities', [noneItem]);
    }
  }, [disabilitiesValue, isNoneSelected, setValue]);

  const handleDisabilitiesChange = (event, newValue) => {
    if (newValue.some((item) => item?.name?.toLowerCase().includes('none'))) {
      const noneItem = newValue.find((item) => item?.name?.toLowerCase().includes('none'));
      setValue('disabilities', [noneItem]);
    } else {
      setValue('disabilities', newValue);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const { id } = currentPatient;
    data = {
      ...data,
      userReporter: JSON.stringify(userLogged?.data),
      user: JSON.stringify(data.user),
      disabilities: JSON.stringify(data.disabilities),
    };

    const promise = axios.put(paths.backend.api.main.patient.update(id), data);

    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Patient updated successfully!',
        error: 'Patient Update error!',
      });

      await promise;

      refetchPatients?.();
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
          Quick Patient Info Update {iconBox('ic-create-patient', 30, 'notification')}
        </DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            PATIENT:{' '}
            <b>
              {currentPatient?.user?.firstName} {currentPatient?.user?.lastName}
            </b>
          </Alert>

          <Box
            rowGap={3}
            columnGap={1}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
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
