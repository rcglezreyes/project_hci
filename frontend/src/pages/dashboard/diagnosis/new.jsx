import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DiagnosisCreateView } from 'src/sections/diagnosis/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new diagnosis | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DiagnosisCreateView />
    </>
  );
}
