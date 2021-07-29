import React from 'react';
import getIndexInfo from '@eeacms/search/lib/getIndexInfo';
import dateFormat from 'dateformat';

//async function getInfo(appConfig) {
const getInfo = async (appConfig) => {
  const info = await getIndexInfo(appConfig);
  console.log('info', info);
  const index = Object.keys(info);
  if (!index.length) return '';
  const creation_ts = info[index].settings.index.creation_date;
  let creation_date = new Date(0);
  creation_date.setUTCSeconds(creation_ts.substring(0, creation_ts.length - 3));
  creation_date = dateFormat(creation_date, 'dd mmmm yyyy HH:MM TT');
  return creation_date;
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
