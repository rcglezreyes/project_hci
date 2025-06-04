import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DisabilityCreateView } from 'src/sections/disability/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new disability | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DisabilityCreateView />
    </>
  );
}
