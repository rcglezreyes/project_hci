import { z as zod } from 'zod';
import { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import { TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { LoadingContext } from 'src/auth/context/loading-context';

import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { signInWithUsernameAndPassword } from '../../context/jwt';

// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
  // email: zod
  //   .string()
  //   .min(1, { message: 'Email is required!' })
  //   .email({ message: 'Email must be a valid email address!' }),
  username: zod.string().min(1, { message: 'Username is required!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(5, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();

  const { isMobile } = useContext(LoadingContext);

  const { checkUserSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState(null);

  const password = useBoolean();

  const defaultValues = {
    // email: 'demo@minimals.cc',
    username: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await signInWithPassword({ email: data.email, password: data.password });
      await signInWithUsernameAndPassword({ username: data.username, password: data.password });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.detail);
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Username"
            placeholder="Enter your username"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => {
              field.onChange(e);
              setErrorMsg(null);
            }}
          />
        )}
      />

      <Box gap={1.5} display="flex" flexDirection="column">
        <Link
          component={RouterLink}
          href="#"
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          Forgot password?
        </Link>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              placeholder="6+ characters"
              type={password.value ? 'text' : 'password'}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                field.onChange(e);
                setErrorMsg(null);
              }}
            />
          )}
        />
      </Box>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sign in..."
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <Box sx={{ mt: isMobile ? 25 : 0 }}>
      <FormHead
        title="Sign in to your account"
        // description={
        //   <>
        //     {`Don’t have an account? `}
        //     <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
        //       Get started
        //     </Link>
        //   </>
        // }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {/* <Alert severity="info" sx={{ mb: 3 }}>
        Use <strong>{defaultValues.email}</strong>
        {' with password '}
        <strong>{defaultValues.password}</strong>
      </Alert> */}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </Box>
  );
}
