import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DisabilityListView } from 'src/sections/disability/view';

// ----------------------------------------------------------------------

const metadata = { title: `Disability list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DisabilityListView />
    </>
  );
}
