import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SpecialtyListView } from 'src/sections/specialty/view';

// ----------------------------------------------------------------------

const metadata = { title: `Specialty list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SpecialtyListView />
    </>
  );
}
