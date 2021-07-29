import React from 'react';
import getIndexInfo from '@eeacms/search/lib/getIndexInfo';
import { DateTime } from 'luxon';

//async function getInfo(appConfig) {
const getInfo = async (appConfig) => {
  const info = await getIndexInfo(appConfig);
  const index = Object.keys(info);
  if (!index.length) return '';
  const creation_ts = info[index].settings.index.creation_date;
  const dt = DateTime.fromMillis(parseInt(creation_ts));
  return dt.toLocaleString(DateTime.DATETIME_FULL);
};

function AppInfo({ appConfig, ...rest }) {
  const { app_name, app_version } = appConfig;
  const hostname = window.runtimeConfig.HOSTNAME;
  const [crt, setCrt] = React.useState([]);

  React.useEffect(() => {
    getInfo(appConfig).then((response) => {
      setCrt(response || '');
    });
  }, [appConfig]);

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
