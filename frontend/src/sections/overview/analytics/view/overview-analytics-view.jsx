import React, { useMemo, useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';
import { Box, LinearProgress } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { useDataContext } from 'src/auth/context/data/data-context';

import { WelcomeTypography } from '../welcome-typography';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  localStorage.setItem('backFromProjectDetails', 'analytics');


  const [titleLinearProgress, setTitleLinearProgress] = useState('Loading data...');

  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const {
    loadedAdmissions,
    loadedMedicalStaffs,
    loadedPatients,
  } = useDataContext();

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

          {/* <Grid container spacing={1}>
                    <Grid xs={12} sm={6} md={2.4}>
                      <AnalyticsWidgetSummary
                        sx={{ cursor: 'pointer' }}
                        title={`${CONFIG.stages.preparation}`}
                        percent={
                          linearRegresionCalculation(
                            projects?.filter(
                              proj => proj.currentStage.name.toLowerCase().indexOf(CONFIG.stages.preparation.toLowerCase()) !== -1
                            ).map((proj) => proj.hasPermission)
                          )}
                        total={
                          projects?.filter(
                            proj => proj.currentStage.name.toLowerCase().indexOf(CONFIG.stages.preparation.toLowerCase()) !== -1
                          ).length
                        }
                        quantity={
                          projects?.filter(
                            proj => proj.currentStage.name.toLowerCase().indexOf(CONFIG.stages.preparation.toLowerCase()) !== -1
                          ).length
                        }
                        color="error"
                        icon={
                          <img alt="icon" src={`${CONFIG.assetsDir}/assets/icons/glass/ic-preparation-stage.svg`} />
                        }
                        onClick={() => { }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6} md={2.4}>
                      <AnalyticsWidgetSummary
                        sx={{ cursor: 'pointer' }}
                        title={`${CONFIG.stages.coordination}`}
                        percent={
                          linearRegresionCalculation(
                            projects?.filter(
                              proj => proj.currentStage.name.toLowerCase().indexOf(CONFIG.stages.coordination.toLowerCase()) !== -1
                            ).map((proj) => proj.hasPermission)
                          )}
                        total={
                          projects?.filter(
                            proj => proj.currentStage.name.toLowerCase().indexOf(CONFIG.stages.coordination.toLowerCase()) !== -1
                          ).length
                        }
                        quantity={
                          projects?.filter(
                            proj => proj.currentStage.name.toLowerCase().indexOf(CONFIG.stages.coordination.toLowerCase()) !== -1
                          ).length
                        }
                        color="secondary"
                        icon={
                          <img alt="icon" src={`${CONFIG.assetsDir}/assets/icons/glass/ic-coordination-stage.svg`} />
                        }
                        onClick={() => { }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6} md={2.4}>
                      <AnalyticsWidgetSummary
                        sx={{ cursor: 'pointer' }}
                        title={`${CONFIG.stages.installation}`}
                        percent={
                          linearRegresionCalculation(
                            projects?.filter(
                              proj => proj.currentStage.name.toLowerCase().indexOf(CONFIG.stages.installation.toLowerCase()) !== -1
                            ).map((proj) => proj.hasPermission)
                          )}
                        total={
                          projects?.filter(
                            proj => proj.currentStage.name.toLowerCase().indexOf(CONFIG.stages.installation.toLowerCase()) !== -1
                          ).length
                        }
                        quantity={
                          projects?.filter(
                            proj => proj.currentStage.name.toLowerCase().indexOf(CONFIG.stages.installation.toLowerCase()) !== -1
                          ).length
                        }
                        color="info"
                        icon={
                          <img alt="icon" src={`${CONFIG.assetsDir}/assets/icons/glass/ic-installation-stage.svg`} />
                        }
                        onClick={() => { }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6} md={2.4}>
                      <AnalyticsWidgetSummary
                        sx={{ cursor: 'pointer' }}
                        title={`${CONFIG.stages.permission}`}
                        percent={
                          linearRegresionCalculation(
                            projects?.filter(
                              proj => proj.currentStage.name.toLowerCase().indexOf(CONFIG.stages.permission.toLowerCase()) !== -1
                            ).map((proj) => proj.hasPermission)
                          )}
                        total={
                          projects?.filter(
                            proj => proj.currentStage.name.toLowerCase().indexOf(CONFIG.stages.permission.toLowerCase()) !== -1
                          ).length
                        }
                        quantity={
                          projects?.filter(
                            proj => proj.currentStage.name.toLowerCase().indexOf(CONFIG.stages.permission.toLowerCase()) !== -1
                          ).length
                        }
                        color="warning"
                        icon={
                          <img alt="icon" src={`${CONFIG.assetsDir}/assets/icons/glass/ic-permission-stage.svg`} />
                        }
                        onClick={() => { }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6} md={2.4}>
                      <AnalyticsWidgetSummary
                        sx={{ cursor: 'pointer' }}
                        title={`${CONFIG.stages.closing}`}
                        percent={
                          linearRegresionCalculation(
                            projects?.filter(
                              proj => proj.currentStage.name.toLowerCase().indexOf(CONFIG.stages.closing.toLowerCase()) !== -1
                            ).map((proj) => proj.hasPermission)
                          )}
                        total={
                          projects?.filter(
                            proj => proj.currentStage.name.toLowerCase().indexOf(CONFIG.stages.closing.toLowerCase()) !== -1
                          ).length
                        }
                        quantity={
                          projects?.filter(
                            proj => proj.currentStage.name.toLowerCase().indexOf(CONFIG.stages.closing.toLowerCase()) !== -1
                          ).length
                        }
                        color="success"
                        icon={
                          <img alt="icon" src={`${CONFIG.assetsDir}/assets/icons/glass/ic-closing-stage.svg`} />
                        }
                        onClick={() => { }}
                      />
                    </Grid>
              </Grid> */}
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
