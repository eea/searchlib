export function getTodayWithTime() {
  const d = new Date();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();

  const output = [
    d.getFullYear(),
    '-',
    month < 10 ? '0' : '',
    month,
    '-',
    day < 10 ? '0' : '',
    day,
    'T',
    hour < 10 ? '0' : '',
    hour,
    ':',
    minute < 10 ? '0' : '',
    minute,
    ':',
    second < 10 ? '0' : '',
    second,
    'Z',
  ].join('');
  return output;
}
export const getGlobalsearchIconUrl = (contentTypeNormalize) => (
  result,
  config,
  fallback,
) => {
  let image = fallback;
  let has_img = false;
  console.log('result', result);
  if (
    result.meta?.raw?.about?.startsWith(
      'http://www.eea.europa.eu/help/glossary/',
    )
  ) {
    image = 'https://www.eea.europa.eu/portal_depiction/term/image_thumb';
    has_img = true;
  }
  if (result.meta?.raw?.objectProvides?.indexOf('Country profile') !== -1) {
    image =
      'https://www.eea.europa.eu/portal_depiction/country-profile/image_thumb';
    has_img = true;
  }
  if (result.meta?.raw?.about.indexOf('://land.copernicus.eu') !== -1) {
    image = 'https://www.eea.europa.eu/portal_depiction/data/image_thumb';
    has_img = true;
  } else {
    if (!has_img) {
      let contentTypes = contentTypeNormalize;
      let _type;
      let _typeClass;
      // TODO: fix it
      let _contentType = 'generic';

      // if (!result.meta?.raw?.objectProvides) {
      //   return image;
      // }
      //
      // if (!Array.isArray(result.meta?.raw?.objectProvidesraw)) {
      //   result.meta.raw.objectProvides = [result.meta.raw.objectProvides];
      // }
      // if (result.meta?.raw?.objectProvides?.length > 0) {
      //   var pos = result.meta?.raw?.objectProvides?.length - 1;
      //   while (true) {
      //     _type = result.meta?.raw?.objectProvides[pos];
      //     _typeClass = _type.toLowerCase().replace(/\s/g, '-');
      //     if (contentTypes[_typeClass]) {
      //       _contentType = contentTypes[_typeClass];
      //       break;
      //     }
      //     pos--;
      //     if (pos < 0) {
      //       break;
      //     }
      //   }
      // }
      image =
        'https://www.eea.europa.eu/portal_depiction/' +
        _contentType +
        '/image_thumb';
    }
  }

  return image;
};

export const getGlobalsearchThumbUrl = (contentTypeNormalize) => (
  result,
  config,
  fallback,
) => {
  let image = fallback;
  let has_img = false;
  if (
    result.meta?.raw?.about?.startsWith(
      'http://www.eea.europa.eu/help/glossary/',
    )
  ) {
    image = 'https://www.eea.europa.eu/portal_depiction/term/image_preview';
    has_img = true;
  }
  if (result.meta?.raw?.objectProvides?.indexOf('Country profile') !== -1) {
    image =
      'https://www.eea.europa.eu/portal_depiction/country-profile/image_preview';
    has_img = true;
  }
  if (result.meta?.raw?.about?.indexOf('://land.copernicus.eu') !== -1) {
    image = result.meta.raw.about + '/image_preview';
    has_img = true;
  }
  if (result.meta?.raw?.about?.startsWith('http://www.eea.europa.eu')) {
    image = result.meta.raw.about + '/image_preview';
    has_img = true;
  } else {
    if (!has_img) {
      let contentTypes = contentTypeNormalize;
      let _type;
      let _typeClass;
      let _contentType = 'generic';
      // TODO: fix it
      console.log(result);
      // if (!Array.isArray(result.meta?.raw?.objectProvides)) {
      //   result.meta.raw.objectProvides = [result.meta.raw.objectProvides];
      // }
      // if (result.meta.raw.objectProvides.length > 0) {
      //   var pos = result.meta.raw.objectProvides.length - 1;
      //   while (true) {
      //     _type = result.meta.raw.objectProvides[pos];
      //     _typeClass = _type.toLowerCase().replace(/\s/g, '-');
      //     if (contentTypes[_typeClass]) {
      //       _contentType = contentTypes[_typeClass];
      //       break;
      //     }
      //     pos--;
      //     if (pos < 0) {
      //       break;
      //     }
      //   }
      // }
      image =
        'https://www.eea.europa.eu/portal_depiction/' +
        _contentType +
        '/image_preview';
    }
  }

  return image;
};
