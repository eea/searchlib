/**
 * An icon wrapper that can delegate icon lookup to a configured icons repo
 *
 */
import React from 'react';

import { Icon as UiIcon, Image } from 'semantic-ui-react';
import { useAppConfig } from '@eeacms/search';

const Icon = (props) => {
  const { name, family = 'default', type, url, ...rest } = props;
  const { appConfig } = useAppConfig();
  if (name) {
    return <UiIcon name={name} {...rest} />;
  }
  if (url) {
    return <Image src={url} {...rest} />;
  }

  const icons = appConfig.icons[family];
  const icon = icons[type] || icons.fallback;

  return icon.name ? (
    <UiIcon name={icon.name} {...rest} />
  ) : icon.url ? (
    <Image src={icon.url} {...rest} />
  ) : null;
};

export default Icon;
