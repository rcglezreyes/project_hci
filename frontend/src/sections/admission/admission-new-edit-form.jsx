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
import {Form, Field, schemaHelper} from 'src/components/hook-form';

import { useDataContext } from 'src/auth/context/data/data-context';
import Typography from "@mui/material/Typography";
import {stripHtmlUsingDOM} from "../../utils/helper";

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function AdmissionNewEditForm({ currentAdmission }) {
  const router = useRouter();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const {
      loadedPatients,
      loadedMedicalStaffs,
      loadedDiagnoses,
      loadedRooms,
      loadedAdmissions,
      refetchAdmissions,
      loadedUsers,
      loadedDisabilities
  } = useDataContext();

  const NewAdmissionSchema = zod.object({
      patient: zod.object({
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
              }).optional(),
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
              zod.string().optional(),
          ),
      }).refine((data) => data.id !== '', { message: 'Patient is required!' }),
      medicalStaff: zod.object({
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
              }).optional(),
          specialty: zod.object({
              id: zod.string(),
              name: zod.string(),
              description: zod.string(),
          }).optional(),
          department: zod.object({
              id: zod.string(),
              name: zod.string(),
              description: zod.string(),
          }).optional(),
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
              zod.string().optional(),
          ),
      }).refine((data) => data.id !== '', { message: 'Medical Staff is required!' }),
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
      diagnosesNotes: zod.string().optional(),
      room:  zod.object({
          id: zod.string(),
          name: zod.string(),
          description: zod.string(),
      }).refine((data) => data.id !== '', { message: 'Room is required!' }),
      bed: zod.number()
          .int({ message: 'Bed must be an integer.' })
          .min(1, { message: 'Bed must be greater than zero.' }),
      daysInAdmission: zod.number()
          .int({ message: 'Days in admission must be an integer.' })
          .min(1, { message: 'Days in admission must be greater than zero.' }),
      isSurgical: zod.boolean().optional(),
      isUrgent: zod.boolean().optional(),
  });

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
    mode: 'onChange',
    resolver: zodResolver(NewAdmissionSchema),
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
      await axios.post(paths.backend.api.main.admission.create, {
          // patient: JSON.stringify(data.patient),
          // medicalStaff: JSON.stringify(data.medicalStaff),
          // date: data.date,
          // daysInAdmission: data.daysInAdmission,
          // room: JSON.stringify(data.room),
          // bed: data.bed,
          // diagnoses: data.diagnoses,
          // isSurgical: data.isSurgical,
          // isUrgent: data.isUrgent,
          // diagnosesNotes: stripHtmlUsingDOM(data.diagnosesNotes),
          ...data,
          userReporter: JSON.stringify(userLogged?.data),
      },
      {
          headers: { 'Content-Type': 'application/json' },
      });
      await refetchAdmissions?.();
      reset();
      toast.success(
        currentAdmission ? 'Admission Updated successfully!' : 'Admission Created successfully!'
      );
      router.push(paths.dashboard.admission.list);
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
                name="patient"
                placeholder="Patient"
                control={control}
                label="Patient"
                value={watch('patient') || null}
                options={loadedPatients || []}
                getOptionLabel={(option) => `${option.user.firstName} ${option.user.lastName}` || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValue) => {
                  setValue('patient', newValue);
                }}
                renderOption={(props, patient) => (
                  <li {...props} key={patient.id}>
                    <Avatar
                      key={patient.id}
                      alt={patient.user.avatarUrl}
                      src={patient.user.avatarUrl}
                      sx={{ mr: 1, width: 24, height: 24, flexShrink: 0 }}
                    />
                    {patient.user.firstName} {patient.user.lastName}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((patient, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={patient.id}
                      size="small"
                      variant="soft"
                      label={patient.user.firstName}
                      avatar={<Avatar alt={patient.user.firstName} src={patient.user.avatarUrl} />}
                    />
                  ))
                }
              />

                <Field.Autocomplete
                    name="medicalStaff"
                    placeholder="Medical Staff"
                    control={control}
                    label="Medical Staff"
                    value={watch('medicalStaff') || null}
                    options={loadedMedicalStaffs || []}
                    getOptionLabel={(option) => `${option.user.firstName} ${option.user.lastName}` || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(event, newValue) => {
                        setValue('medicalStaff', newValue);
                    }}
                    renderOption={(props, med) => (
                        <li {...props} key={med.id}>
                            <Avatar
                                key={med.id}
                                alt={med.user.avatarUrl}
                                src={med.user.avatarUrl}
                                sx={{ mr: 1, width: 24, height: 24, flexShrink: 0 }}
                            />
                            {med.user.firstName} {med.user.lastName}
                        </li>
                    )}
                    renderTags={(selected, getTagProps) =>
                        selected.map((med, index) => (
                            <Chip
                                {...getTagProps({ index })}
                                key={med.id}
                                size="small"
                                variant="soft"
                                label={med.user.firstName}
                                avatar={<Avatar alt={med.user.firstName} src={med.user.avatarUrl} />}
                            />
                        ))
                    }
                />

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

                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
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
                <Field.Editor
                    name="diagnosesNotes"
                    placeholder="Diagnoses notes..."
                    control={control}
                    value={watch('diagnosesNotes') || ''}
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
                {!currentAdmission ? 'Create admission' : 'Save changes'}
              </LoadingButton>
              <Button
                type="button"
                variant="outlined"
                onClick={() => router.push(paths.dashboard.admission.list)}
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
