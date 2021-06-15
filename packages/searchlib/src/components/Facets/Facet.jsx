import React from 'react';
import { withSearch, Facet as SUIFacet } from '@elastic/react-search-ui';
import { Accordion, Icon } from 'semantic-ui-react';

const FacetComponent = (props) => {
  // console.log('sui props', props);
  const { collapsable = true, filters = [], field, label } = props;
  const hasFilter = !!filters.find((filter) => field === filter.field);
  const [isOpened, setIsOpened] = React.useState(hasFilter);

  return collapsable ? (
    <Accordion>
      <Accordion.Title active={isOpened} onClick={() => setIsOpened(!isOpened)}>
        <Icon name="dropdown" />
        {label}
      </Accordion.Title>
      <Accordion.Content active={isOpened}>
        <SUIFacet {...props} />
      </Accordion.Content>
    </Accordion>
  ) : (
    <SUIFacet {...props} />
  );
};

const Facet = withSearch(
  ({ filters, facets, addFilter, removeFilter, setFilter, a11yNotify }) => ({
    filters,
    facets,
    addFilter,
    removeFilter,
    setFilter,
    a11yNotify,
  }),
)(FacetComponent);

export default Facet;