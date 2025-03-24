import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MedicalStaffListView } from 'src/sections/medical-staff/view';

// ----------------------------------------------------------------------

const metadata = { title: `Medical Staff list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MedicalStaffListView />
    </>
  );
}
