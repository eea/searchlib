export const get_icons = (settings) => {
  const icons = {};
  settings.clusters.forEach((cluster) => {
    icons[cluster.name] = cluster.icon;
  });
  return icons;
};

export const build_runtime_mappings = (settings) => {
  const clusters = settings.clusters
    .map((cluster) => {
      return (
        '["name": "' +
        cluster.name +
        '", "values": ' +
        JSON.stringify(cluster.values) +
        ']'
      );
    })
    .join(',');
  const source =
    'emit("_all_"); def clusters_settings = [' +
    clusters +
    "]; def vals = doc['" +
    settings.field +
    "']; def clusters = ['All']; for (val in vals) { for (cs in clusters_settings) { if (cs.values.contains(val)) { emit(cs.name) } } }";

  const mapping = {};
  mapping[settings.name] = {
    type: 'keyword',
    script: { source: source },
  };
  return mapping;
};

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
  if (
    result.about.raw.startsWith('http://www.eea.europa.eu/help/glossary/') ||
    result.about.raw.startsWith('https://www.eea.europa.eu/help/glossary/')
  ) {
    image = 'https://www.eea.europa.eu/portal_depiction/term/image_thumb';
    has_img = true;
  }
  if (
    result.objectProvides &&
    result.objectProvides.raw.indexOf('Country profile') !== -1
  ) {
    image =
      'https://www.eea.europa.eu/portal_depiction/country-profile/image_thumb';
    has_img = true;
  }
  if (
    result.about &&
    result.about.raw.indexOf('://land.copernicus.eu') !== -1
  ) {
    image = 'https://www.eea.europa.eu/portal_depiction/data/image_thumb';
    has_img = true;
  } else {
    if (!has_img) {
      let contentTypes = contentTypeNormalize;
      let _type;
      let _typeClass;
      let _contentType = 'generic';

      if (!result.objectProvides) {
        return image;
      }

      if (!Array.isArray(result.objectProvides?.raw)) {
        result.objectProvides.raw = [result.objectProvides.raw];
      }
      if (result.objectProvides?.raw?.length > 0) {
        var pos = result.objectProvides.raw.length - 1;
        while (true) {
          _type = result.objectProvides.raw[pos];
          _typeClass = _type.toLowerCase().replace(/\s/g, '-');
          if (contentTypes[_typeClass]) {
            _contentType = contentTypes[_typeClass];
            break;
          }
          pos--;
          if (pos < 0) {
            break;
          }
        }
      }
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
    result.about?.raw?.startsWith('http://www.eea.europa.eu/help/glossary/') ||
    result.about?.raw?.startsWith('https://www.eea.europa.eu/help/glossary/')
  ) {
    image = 'https://www.eea.europa.eu/portal_depiction/term/image_preview';
    has_img = true;
  }
  if (result.objectProvides?.raw?.indexOf('Country profile') !== -1) {
    image =
      'https://www.eea.europa.eu/portal_depiction/country-profile/image_preview';
    has_img = true;
  }
  if (result.about?.raw?.indexOf('://land.copernicus.eu') !== -1) {
    image = result.about.raw + '/image_preview';
    has_img = true;
  }
  if (
    result.about?.raw?.startsWith('http://www.eea.europa.eu') ||
    result.about?.raw?.startsWith('https://www.eea.europa.eu')
  ) {
    image = result.about.raw + '/image_preview';
    has_img = true;
  } else {
    if (!has_img) {
      let contentTypes = contentTypeNormalize;
      let _type;
      let _typeClass;
      let _contentType = 'generic';
      if (!Array.isArray(result.objectProvides?.raw)) {
        result.objectProvides.raw = [result.objectProvides.raw];
      }
      if (result.objectProvides.raw.length > 0) {
        var pos = result.objectProvides.raw.length - 1;
        while (true) {
          _type = result.objectProvides.raw[pos];
          _typeClass = _type.toLowerCase().replace(/\s/g, '-');
          if (contentTypes[_typeClass]) {
            _contentType = contentTypes[_typeClass];
            break;
          }
          pos--;
          if (pos < 0) {
            break;
          }
        }
      }
      image =
        'https://www.eea.europa.eu/portal_depiction/' +
        _contentType +
        '/image_preview';
    }
  }

  return image;
};

export const get_cluster_icons = (settings) => {
  const icons = {
    fallback: {
      name: 'fallback',
      icon: 'file outline',
    },
  };
  settings.clusters.forEach((cluster) => {
    cluster.values.forEach((value) => {
      icons[value] = {
        cluster: cluster.name,
        icon: cluster.icon,
      };
    });
  });
  return icons;
};
