import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SpecialtyCreateView } from 'src/sections/specialty/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new specialty | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SpecialtyCreateView />
    </>
  );
}
