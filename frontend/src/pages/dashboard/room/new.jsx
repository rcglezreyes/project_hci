import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { RoomCreateView } from 'src/sections/room/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new room | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RoomCreateView />
    </>
  );
}
