import React from 'react';
import { useSearchContext, useAppConfig } from '@eeacms/search/lib/hocs';
import { Menu } from 'semantic-ui-react';

const SectionTabs = (props) => {
  const context = useSearchContext();
  const { appConfig } = useAppConfig();
  const { contentSectionsParams = {} } = appConfig;
  if (!contentSectionsParams.enable) return null;

  const facetField = contentSectionsParams.sectionFacetsField;
  const sections = context.facets?.[facetField]?.[0]?.data || [];
  // const activeFilter = context.filters;
  // console.log('context', context);

  return (
    <Menu className="content-section-tabs">
      {sections.map(({ value, count }) => (
        <Menu.Item
          key={value}
          onClick={() => {
            context.setFilter(facetField, value, 'any');
          }}
        >
          <span>{value}</span>
          <span>({count})</span>
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default SectionTabs;
