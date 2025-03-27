import { useMemo } from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { fData } from 'src/utils/format-number';
import { verifyPermissions, listRolesAndSubroles } from 'src/utils/check-permissions';

import { CONFIG } from 'src/config-global';
import { varAlpha } from 'src/theme/styles';

import { Iconify } from '../../iconify';
import { uploadClasses } from '../classes';
import { fileData, FileThumbnail } from '../../file-thumbnail';

// ----------------------------------------------------------------------

export function MultiFilePreview({
  sx,
  onRemove,
  onDownload,
  lastNode,
  thumbnail,
  slotProps,
  firstNode,
  files = [],
  className,
  listPermissions,
  isProject = true,
  ...other
}) {
  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const module = isProject ? CONFIG.permissions.moduleProjects : CONFIG.permissions.moduleTasks;

  const renderFirstNode = firstNode && (
    <Box
      component="li"
      sx={{
        ...(thumbnail && {
          width: 'auto',
          display: 'inline-flex',
        }),
      }}
    >
      {firstNode}
    </Box>
  );

  const renderLastNode = lastNode && (
    <Box
      component="li"
      sx={{
        ...(thumbnail && { width: 'auto', display: 'inline-flex' }),
      }}
    >
      {lastNode}
    </Box>
  );

  return (
    <Box
      component="ul"
      className={uploadClasses.uploadMultiPreview.concat(className ? ` ${className}` : '')}
      sx={{
        gap: 1,
        display: 'flex',
        flexDirection: 'column',
        ...(thumbnail && {
          flexWrap: 'wrap',
          flexDirection: 'row',
        }),
        ...sx,
      }}
      {...other}
    >
      {renderFirstNode}

      {files.map((file) => {
        const { name, size } = fileData(file);

        if (thumbnail) {
          return (
            <Box component="li" key={name} sx={{ display: 'inline-flex' }}>
              <FileThumbnail
                tooltip
                imageView
                file={file}
                onRemove={
                  verifyPermissions(
                    listPermissions,
                    CONFIG.permissions.system,
                    module,
                    CONFIG.permissions.operationRemoveFile
                  ) ||
                  listRolesAndSubroles(userLogged?.data?.user_role?.name).includes(
                    CONFIG.roles.administrator
                  )
                    ? () => onRemove?.(file)
                    : null
                }
                onDownload={
                  verifyPermissions(
                    listPermissions,
                    CONFIG.permissions.system,
                    module,
                    CONFIG.permissions.operationDownloadFile
                  ) ||
                  listRolesAndSubroles(userLogged?.data?.user_role?.name).includes(
                    CONFIG.roles.administrator
                  )
                    ? () => onDownload?.(file)
                    : null
                }
                sx={{
                  width: 80,
                  height: 80,
                  border: (theme) =>
                    `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                }}
                slotProps={{ icon: { width: 40, height: 40 } }}
                {...slotProps?.thumbnail}
              />
            </Box>
          );
        }

        return (
          <Box
            component="li"
            key={name}
            sx={{
              py: 1,
              pr: 1,
              pl: 1.5,
              gap: 1.5,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              border: (theme) =>
                `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
            }}
          >
            <FileThumbnail file={file} {...slotProps?.thumbnail} />

            <ListItemText
              primary={name}
              secondary={fData(size)}
              secondaryTypographyProps={{
                component: 'span',
                typography: 'caption',
              }}
            />

            {onRemove &&
              (verifyPermissions(
                listPermissions,
                CONFIG.permissions.system,
                module,
                CONFIG.permissions.operationRemoveFile
              ) ||
                listRolesAndSubroles(userLogged?.data?.user_role?.name).includes(
                  CONFIG.roles.administrator
                )) && (
                <IconButton size="small" onClick={() => onRemove(file)}>
                  <Iconify icon="mingcute:close-line" width={16} />
                </IconButton>
              )}
            {onDownload &&
              (verifyPermissions(
                listPermissions,
                CONFIG.permissions.system,
                module,
                CONFIG.permissions.operationDownloadFile
              ) ||
                listRolesAndSubroles(userLogged?.data?.user_role?.name).includes(
                  CONFIG.roles.administrator
                )) && (
                <IconButton size="small" onClick={() => onDownload(file)}>
                  <Iconify icon="ic:outline-cloud-download" width={16} />
                </IconButton>
              )}
          </Box>
        );
      })}

      {renderLastNode}
    </Box>
  );
}
