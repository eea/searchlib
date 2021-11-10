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

  rec.id = record._id || record.id;

  if (rec.source) {
    // compatibility with haystack proxy
    rec._source = rec.source;
    delete rec._source;
  }

  rec._meta = Object.assign(
    {},
    ...Object.keys(record)
      .filter((n) => n !== '_source')
      .map((n) => ({ [n]: record[n] })),
  );

  return rec;
};

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
    return res;
  }

  get isNew() {
    return this.daysSinceIssued < 30;
  }

  get issued() {
    const raw = this._result['issued']?.raw;
    return raw ? DateTime.fromISO(raw) : DateTime.local();
  }

  get expires() {
    const raw = this._result['expires']?.raw;
    return raw ? DateTime.fromISO(raw) : null;
  }

  // get isExpired() {
  //   return this.expires ? this.expires < DateTime.local() : false;
  // }

  get isExpired() {
    return this._result?.['expires']?.raw
      ? Date.parse(this._result['expires']?.raw) < Date.now()
      : false;
  }

  get metaCategories() {
    return this._result.subject?.raw;
  }

  get clusterIcon() {
    const clusterIcons = this.appConfig.contentUtilsParams.clusterIcons;
    const getClusterIcon = (title) => {
      return clusterIcons[title]?.icon || clusterIcons.fallback.icon;
    };
    return getClusterIcon(this._result.objectProvides?.raw);
  }

  get href() {
    return this._result.about?.raw;
  }

  get title() {
    return this._result.title.raw;
  }

  get description() {
    const fieldName = this.appConfig.resultItemModel.descriptionField;
    return this._result[fieldName]?.raw;
  }

  get thumbUrl() {
    const thumbFactoryName = this.appConfig.resultItemModel.getThumbnailUrl;
    const getThumb =
      registry.resolve[thumbFactoryName] ||
      ((result, config, fallback) => fallback);

    return getThumb(this._result, this.appConfig);
  }

  get highlight() {
    return this._result?._meta?.highlight;
  }

  get website() {
    return this.href ? new URL(this.href).hostname : this.href;
  }

  get tags() {
    const tagsField = this.appConfig.resultItemModel.tagsField;
    return this._result[tagsField]?.raw;
  }

  get metaTypes() {
    return this._result.objectProvides?.raw;
  }
}
