import React from 'react';
import { Breadcrumb } from 'semantic-ui-react';

const URLBreadcrumb = ({ href, maxSegments = 3, short = false }) => {
  const url = new URL(href);
  const { pathname } = url;

  let index = 0;
  const newKey = () => {
    return index++;
  };

  return short ? (
    <span className="breadcrumb">
      {pathname
        .split('/')
        .filter((s) => !!s)
        .slice(0, maxSegments)
        .map((s) => (
          <span key={s + '2' + newKey()}> / {s}</span>
        ))}
    </span>
  ) : (
    <Breadcrumb>
      <Breadcrumb.Section>{`${url.origin}`}</Breadcrumb.Section>
      {pathname
        .split('/')
        .filter((s) => !!s)
        .slice(0, maxSegments)
        .map((s) => (
          <div key={s + '2' + newKey()}>
            <Breadcrumb.Divider key={s + newKey()} />
            <Breadcrumb.Section key={s + '1' + newKey()}>
              {s}
            </Breadcrumb.Section>
          </div>
        ))}
    </Breadcrumb>
  );
};

export default URLBreadcrumb;
