import React from 'react';

import { Button } from 'semantic-ui-react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useAtom } from 'jotai';

import { showFacetsAsideAtom } from '@eeacms/search/state';
import { getDisjunctiveFacetCounts } from '@eeacms/search';
import buildStateFacets from '@eeacms/search/lib/search/state/facets';
import { landingPageDataAtom } from './state';
import { Icon } from '@eeacms/search/components';

import './tiles.less';

const getFacetConfig = (facets, name) => {
  return facets.find((facet) => facet.field === name);
};

const LandingPage = (props) => {
  const { appConfig, children, setFilter } = props;
  const facetsConfig = appConfig.facets;

  const {
    sections = [],
    maxPerSection = 12,
    clusterIcons = {},
  } = appConfig.initialView.tilesLandingPageParams;

  const sectionFacetFields = sections.map((s) => s.facetField);
  const [activeSection, setActiveSection] = React.useState(
    sections?.[0]?.facetField,
  );

  const getClusterIcon = (title) => {
    return clusterIcons[title]?.icon?.name || clusterIcons.fallback.name;
  };

  const [, setShowFacets] = useAtom(showFacetsAsideAtom);

  const [landingPageData, setLandingPageData] = useAtom(landingPageDataAtom);

  const tiles =
    landingPageData?.[activeSection]?.[0]?.data?.slice(0, maxPerSection) || [];

  useDeepCompareEffect(() => {
    async function fetchFacets() {
      let facets;

      if (!landingPageData) {
        const state = { filters: [] };
        const disjunctiveFacetCounts = await getDisjunctiveFacetCounts(
          state,
          appConfig,
          sectionFacetFields,
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
  }, [appConfig, sectionFacetFields, landingPageData, setLandingPageData]);

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
                getFacetConfig(facetsConfig, activeSection).filterType,
              );
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
                      <Icon
                        family="Content types"
                        name={getClusterIcon(topic.value)}
                      />
                    ) : null}
                    {activeSection === 'cluster_name' ? (
                      <Icon
                        family="Sources"
                        type={topic.value}
                        className="facet-option-icon"
                      />
                    ) : null}
                    {topic.value}
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
        {children}
      </div>
    </div>
  );
};
export default LandingPage;
