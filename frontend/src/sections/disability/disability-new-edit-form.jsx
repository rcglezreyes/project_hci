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

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useDataContext } from 'src/auth/context/data/data-context';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function DisabilityNewEditForm({ currentDisabilityId, onReturnList }) {
  const { loadedDisabilities } = useDataContext();

  const currentDisability = useMemo(() => {
    if (currentDisabilityId && loadedDisabilities) {
      return loadedDisabilities.find((role) => role.id === currentDisabilityId);
    }
    return null;
  }, [currentDisabilityId, loadedDisabilities]);

  const router = useRouter();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const [disabilities, setDisabilities] = useState(null);

  useEffect(() => {
    if (loadedDisabilities && loadedDisabilities.length > 0) {
      setDisabilities(loadedDisabilities);
    }
  }, [loadedDisabilities]);

  const NewDisabilitySchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    description: schemaHelper.editor().optional().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentDisability?.name || '',
      description: currentDisability?.description || '',
    }),
    [currentDisability]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewDisabilitySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const id = currentDisability ? currentDisability.id : null;
    const url = id
      ? paths.backend.api.main.disability.update(id)
      : paths.backend.api.main.disability.create;

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
      toast.success(id ? 'Disability Updated successfully!' : 'Disability Created successfully!');
      router.push(paths.dashboard.disability.list);
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
          {!currentDisability ? 'Create disability' : 'Update disability'}
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
