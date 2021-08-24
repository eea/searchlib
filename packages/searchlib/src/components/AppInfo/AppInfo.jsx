import React from 'react';
import getIndexInfo from '@eeacms/search/lib/getIndexInfo';
import { DateTime } from 'luxon';
import { useIsMounted } from '@eeacms/search/lib/hocs';

//async function getInfo(appConfig) {
const getInfo = async (appConfig) => {
  const { elastic_index } = appConfig;

  if (elastic_index === '_all') return ''; // we don't support _all

  const info = await getIndexInfo(appConfig);
  const indexes = Object.keys(info);
  if (indexes.length < 1) return '';

  const creation_ts = info[indexes[0]].settings.index.creation_date;
  const dt = DateTime.fromMillis(parseInt(creation_ts));
  return dt.toLocaleString(DateTime.DATETIME_FULL);
};

function AppInfo({ appConfig, ...rest }) {
  const { app_name, app_version } = appConfig;
  const hostname = window.runtimeConfig?.HOSTNAME || 'localhost';
  const [crt, setCrt] = React.useState([]);
  const isMounted = useIsMounted();

  React.useEffect(() => {
    getInfo(appConfig).then((response) => {
      if (isMounted.current) setCrt(response || '');
    });
  }, [appConfig, isMounted]);

  return (
    <div {...rest} className="sui-app-info">
      Application data last refreshed <strong>{crt}</strong>. Version info{' '}
      <strong>
        {app_name}:{app_version}
      </strong>{' '}
      on <strong>{hostname}</strong>.
    </div>
  );
}

export default AppInfo;
