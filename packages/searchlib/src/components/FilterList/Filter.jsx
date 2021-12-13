import React from 'react';
import FilterValue from './FilterValue';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { Icon } from '@eeacms/search/components';
import { Label, Icon as UiIcon } from 'semantic-ui-react';

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

  // console.log('props', props);
  // const clusterIcons = appConfig.contentUtilsParams.clusterIcons;
  // const getClusterIcon = (title) => {
  //   return clusterIcons[title]?.icon || clusterIcons.fallback.icon;
  // };
  //{label === 'Content types' ? (
  //  <Icon name={getClusterIcon(v)} />
  //) : null}

  return (
    <div className={`filter-list-item ${customClass ? customClass : ''}`}>
      <div className="filter-name">
        {!noTitle ? `${label}${type !== 'none' ? ` (${type})` : ''}:` : null}
      </div>
      <Label.Group>
        {values?.map((v, index) => {
          const facetConfig =
            appConfig.facets.find((facet) => facet.field === field) || {};
          const { iconsFamily } = facetConfig;
          // console.log(facetConfig, iconsFamily, v);
          return (
            <Label
              key={index}
              onClick={() => {
                return values.length === 1
                  ? onClear(field)
                  : removeFilter(field, v, type);
              }}
            >
              <span className="text filterValue" title={v}>
                {iconsFamily && <Icon family={iconsFamily} type={v} />}
                <FilterValue
                  value={v}
                  field={field}
                  type={type}
                  appConfig={appConfig}
                  registry={registry}
                />
              </span>
              <UiIcon name="delete" />
            </Label>
          );
        })}
      </Label.Group>
    </div>
  );
};

export default Filter;
