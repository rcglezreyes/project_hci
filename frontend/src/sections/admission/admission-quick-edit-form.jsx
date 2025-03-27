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
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { paths } from 'src/routes/paths';

import { iconBox } from 'src/utils/utils';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useDataContext } from 'src/auth/context/data/data-context';

// ----------------------------------------------------------------------

export const AdmissionQuickEditSchema = zod.object({
  patient: zod
    .object({
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
        .optional(),
      disabilities: zod
        .array(
          zod.object({
            id: zod.string(),
            name: zod.string(),
            description: zod.string(),
          })
        )
        .optional(),
      birthDate: zod.preprocess((arg) => {
        if (arg === null || arg === undefined) return '';
        if (dayjs.isDayjs(arg)) {
          return arg.format('YYYY-MM-DD');
        }
        if (typeof arg === 'string') {
          return arg.trim();
        }
        return '';
      }, zod.string().optional()),
    })
    .refine((data) => data.id !== '', { message: 'Patient is required!' }),
  medicalStaff: zod
    .object({
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
        .optional(),
      specialty: zod
        .object({
          id: zod.string(),
          name: zod.string(),
          description: zod.string(),
        })
        .optional(),
      department: zod
        .object({
          id: zod.string(),
          name: zod.string(),
          description: zod.string(),
        })
        .optional(),
      graduatedDate: zod.preprocess((arg) => {
        if (arg === null || arg === undefined) return '';
        if (dayjs.isDayjs(arg)) {
          return arg.format('YYYY-MM-DD');
        }
        if (typeof arg === 'string') {
          return arg.trim();
        }
        return '';
      }, zod.string().optional()),
    })
    .refine((data) => data.id !== '', { message: 'Medical Staff is required!' }),
  date: zod.preprocess(
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
    zod.string().min(1, { message: 'Date is required!' })
  ),
  diagnoses: zod
    .array(
      zod.object({
        id: zod.string(),
        name: zod.string(),
        description: zod.string(),
      })
    )
    .refine((data) => data.length > 0, { message: 'Diagnoses are required!' }),
  diagnosesNotes: schemaHelper.editor().optional().nullable(),
  room: zod
    .object({
      id: zod.string(),
      name: zod.string(),
      description: zod.string(),
    })
    .refine((data) => data.id !== '', { message: 'Room is required!' }),
  bed: zod
    .number()
    .int({ message: 'Bed must be an integer.' })
    .min(1, { message: 'Bed must be greater than zero.' }),
  daysInAdmission: zod
    .number()
    .int({ message: 'Days in admission must be an integer.' })
    .min(1, { message: 'Days in admission must be greater than zero.' }),
  isSurgical: zod.boolean().optional(),
  isUrgent: zod.boolean().optional(),
});

// ----------------------------------------------------------------------

export function AdmissionQuickEditForm({ currentAdmission, open, onClose, refetchAdmissions }) {
  const {
    loadedPatients,
    loadedMedicalStaffs,
    loadedDiagnoses,
    loadedRooms,
    loadedAdmissions,
    loadedUsers,
    loadedDisabilities,
  } = useDataContext();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const defaultValues = useMemo(
    () => ({
      patient: currentAdmission?.patient || null,
      medicalStaff: currentAdmission?.medicalStaff || null,
      diagnoses: currentAdmission?.diagnoses || [],
      date: currentAdmission?.date ? dayjs(currentAdmission.date) : '',
      diagnosesNotes: currentAdmission?.diagnosesNotes || '',
      bed: currentAdmission?.bed || null,
      daysInAdmission: currentAdmission?.daysInAdmission || null,
      room: currentAdmission?.room || null,
      isSurgical: currentAdmission?.isSurgical || false,
      isUrgent: currentAdmission?.isUrgent || false,
    }),
    [currentAdmission]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(AdmissionQuickEditSchema),
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
    if (currentAdmission) {
      reset(defaultValues);
    }
  }, [defaultValues, reset, currentAdmission]);

  const onSubmit = handleSubmit(async (data) => {
    const { id } = currentAdmission;
    data = {
      ...data,
      patient: JSON.stringify(data.patient),
      medicalStaff: JSON.stringify(data.medicalStaff),
      date: data.date,
      daysInAdmission: data.daysInAdmission,
      room: JSON.stringify(data.room),
      bed: data.bed,
      diagnoses: data.diagnoses,
      isSurgical: data.isSurgical,
      isUrgent: data.isUrgent,
      diagnosesNotes: data.diagnosesNotes,
      userReporter: JSON.stringify(userLogged?.data),
    };

    const promise = axios.put(paths.backend.api.main.admission.update(id), data);

    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Admission updated successfully!',
        error: 'Admission Update error!',
      });

      await promise;

      refetchAdmissions?.();
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
          Quick Admission Info Update {iconBox('ic-create-admission', 30, 'notification')}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              mb: 3,
              width: '100%',
              gap: 1,
            }}
          >
            <Alert variant="outlined" severity="info">
              PATIENT:{' '}
              <b>
                {currentAdmission?.patient?.user?.firstName}{' '}
                {currentAdmission?.patient?.user?.lastName}
              </b>
            </Alert>
            <Alert variant="outlined" severity="info">
              MEDICAL STAFF:{' '}
              <b>
                {currentAdmission?.medicalStaff?.user?.firstName}{' '}
                {currentAdmission?.medicalStaff?.user?.lastName}
              </b>
            </Alert>
          </Box>

          <Box
            rowGap={3}
            columnGap={1}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Controller
              name="date"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Date"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  error={!!error}
                  helperText={error?.message}
                  minDate={dayjs(new Date())}
                  inputFormat="yyyy-MM-dd"
                  sx={{ width: '100%' }}
                />
              )}
            />

            <Field.Text
              name="daysInAdmission"
              label="Days in admission"
              placeholder="Days in admission"
              type="number"
              control={control}
              value={watch('daysInAdmission') || ''}
            />

            <Field.Autocomplete
              onChange={(event, newValue) => {
                setValue('room', newValue);
              }}
              name="room"
              placeholder="Room"
              value={watch('room') || null}
              control={control}
              options={loadedRooms || []}
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

            <Field.Text
              name="bed"
              label="Bed"
              placeholder="Bed"
              type="number"
              control={control}
              value={watch('bed') || ''}
            />

            <Field.Autocomplete
              multiple
              onChange={(event, newValue) => {
                setValue('diagnoses', newValue);
              }}
              name="diagnoses"
              placeholder="+ Diagnosis"
              value={watch('diagnoses') || []}
              control={control}
              disableCloseOnSelect
              options={loadedDiagnoses || []}
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

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Controller
                name="isSurgical"
                control={control}
                defaultValue={false}
                render={({ field: { onChange } }) => (
                  <Field.Switch
                    name="isSurgical"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{ mb: 0.5, color: 'warning.main' }}>
                        Is Surgical?
                      </Typography>
                    }
                    sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <Controller
                name="isUrgent"
                control={control}
                defaultValue={false}
                render={({ field: { onChange } }) => (
                  <Field.Switch
                    name="isUrgent"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{ mb: 0.5, color: 'warning.main' }}>
                        Is Urgent?
                      </Typography>
                    }
                    sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
            </Box>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Field.Text
              multiline
              rows={3}
              name="diagnosesNotes"
              placeholder="Diagnoses notes..."
              control={control}
              value={watch('diagnosesNotes') || ''}
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
