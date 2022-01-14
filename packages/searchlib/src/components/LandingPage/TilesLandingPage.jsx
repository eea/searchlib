import React from 'react';

import { Button } from 'semantic-ui-react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useAtom } from 'jotai';

import { showFacetsAsideAtom } from '@eeacms/search/state';
import { getDisjunctiveFacetCounts } from '@eeacms/search';
import buildStateFacets from '@eeacms/search/lib/search/state/facets';
import { landingPageDataAtom } from './state';
import { Icon, Term } from '@eeacms/search/components';

import './tiles.less';

const getFacetConfig = (sections, name) => {
  return sections?.find((facet) => facet.facetField === name);
};

const LandingPage = (props) => {
  const { appConfig, children, setFilter, setSort } = props;
  // const facetsConfig = appConfig.facets;

  const {
    sections = [],
    maxPerSection = 12,
    sortField,
    sortDirection,
  } = appConfig.initialView.tilesLandingPageParams;

  const sectionFacetFields = sections.map((s) => s.facetField);
  const [activeSection, setActiveSection] = React.useState(
    sections?.[0]?.facetField,
  );

  const [, setShowFacets] = useAtom(showFacetsAsideAtom);

  const [landingPageData, setLandingPageData] = useAtom(landingPageDataAtom);

  const getTiles = (maxPerSection) => {
    const result = landingPageData?.[activeSection]?.[0]?.data || [];
    let shorted = false;
    if (result.length > maxPerSection) {
      shorted = true;
    }
    return [shorted, result.slice(0, maxPerSection)];
  };

  const [shorted, tiles] = getTiles(maxPerSection);

  useDeepCompareEffect(() => {
    async function fetchFacets() {
      let facets;

      if (!landingPageData) {
        const state = {
          filters: sections
            ?.filter((f) => f.filterType === 'any:exact')
            .map(({ facetField, filterType = 'any' }) => ({
              field: facetField,
              values: [],
              type: filterType,
            })),
        };
        const disjunctiveFacetCounts = await getDisjunctiveFacetCounts(
          state,
          appConfig,
          sectionFacetFields,
          true,
        );
        facets = buildStateFacets(disjunctiveFacetCounts, appConfig);
      }

      if (!landingPageData && facets) {
        setLandingPageData(facets);
      }
    }
    if (!landingPageData) {
      fetchFacets();
    }
  }, [
    appConfig,
    sectionFacetFields,
    landingPageData,
    setLandingPageData,
    sections,
  ]);

  return (
    <div className="landing-page-container">
      <div className="landing-page">
        <h3 className="browse-by">Browse by</h3>

        <div className="filters">
          {sections.map((section) => {
            return (
              <Button
                key={section.facetField}
                toggle
                active={activeSection === section.facetField}
                className="ui button"
                onClick={() => setActiveSection(section.facetField)}
              >
                {section.title}
              </Button>
            );
          })}
        </div>
        <div className="ui cards">
          {tiles.map((topic) => {
            const onClickHandler = () => {
              setFilter(
                activeSection,
                topic.value,
                getFacetConfig(sections, activeSection).filterType || 'any',
              );
              setSort(sortField, sortDirection);
              setShowFacets(true);
            };

            return (
              <div
                key={topic.value}
                tabIndex="-1"
                role="button"
                onKeyDown={onClickHandler}
                className="ui card"
                onClick={onClickHandler}
              >
                <div className="content">
                  <div className="header">
                    {activeSection === 'objectProvides' ? (
                      <Icon family="Content types" type={topic.value} />
                    ) : null}
                    {activeSection === 'cluster_name' ? (
                      <Icon
                        family="Sources"
                        type={topic.value}
                        className="facet-option-icon"
                      />
                    ) : null}
                    {activeSection === 'spatial' ? (
                      <Icon
                        country={topic.value}
                        className="facet-option-icon"
                      />
                    ) : null}
                    <Term term={topic.value} field={activeSection} />
                  </div>
                </div>
                <div className="extra content">
                  <span className="count">
                    {topic.count} {topic.count === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {shorted ? (
          <div className="info">
            <p>Only first {maxPerSection} items are displayed.</p>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
};

export default LandingPage;
