import registry from '@eeacms/search/registry';
import { DateTime } from 'luxon';

function getHighlight(hit, fieldName) {
  // if (hit._source.title === 'Rocky Mountain' && fieldName === 'title') {
  //   window.hit = hit;
  //   window.fieldName = fieldName;
  // }

  if (
    !hit.highlight ||
    !hit.highlight[fieldName] ||
    hit.highlight[fieldName].length < 1
  ) {
    return;
  }

  return hit.highlight[fieldName][0];
}

const toObject = (field, value, snippet, field_filters) => {
  const blacklist = field_filters[field]?.blacklist || [];
  const whitelist = field_filters[field]?.whitelist || [];

  if (!Array.isArray(value)) {
    value = [value];
  }

  let filtered_value = value.filter((val) => blacklist.indexOf(val) === -1);
  if (whitelist.length > 0) {
    filtered_value = filtered_value.filter(
      (val) => whitelist.indexOf(val) !== -1,
    );
  }

  if (filtered_value.length === 1) {
    filtered_value = filtered_value[0];
  }

  return { raw: filtered_value, ...(snippet && { snippet }) };
};

export const convertHitToResult = (record, field_filters) => {
  const addEachKeyValueToObject = (acc, [key, value]) => ({
    ...acc,
    [key]: value,
  });

  const rec = Object.entries(record._source)
    .map(([fieldName, fieldValue]) => [
      fieldName,
      toObject(
        fieldName,
        fieldValue,
        getHighlight(record, fieldName),
        field_filters || {},
      ),
    ])
    .reduce(addEachKeyValueToObject, {});

  rec.id = { raw: record._id || record.id }; // TODO: make sure to have ids

  if (rec.source) {
    // compatibility with haystack proxy
    rec._source = rec.source;
    delete rec._source;
  }

  rec._original = record;
  return rec;
};

// constructor(record, config, field_filters) {
//   super(record, config, field_filters);
//   this.appConfig = config;
//   this._original = record;
//   this._result = convertHitToResult(
//     record,
//     field_filters || config.field_filters,
//   );
// }
//

export class BasicModel {
  constructor(record, config, field_filters) {
    const basic = {
      appConfig: config,
      _original: record,
      _result: convertHitToResult(
        record,
        field_filters || config.field_filters,
      ),
    };

    return new Proxy(basic, this);
  }

  get(target, name) {
    if (target.hasOwnProperty(name)) return target[name];

    const proto = Object.getPrototypeOf(this);
    const descriptors = Object.getOwnPropertyDescriptors(proto);
    // if (name === 'title') {
    //   console.log('proto', { proto, target, name, this: this, descriptors });
    // }
    if (descriptors[name] && descriptors[name].get) {
      const value = descriptors[name].get.bind(target).apply();
      delete target[name];
      target[name] = value;
      return target[name];
    } else {
      return target._result[name];
    }
  }
}

export class ResultModel extends BasicModel {
  get daysSinceIssued() {
    const raw = this._result['issued']?.raw;
    const issued = raw ? DateTime.fromISO(raw) : DateTime.local();
    const res = DateTime.local().diff(issued, 'days').as('days');
    console.log('issued', { issued, res });
    return res;
  }

  get issued() {
    const raw = this._result['issued']?.raw;
    return raw ? DateTime.fromISO(raw) : DateTime.local();
  }

  get expires() {
    const raw = this._result['expires']?.raw;
    return raw ? DateTime.fromISO(raw) : null;
  }

  get icon() {
    //
  }

  get href() {
    return this._result.about?.raw;
  }

  get title() {
    return this._result.title.raw;
  }

  get thumbUrl() {
    const thumbFactoryName = this.appConfig.resultItemModel.getThumbnailUrl;
    const getThumb =
      registry.resolve[thumbFactoryName] ||
      ((result, config, fallback) => fallback);

    return getThumb(this._result, this.appConfig);
  }

  get isExpired() {
    return this.expires ? this.expires < DateTime.local() : false;
  }
}
