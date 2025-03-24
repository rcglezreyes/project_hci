import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AdmissionCreateView } from 'src/sections/admission/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new admission | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AdmissionCreateView />
    </>
  );
}
