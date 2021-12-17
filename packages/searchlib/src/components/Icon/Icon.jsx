/**
 * An icon wrapper that can delegate icon lookup to a configured icons repo
 *
 */
import React from 'react';

import { Icon as UiIcon, Image, Flag } from 'semantic-ui-react';
import { useAppConfig } from '@eeacms/search';

const Icon = (props) => {
  const { name, country, family = 'default', type, url, ...rest } = props;
  const { appConfig } = useAppConfig();
  if (name) {
    return <UiIcon name={name} {...rest} />;
  }
  if (url) {
    return <Image src={url} {...rest} />;
  }

  const countryFlag = (country) => {
    const countryAlias = {
      Czechia: 'Czech Republic',
      'North Macedonia': 'Macedonia',
      'British Indian Ocean Territory': 'United Kingdom',
    };

    let countryName = countryAlias[country] || country;

    return <Flag name={countryName.toLowerCase()} />;
  };

  if (country) {
    return countryFlag(country);
  }

  const icons = appConfig.icons[family];
  const icon = icons[type] || icons.fallback;

  return icon.name ? (
    <UiIcon name={icon.name} {...rest} />
  ) : icon.url ? (
    <Image src={icon.url} {...rest} />
  ) : icon.country ? (
    countryFlag(type) // icon.country is a placeholder, we already have the name
  ) : null;
};

export default Icon;
