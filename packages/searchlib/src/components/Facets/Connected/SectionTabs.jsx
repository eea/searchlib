/**
 * A component to render the content clusters
 */

import React from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';
import { Icon } from '@eeacms/search/components';
import { useAtom } from 'jotai';

import {
  useWindowDimensions,
  useSearchContext,
  useAppConfig,
  useViews,
} from '@eeacms/search/lib/hocs';
import { isLandingPageAtom } from '@eeacms/search/state';

const cmp = (a, b) => (a > b ? 1 : a === b ? 0 : a < b ? -1 : 0);

const SectionTabs = (props) => {
  const { width } = useWindowDimensions();
  const searchContext = useSearchContext();
  const { appConfig } = useAppConfig();
  const [isLandingPage] = useAtom(isLandingPageAtom);
  const views = useViews();

  const { contentSectionsParams = {} } = appConfig;
  if (!contentSectionsParams.enable || isLandingPage) return null;

  const { facets = {}, filters = [] } = searchContext;
  const facetField = contentSectionsParams.sectionFacetsField;

  const sectionOrder = contentSectionsParams.sections.map(({ name }) => name);

  let sections = facets?.[facetField]?.[0]?.data || [];
  const activeFilter = filters.find(({ field }) => field === facetField) || {};
  let activeValues = activeFilter.values || [];
  if (!Array.isArray(activeValues)) {
    activeValues = [activeValues];
  }

  const sectionMapping = Object.assign(
    {},
    ...contentSectionsParams.sections.map((s) => ({ [s.name]: s })),
  );

  const allCount =
    sections.filter((section) => {
      return section.value === '_all_';
    })?.[0]?.count || sections.reduce((acc, { count }) => acc + count, 0);

  sections = sections.filter((section) => section.value !== '_all_');
  sections.sort((s1, s2) =>
    cmp(sectionOrder.indexOf(s1.value), sectionOrder.indexOf(s2.value)),
  );

  const tabSize = (title) => {
    return title.length * 10 + 120;
  };
  const noLeftCol = width < 770 ? 150 : 0;
  const tolerance = 230 - noLeftCol;

  let visibleSections = [];
  let hiddenSections = [];
  let totalWidth = 0;
  for (let section of sections) {
    let tabS = tabSize(section.value);
    totalWidth += tabS;

    if (totalWidth + tolerance > width) {
      section.hidden = true;
      hiddenSections.push(section);
    } else {
      section.hidden = false;
      visibleSections.push(section);
    }
  }
  const enableFeature = false; // WIP use it to test the partial solution

  if (enableFeature) {
    sections = visibleSections;
  }

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
      {sections.map(({ value, count }) => (
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
          <Icon type={value} family="Content types" />
          <span className="title">{value}</span>
          <span className="count">({count})</span>
        </Menu.Item>
      ))}
      {enableFeature && hiddenSections.length > 0 && (
        <Dropdown item text="More">
          <Dropdown.Menu>
            {hiddenSections.map(({ value, count }) => (
              <Dropdown.Item
                key={value}
                active={activeValues.includes(value)}
                onClick={() => {
                  searchContext.setFilter(facetField, value, 'any');
                  views.setActiveViewId(
                    sectionMapping[value].defaultResultView || 'listing',
                  );
                }}
              >
                <Icon type={value} family="Content types" />
                <span className="title">{value}</span>
                <span className="count">({count})</span>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </Menu>
  );
};

export default SectionTabs;
