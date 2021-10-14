import React from 'react';

import { Button } from 'semantic-ui-react';
import { useAtom } from 'jotai';
import { showFacetsAsideAtom } from './../../state';

import './tiles.less';

const getFacetConfig = (facets, name) => {
  return facets.find((facet) => facet.field === name);
};

const LandingPage = (props) => {
  const { appConfig, facets, children, setFilter } = props;
  const facetsConfig = appConfig.facets;

  const {
    sections = [],
    maxPerSection = 12,
  } = appConfig.initialView.tilesLandingPageParams;
  const [activeSection, setActiveSection] = React.useState(
    sections?.[0]?.facetField,
  );

  const tiles =
    facets?.[activeSection]?.[0]?.data?.slice(0, maxPerSection) || [];

  const [, setShowFacets] = useAtom(showFacetsAsideAtom);

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
                  <div className="header">{topic.value}</div>
                </div>
                <div className="extra content">
                  <span className="count">{topic.count}</span>
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
