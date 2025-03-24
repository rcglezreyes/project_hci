import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AdmissionListView } from 'src/sections/admission/view';

// ----------------------------------------------------------------------

const metadata = { title: `Admission list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AdmissionListView />
    </>
  );
}
