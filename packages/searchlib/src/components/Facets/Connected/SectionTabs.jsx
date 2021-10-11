import React from 'react';
import { useSearchContext, useAppConfig } from '@eeacms/search/lib/hocs';
import { Menu } from 'semantic-ui-react';

const SectionTabs = (props) => {
  const searchContext = useSearchContext();
  const { appConfig } = useAppConfig();
  const { contentSectionsParams = {} } = appConfig;
  if (!contentSectionsParams.enable) return null;

  const { facets = {}, filters = [] } = searchContext;
  const facetField = contentSectionsParams.sectionFacetsField;
  const sections = facets?.[facetField]?.[0]?.data || [];
  const activeFilter = filters.find(({ field }) => field === facetField) || {};
  let activeValues = activeFilter.values || [];
  if (!Array.isArray(activeValues)) {
    activeValues = [activeValues];
  }
  const allCount = sections.reduce((acc, { count }) => acc + count, 0);

  return (
    <Menu className="content-section-tabs">
      <Menu.Item
        onClick={() => {
          searchContext.removeFilter(facetField, '', 'any');
        }}
        active={activeValues.length === 0}
      >
        {`All (${allCount})`}
      </Menu.Item>
      {sections.map(({ value, count }) => (
        <Menu.Item
          key={value}
          active={activeValues.includes(value)}
          onClick={() => {
            searchContext.setFilter(facetField, value, 'any');
          }}
        >
          <span className="title">{value}</span>
          <span className="count">({count})</span>
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default SectionTabs;