import React from 'react';
import FilterValue from './FilterValue';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { Label, Icon } from 'semantic-ui-react';

const Filter = (props) => {
  const { field, type, values, onClear, removeFilter, noTitle } = props;
  const { appConfig, registry } = useAppConfig();
  const facetField = field;
  const { label } = appConfig.facets.find(
    ({ field }) => field === facetField,
  ) || { label: field.trim() };
  return (
    <div className="filter-list-item">
      <div className="filter-name">
        {!noTitle ? `${label}${type !== 'none' ? ` (${type})` : ''}:` : null}
      </div>
      <Label.Group>
        {values?.map((v, index) => {
          return (
            <Label key={index}>
              <FilterValue
                value={v}
                field={field}
                type={type}
                appConfig={appConfig}
                registry={registry}
              />
              <Icon
                onClick={() => {
                  return values.length === 1
                    ? onClear(field)
                    : removeFilter(field, v, type);
                }}
                name="delete"
              />
            </Label>
          );
        })}
      </Label.Group>
    </div>
  );
};

export default Filter;
