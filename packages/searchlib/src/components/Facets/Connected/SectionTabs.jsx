import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { useAtom } from 'jotai';

import {
  useSearchContext,
  useAppConfig,
  useViews,
} from '@eeacms/search/lib/hocs';
import { isLandingPageAtom } from '@eeacms/search/state';

const cmp = (a, b) => (a > b ? 1 : a === b ? 0 : a < b ? -1 : 0);

const SectionTabs = (props) => {
  const searchContext = useSearchContext();
  const { appConfig } = useAppConfig();
  const [isLandingPage] = useAtom(isLandingPageAtom);
  const views = useViews();

  const { contentSectionsParams = {} } = appConfig;
  if (!contentSectionsParams.enable || isLandingPage) return null;

  const { facets = {}, filters = [] } = searchContext;
  const facetField = contentSectionsParams.sectionFacetsField;

  const sectionOrder = contentSectionsParams.sections.map(({ name }) => name);
  // console.log(contentSectionsParams);

  let sections = facets?.[facetField]?.[0]?.data || [];
  const activeFilter = filters.find(({ field }) => field === facetField) || {};
  let activeValues = activeFilter.values || [];
  if (!Array.isArray(activeValues)) {
    activeValues = [activeValues];
  }

  sections = sections.map((section) => {
    section.icon = contentSectionsParams.icons[section.value];
    return section;
  });

  const sectionMapping = Object.assign(
    {},
    ...contentSectionsParams.sections.map((s) => ({ [s.name]: s })),
  );

  const allCount =
    sections.filter((section) => {
      return section.value === '_all_';
    })?.[0]?.count || sections.reduce((acc, { count }) => acc + count, 0);

  sections = sections.filter((section) => section.value !== '_all_');
  // console.log('sections', sections);
  sections.sort((s1, s2) =>
    cmp(sectionOrder.indexOf(s1.value), sectionOrder.indexOf(s2.value)),
  );

  return (
    <Menu className="content-section-tabs">
      <Menu.Item
        onClick={() => {
          searchContext.removeFilter(facetField, '', 'any');
          views.reset();
        }}
        active={activeValues.length === 0}
      >
        {`All (${allCount})`}
      </Menu.Item>
      {sections.map(({ value, count, icon }) => (
        <Menu.Item
          key={value}
          active={activeValues.includes(value)}
          onClick={() => {
            searchContext.setFilter(facetField, value, 'any');
            views.setActiveViewId(
              sectionMapping[value].defaultResultView || 'listing',
            );
          }}
        >
          {icon !== undefined && <Icon name={icon} />}
          <span className="title">{value}</span>
          <span className="count">({count})</span>
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default SectionTabs;
