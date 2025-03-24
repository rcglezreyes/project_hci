import axios from 'axios';
import { useMemo, useState, useEffect, useContext, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { Typography, TableContainer } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { CONFIG } from 'src/config-global';
import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { TableCustomPaginationZohoStyleRow } from 'src/components/table/table-pagination-custom-zoho-style-row';
import {
  useTable,
  rowInPage,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
} from 'src/components/table';

import { LoadingContext } from 'src/auth/context/loading-context';
import { useDataContext } from 'src/auth/context/data/data-context';

import { AdmissionTableRow } from '../admission-table-row';
import { AdmissionTableToolbar } from '../admission-table-toolbar';
import { AdmissionTableFiltersResult } from '../admission-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const TABLE_HEAD = [
  { id: 'patient', label: 'Patient' },
  { id: 'medicalStaff', label: 'Medical Staff' },
  { id: 'date', label: 'Date' },
  { id: 'daysInAdmission', label: 'Days' },
  { id: '' },
];

const TABLE_HEAD_MOBILE = [{ id: 'info', label: 'Admissions' }];

// ----------------------------------------------------------------------

export function AdmissionListView() {
  const { isMobile } = useContext(LoadingContext);

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const table = useTable({ defaultDense: true });

  const router = useRouter();

  const confirm = useBoolean();

  const { loadedAdmissions, refetchAdmissions } = useDataContext();

  const [tableData, setTableData] = useState([]);

  const filters = useSetState({ name: '', role: [], status: 'all' });

  useEffect(() => {
    if (refetchAdmissions) {
      refetchAdmissions();
    }
    setTableData(loadedAdmissions || []);
  }, [refetchAdmissions, loadedAdmissions]);

  useEffect(() => {
    if (loadedAdmissions) {
      setTableData(loadedAdmissions);
    }
  }, [loadedAdmissions]);

  useEffect(() => {
    const socket = new WebSocket(paths.backend.websocket.main.admissions);
    socket.onerror = (errorEvent) => {
      console.dir(errorEvent);
      console.error('WebSocket error (toString):', errorEvent.toString());
    };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'created' || message.type === 'updated') {
        setTableData((prevData) => {
          const existingItemIndex = prevData.findIndex(
            (item) => String(item.id) === String(message.item.id)
          );
          if (existingItemIndex !== -1) {
            const updatedData = [...prevData];
            updatedData[existingItemIndex] = message.item;
            return updatedData;
          }
          return [message.item, ...prevData];
        });
      } else if (message.type === 'deleted') {
        setTableData((prevData) =>
          prevData.filter((item) => String(item.id) !== String(message.item.id))
        );
      }
    };
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
      }),
    [tableData, table.order, table.orderBy, filters.state]
  );

  const dataInPage = useMemo(
    () => rowInPage(dataFiltered, table.page, table.rowsPerPage),
    [dataFiltered, table.page, table.rowsPerPage]
  );

  const canReset = useMemo(
    () => !!filters.state.name || filters.state.status !== 'all',
    [filters.state]
  );

  const notFound = useMemo(
    () => (!dataFiltered.length && canReset) || !dataFiltered.length,
    [dataFiltered.length, canReset]
  );

  const handleDeleteRow = useCallback(
    async (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      const response = await axios.delete(paths.backend.api.main.admission.delete(id), {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          userReporter: JSON.stringify(userLogged?.data),
        },
      });

      if (response.data.message) {
        setTableData(deleteRow);
        table.onUpdatePageDeleteRow(dataInPage.length);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.error);
      }
    },
    [dataInPage.length, table, tableData, userLogged]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const rows = tableData.filter((row) => !table.selected.includes(row.id));

      const payload = {
        ids: table.selected,
        userReporter: JSON.stringify(userLogged?.data),
      };

      const response = await axios.delete(paths.backend.api.main.admission.deleteAll, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: payload,
      });

      if (response.data.message) {
        toast.success(response.data.message);
        setTableData(rows);
        table.onUpdatePageDeleteRows({
          totalRowsInPage: dataInPage.length,
          totalRowsFiltered: dataFiltered.length,
        });
        refetchAdmissions?.();
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.error);
    }
  }, [dataFiltered.length, dataInPage.length, table, tableData, userLogged, refetchAdmissions]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.admission.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          // heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.general.analytics },
            { name: 'Admission', href: paths.dashboard.admission.list },
            { name: 'List' },
          ]}
          action={
            <Tooltip title="Create new admission">
              <Button
                component={RouterLink}
                href={paths.dashboard.admission.new}
                variant="outlined"
                // variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2">New</Typography>
                  <Box
                    component="img"
                    src={`${CONFIG.assetsDir}/assets/icons/notification/ic-create-admission.svg`}
                    alt="admission"
                    sx={{ width: 24, height: 24 }}
                  />
                </Box>
              </Button>
            </Tooltip>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'inactive' && 'error') ||
                      'default'
                    }
                  >
                    {['active', 'inactive'].includes(tab.value)
                      ? tableData.filter((admission) =>
                          tab.value === 'active' ? admission.isActive : !admission.isActive
                        ).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <AdmissionTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <AdmissionTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.filter((id) => id !== userLogged?.data.id).length}
              rowCount={dataFiltered.filter((row) => row.id !== userLogged?.data.id).length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.filter((row) => row.id !== userLogged?.data.id).map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <TableContainer
              sx={{
                px: { md: 1 },
                minWidth: !isMobile ? 960 : 380,
                maxHeight:
                  filters.state.status === 'all' ? 'calc(100vh - 380px)' : 'calc(100vh - 480px)',
                overflowY: 'auto',
              }}
            >
              <Table size={table.dense ? 'small' : 'medium'} stickyHeader>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={!isMobile ? TABLE_HEAD : TABLE_HEAD_MOBILE}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <AdmissionTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        refetchAdmissions={refetchAdmissions}
                      />
                    ))}

                  {dataFiltered?.length > 0 && (
                    <TableCustomPaginationZohoStyleRow
                      columnsLength={isMobile ? TABLE_HEAD_MOBILE.length : TABLE_HEAD.length}
                      data={dataFiltered}
                      page={table.page}
                      rowsPerPage={table.rowsPerPage}
                      handleChangePage={(event, newPage) => {
                        localStorage.setItem('itemPage', newPage);
                        table.onChangePage(event, newPage);
                      }}
                      handleChangeRowsPerPage={(event) => {
                        localStorage.setItem('itemRowsPerPage', event.target.value);
                        table.onChangeRowsPerPage(event);
                      }}
                      dense={table.dense}
                      onChangeDense={table.onChangeDense}
                    />
                  )}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          /> */}
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete{' '}
            <strong> {table.selected.filter((id) => id !== userLogged?.data.id).length} </strong>{' '}
            items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (admission) =>
        admission?.patient?.user?.username?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        admission?.patient?.user?.firstName?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        admission?.patient?.user?.lastName?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        admission?.patient?.user?.email?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        admission?.patient?.disabilities?.some(disability => disability.name.toLowerCase().includes(name.toLowerCase())) ||
          admission?.medicalStaff?.user?.username?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
          admission?.medicalStaff?.user?.firstName?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
          admission?.medicalStaff?.user?.lastName?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
          admission?.medicalStaff?.user?.email?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
          admission?.medicalStaff?.specialty?.name?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
          admission?.medicalStaff?.department?.name?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
          admission?.diagnoses?.some(diagnosis => diagnosis.name.toLowerCase().includes(name.toLowerCase())) ||
          admission?.diagnosesNotes?.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    if (status === 'active') {
      inputData = inputData.filter((admission) => admission?.isActive);
    } else {
      inputData = inputData.filter((admission) => !admission?.isActive);
    }
  }

  return inputData;
}
