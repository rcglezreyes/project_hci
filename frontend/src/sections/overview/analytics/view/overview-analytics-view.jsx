import dayjs from "dayjs";
import React, { useMemo, useState, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, LinearProgress } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { useDataContext } from 'src/auth/context/data/data-context';

import {paths} from "../../../../routes/paths";
import {useRouter} from "../../../../routes/hooks";
import {fDuration} from "../../../../utils/format-time";
import { WelcomeTypography } from '../welcome-typography';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';


// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  localStorage.setItem('backFromProjectDetails', 'analytics');

  const router = useRouter();

  const [titleLinearProgress, setTitleLinearProgress] = useState('Loading data...');

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const { loadedAdmissions, loadedMedicalStaffs, loadedPatients } = useDataContext();

  const [admissions, setAdmissions] = useState([]);

  const [medicalStaffs, setMedicalStaffs] = useState([]);

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (loadedAdmissions) {
      setAdmissions(loadedAdmissions);
    }
  }, [loadedAdmissions]);

  useEffect(() => {
    if (loadedMedicalStaffs) {
      setMedicalStaffs(loadedMedicalStaffs);
    }
  }, [loadedMedicalStaffs]);

  useEffect(() => {
    if (loadedPatients) {
      setPatients(loadedPatients);
    }
  }, [loadedPatients]);

  useEffect(() => {
    const socket = new WebSocket(`wss://${CONFIG.apiHost}/api/main/ws/admissions/`);
    socket.onerror = (errorEvent) => {
      console.dir(errorEvent);
      console.error('WebSocket error (toString):', errorEvent.toString());
    };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'created' || message.type === 'updated') {
        setAdmissions((prevData) => {
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
        setAdmissions((prevData) =>
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


  const handleLink = (link) => {
      router.push(paths.dashboard[link].list);
  }

  return (
    <>
      {!admissions || !medicalStaffs || !patients ? (
        <Box
          sx={{
            width: '350px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
            margin: 'auto',
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            {titleLinearProgress}
          </Typography>
          <LinearProgress
            key="error"
            sx={{
              mb: 2,
              width: '100%',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'black',
              },
              backgroundColor: '#e0e0e0',
            }}
          />
        </Box>
      ) : (
        <DashboardContent maxWidth="xl">
          <WelcomeTypography userLogged={userLogged} />

          <Grid container spacing={1}>
            <Grid xs={12} sm={12} md={4}>
              <AnalyticsWidgetSummary
                  onClick={() => handleLink('admission')}
                sx={{ cursor: 'pointer' }}
                title='ADMISSIONS'
                percent={linearRegresionCalculation(
                  loadedAdmissions.map((adm) => adm.diagnoses.length > 1)
                )}
                total={loadedAdmissions?.length}
                quantity={loadedAdmissions?.filter((adm) => adm.diagnoses.length > 1).length}
                color="success"
                icon={
                  <img
                    alt="icon"
                    src={`${CONFIG.assetsDir}/assets/icons/glass/ic-admissions.svg`}
                  />
                }
              />
            </Grid>
            <Grid xs={12} sm={12} md={4}>
              <AnalyticsWidgetSummary
                  onClick={() => {handleLink('medicalStaff')}}
                sx={{ cursor: 'pointer' }}
                title='MEDICAL STAFF'
                percent={linearRegresionCalculation(
                    loadedMedicalStaffs.map((med) => fDuration(med.graduatedDate, dayjs((new Date))))
                )}
                total={loadedMedicalStaffs?.length}
                quantity={loadedMedicalStaffs?.filter((med) => fDuration(med.graduatedDate, dayjs((new Date)))).length}
                color="info"
                icon={
                  <img
                    alt="icon"
                    src={`${CONFIG.assetsDir}/assets/icons/glass/ic-medical-staffs.svg`}
                  />
                }
              />
            </Grid>
            <Grid xs={12} sm={12} md={4}>
              <AnalyticsWidgetSummary
                  onClick={() => {handleLink('patient')}}
                sx={{ cursor: 'pointer' }}
                title='PATIENTS'
                percent={linearRegresionCalculation(
                    loadedPatients.map((p) => fDuration(p.birthDate, dayjs((new Date))))
                )}
                total={loadedPatients?.length}
                quantity={loadedPatients?.filter((p) => fDuration(p.birthDate, dayjs((new Date)))).length}
                color="error"
                icon={
                  <img
                    alt="icon"
                    src={`${CONFIG.assetsDir}/assets/icons/glass/ic-patients.svg`}
                  />
                }
              />
            </Grid>
          </Grid>
          {/* <Grid container xs={12} spacing={1}>

                <Grid
                  xs={12}
                  md={!isInstaller(userLogged?.data.user_role.name) ? 4 : 12}
                  lg={!isInstaller(userLogged?.data.user_role.name) ? 4 : 12}
                >
                  <Box
                    sx={{
                      mb: 1,
                      mt: 1,
                      p: { md: 0 },
                      display: 'flex',
                      gap: { xs: 3, md: 1 },
                      borderRadius: { md: 2 },
                      border: '0px solid grey',
                      flexDirection: 'column',
                      // bgcolor: { md: 'background.neutral' },
                      minHeight: { md: '100%' },
                    }}
                  >
                    <ProjectsToDoToday
                      title="To do today"
                      list={projects.filter(proj => fDate(proj.startDate) === fDate(new Date()) || fIsBetween(new Date(), proj.startDate, proj.endDate))}
                    />
                  </Box>
                </Grid>
                {!isInstaller(userLogged?.data.user_role.name) && (
                  <>
                    <Grid xs={12} md={4} lg={4}>
                      <Box
                        sx={{
                          mb: 1,
                          mt: 1,
                          p: { md: 0 },
                          display: 'flex',
                          gap: { xs: 3, md: 1 },
                          borderRadius: { md: 2 },
                          border: '0px solid grey',
                          flexDirection: 'column',
                          // bgcolor: { md: 'background.neutral' },
                          minHeight: { md: '100%' },
                        }}
                      >
                        <ProjectsStageToday
                          title="In installation stage"
                          stage="Installation"
                          list={projects.filter(proj => proj.currentStage.name.toLowerCase().indexOf(CONFIG.stages.installation.toLowerCase()) !== -1)}
                        />
                      </Box>
                    </Grid>
                    <Grid xs={12} md={4} lg={4}>
                      <Box
                        sx={{
                          mb: 1,
                          mt: 1,
                          p: { md: 0 },
                          display: 'flex',
                          gap: { xs: 3, md: 1 },
                          borderRadius: { md: 2 },
                          border: '0px solid grey',
                          flexDirection: 'column',
                          // bgcolor: { md: 'background.neutral' },
                          minHeight: { md: '100%' },
                        }}
                      >
                        <ProjectsStageToday
                          title="In closing stage"
                          stage="Closing"
                          list={projects.filter(proj => proj.currentStage.name.toLowerCase().indexOf(CONFIG.stages.closing.toLowerCase()) !== -1)}
                        />
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid> */}
        </DashboardContent>
      )}
    </>
  );
}

function linearRegresionCalculation(serie) {
  const n = serie.length;
  if (n < 2) return 0;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  for (let i = 0; i < n; i += 1) {
    const x = i;
    const y = serie[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }
  const pendient = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - pendient * sumX) / n;

  const firstValue = pendient * 0 + intercept;
  const lastValue = pendient * (n - 1) + intercept;
  const percentChange = ((lastValue - firstValue) / firstValue);
  return percentChange;
}