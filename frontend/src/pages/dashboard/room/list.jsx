import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { RoomListView } from 'src/sections/room/view';

// ----------------------------------------------------------------------

const metadata = { title: `Room list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RoomListView />
    </>
  );
}
