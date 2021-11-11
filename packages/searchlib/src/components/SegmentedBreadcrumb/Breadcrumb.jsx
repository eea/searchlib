import React from 'react';
import { Breadcrumb } from 'semantic-ui-react';

const URLBreadcrumb = ({ href, maxSegments = 3 }) => {
  const url = new URL(href);
  const { pathname } = url;
  return (
    <Breadcrumb>
      <Breadcrumb.Section>{`${url.origin}`}</Breadcrumb.Section>
      {pathname
        .split('/')
        .filter((s) => !!s)
        .slice(0, maxSegments)
        .map((s) => (
          <>
            <Breadcrumb.Divider />
            <Breadcrumb.Section>{s}</Breadcrumb.Section>
          </>
        ))}
    </Breadcrumb>
  );
};

export default URLBreadcrumb;
