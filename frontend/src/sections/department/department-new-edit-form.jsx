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

export function DepartmentNewEditForm({ currentDepartmentId, onReturnList }) {
  const { loadedDepartments } = useDataContext();

  const currentDepartment = useMemo(() => {
    if (currentDepartmentId && loadedDepartments) {
      return loadedDepartments.find((role) => role.id === currentDepartmentId);
    }
    return null;
  }, [currentDepartmentId, loadedDepartments]);

  const router = useRouter();

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const [departments, setDepartments] = useState(null);

  useEffect(() => {
    if (loadedDepartments && loadedDepartments.length > 0) {
      setDepartments(loadedDepartments);
    }
  }, [loadedDepartments]);

  const NewDepartmentSchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    description: schemaHelper.editor().optional().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentDepartment?.name || '',
      description: currentDepartment?.description || '',
    }),
    [currentDepartment]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewDepartmentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const id = currentDepartment ? currentDepartment.id : null;
    const url = id
      ? `${CONFIG.apiUrl}/main/update/department/${id}/`
      : `${CONFIG.apiUrl}/main/create/department/`;

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
      toast.success(id ? 'Department Updated successfully!' : 'Department Created successfully!');
      router.push(paths.dashboard.department.list);
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
          {!currentDepartment ? 'Create department' : 'Update department'}
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
