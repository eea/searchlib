import React from 'react';
import { withSearch, Facet as SUIFacet } from '@elastic/react-search-ui';
import { Accordion, Icon } from 'semantic-ui-react';
import MultiCheckboxFacet from './MultiCheckboxFacet';

const FacetWrapperComponent = (props) => {
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
        <SUIFacet
          {...props}
          active={isOpened}
          view={props.view || MultiCheckboxFacet}
        />
      </Accordion.Content>
    </Accordion>
  ) : (
    <SUIFacet {...props} />
  );
};

const FacetWrapper = withSearch(
  ({ filters, facets, addFilter, removeFilter, setFilter, a11yNotify }) => ({
    filters,
    facets,
    addFilter,
    removeFilter,
    setFilter,
    a11yNotify,
  }),
)(FacetWrapperComponent);

export default FacetWrapper;