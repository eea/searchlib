import React from 'react';
import FilterValue from './FilterValue';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { Label, Icon } from 'semantic-ui-react';

const Filter = (props) => {
  const { field, type, values, onClear, removeFilter } = props;
  const { appConfig, registry } = useAppConfig();

  return (
    <div className="filter-list-item">
      <div className="filter-name">
        {`${field} ${type !== 'none' ? `(${type})` : ''}:`}
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
