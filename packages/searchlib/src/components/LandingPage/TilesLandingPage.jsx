import React from 'react';

import { Button } from 'semantic-ui-react';

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

  return (
    <div className="landing-page-container">
      <div className="landing-page">
        <h3 class="browse-by">Browse by</h3>

        <div className="filters">
          {sections.map((section) => {
            return (
              <Button
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
        <div class="ui cards">
          {tiles.map((topic) => {
            const onClickHandler = () => {
              setFilter(
                activeSection,
                topic.value,
                getFacetConfig(facetsConfig, activeSection).filterType,
              );
            };
            return (
              <div
                tabindex="-1"
                role="button"
                onKeyDown={onClickHandler}
                class="ui card"
                key={topic.facetField}
                onClick={onClickHandler}
              >
                <div class="content">
                  <div class="header">{topic.value}</div>
                </div>
                <div class="extra content">{topic.count}</div>
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
