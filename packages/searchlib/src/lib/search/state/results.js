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

export default function buildResults(hits, field_filters) {
  const addEachKeyValueToObject = (acc, [key, value]) => ({
    ...acc,
    [key]: value,
  });

  const toObject = (field, value, snippet) => {
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

  return hits.map((record) => {
    const rec = Object.entries(record._source)
      .map(([fieldName, fieldValue]) => [
        fieldName,
        toObject(fieldName, fieldValue, getHighlight(record, fieldName)),
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
  });
}
