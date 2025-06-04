import axios from 'axios';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { stripHtmlUsingDOM } from 'src/utils/helper';

import { CONFIG } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useDataContext } from 'src/auth/context/data/data-context';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function SpecialtyNewEditForm({ currentSpecialtyId, onReturnList }) {
  const { loadedSpecialties } = useDataContext();

  const currentSpecialty = useMemo(() => {
    if (currentSpecialtyId && loadedSpecialties) {
      return loadedSpecialties.find((role) => role.id === currentSpecialtyId);
    }
    return null;
  }, [currentSpecialtyId, loadedSpecialties]);

  const router = useRouter();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const [specialties, setSpecialties] = useState(null);

  useEffect(() => {
    if (loadedSpecialties && loadedSpecialties.length > 0) {
      setSpecialties(loadedSpecialties);
    }
  }, [loadedSpecialties]);

  const NewSpecialtySchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    description: schemaHelper.editor().optional().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentSpecialty?.name || '',
      description: currentSpecialty?.description || '',
    }),
    [currentSpecialty]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewSpecialtySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const id = currentSpecialty ? currentSpecialty.id : null;
    const url = id
      ? `${CONFIG.apiUrl}/main/update/specialty/${id}/`
      : `${CONFIG.apiUrl}/main/create/specialty/`;

    const payload = {
      name: data.name,
      description: stripHtmlUsingDOM(data.description),
      userReporter: JSON.stringify(userLogged?.data),
    };

    try {
      if (id) {
        await axios.put(url, payload);
      } else {
        await axios.post(url, payload);
      }
      reset();
      toast.success(id ? 'Specialty Updated successfully!' : 'Specialty Created successfully!');
      router.push(paths.dashboard.specialty.list);
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.error ? err.response.data.error : err.response.data.detail);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Field.Text name="name" label="Name" placeholder="Name" />
      <Box sx={{ width: 80, color: 'text.secondary', mr: 2, mt: 2 }}>Description</Box>
      <Field.Editor name="description" placeholder="Description..." />
      <Stack alignItems="flex-end" sx={{ mt: 3, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ mr: 2 }}>
          {!currentSpecialty ? 'Create specialty' : 'Update specialty'}
        </LoadingButton>
        <LoadingButton
          type="button"
          variant="outlined"
          onClick={onReturnList}
          disabled={isSubmitting}
        >
          Cancel
        </LoadingButton>
      </Stack>
    </Form>
  );
}
