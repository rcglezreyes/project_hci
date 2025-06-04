import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DepartmentCreateView } from 'src/sections/department/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new department | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DepartmentCreateView />
    </>
  );
}
