import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MedicalStaffCreateView } from 'src/sections/medical-staff/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new medical staff | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MedicalStaffCreateView />
    </>
  );
}
