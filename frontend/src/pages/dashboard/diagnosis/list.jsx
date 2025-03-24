import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DiagnosisListView } from 'src/sections/diagnosis/view';

// ----------------------------------------------------------------------

const metadata = { title: `Diagnosis list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DiagnosisListView />
    </>
  );
}
