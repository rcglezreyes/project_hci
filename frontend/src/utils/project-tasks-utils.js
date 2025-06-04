export const availableTasks = (project, projectTasks, CONFIG) => {
  const tasks = projectTasks?.map((t) => ({
    ...t,
    number: `T-${String(t.project_default_task.order).padStart(3, '0')}`,
  }));
  const sortedTasks = tasks?.sort(
    (a, b) => a.project_default_task.order - b.project_default_task.order
  );
  let foundNotStarted = false;
  const nextTasks = sortedTasks?.filter((t) => {
    if (t.status !== 'not started') return true;
    if (!foundNotStarted) {
      foundNotStarted = true;
      return true;
    }
    return false;
  });
  let finalTasks = [];
  if (project?.hasPermission) {
    const permissionTasks = sortedTasks?.filter(
      (t) => t.project_default_task?.project_stage?.name === CONFIG.stages.permission
    );
    finalTasks = [...nextTasks, ...permissionTasks];
  } else {
    finalTasks = nextTasks?.filter(
      (t) => t.project_default_task?.project_stage?.name !== CONFIG.stages.permission
    );
  }
  const uniqueFinalTasks = [
    ...new Map(finalTasks?.map((task) => [task?.project_default_task?.id, task])).values(),
  ];
  return uniqueFinalTasks;
};

export const totalPercentageProject = (project, CONFIG) => {
  const projectTasks = project?.projectDefaultTasks;
  const filteredTasks = project?.hasPermission
    ? projectTasks
    : projectTasks?.filter(
        (t) => t.project_default_task?.project_stage?.name !== CONFIG.stages.permission
      );
  const total = filteredTasks?.reduce((acc, t) => acc + t.percentage, 0);
  const percentage = total / filteredTasks.length || 0;
  return percentage;
};

export const totalPercentageProjectStage = (project, stage, CONFIG) => {
  const projectTasks = project?.projectDefaultTasks;
  const filteredTasks = project?.hasPermission
    ? projectTasks
    : projectTasks?.filter(
        (t) => t.project_default_task?.project_stage?.name !== CONFIG.stages.permission
      );
  const stageTasks = filteredTasks?.filter(
    (t) => t.project_default_task?.project_stage?.name === stage
  );
  const total = stageTasks?.reduce((acc, t) => acc + t.percentage, 0);
  const percentage = total / stageTasks.length || 0;
  return percentage;
};

export const getProjectInstaller = (project, CONFIG) => {
  const users = project?.projectDefaultTasks?.filter(
    (task) =>
      task.project_default_task.project_stage.name === CONFIG.stages.installation &&
      task.project_default_task.name.toLowerCase().includes('start')
  )[0]?.users_assignees;

  const installer = users?.filter((user) => {
    const objRole = user?.userRole || user?.user_role;
    return objRole.name.toLowerCase().includes(CONFIG.roles.installer.toLowerCase());
  })[0];

  return installer;
};
