import React from 'react';
import FilterValue from './FilterValue';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { Label, Icon } from 'semantic-ui-react';

const Filter = (props) => {
  const {
    field,
    type,
    values,
    onClear,
    removeFilter,
    noTitle,
    customClass,
  } = props;
  const { appConfig, registry } = useAppConfig();
  const facetField = field;
  const { label } = appConfig.facets.find(
    ({ field }) => field === facetField,
  ) || { label: field?.trim() };

  const clusterIcons = appConfig.contentUtilsParams.clusterIcons;
  const getClusterIcon = (title) => {
    return clusterIcons[title]?.icon || clusterIcons.fallback.icon;
  };

  return (
    <div className={`filter-list-item ${customClass ? customClass : ''}`}>
      <div className="filter-name">
        {!noTitle ? `${label}${type !== 'none' ? ` (${type})` : ''}:` : null}
      </div>
      <Label.Group>
        {values?.map((v, index) => {
          return (
            <Label key={index}>
              <span className="text" title={v}>
                {label === 'Content types' ? (
                  <Icon name={getClusterIcon(v)} />
                ) : null}
                <FilterValue
                  value={v}
                  field={field}
                  type={type}
                  appConfig={appConfig}
                  registry={registry}
                />
              </span>
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
