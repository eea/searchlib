import React from 'react';
import { withSearch, Facet as SUIFacet } from '@elastic/react-search-ui';
import { Accordion, Icon } from 'semantic-ui-react';
import MultiCheckboxFacet from './MultiCheckboxFacet';
import { useAtom } from 'jotai';
import { openFacetsAtom } from './state';

const FacetWrapperComponent = (props) => {
  const { collapsable = true, filters = [], field, label } = props;
  const hasFilter = !!filters.find((filter) => field === filter.field);
  const [openFacets, updateOpenFacets] = useAtom(openFacetsAtom);

  React.useEffect(() => {
    if (hasFilter && !openFacets.includes(field)) {
      updateOpenFacets([...openFacets, field]);
    }
  }, [hasFilter, field, openFacets, updateOpenFacets]);

  const isOpened = openFacets.indexOf(field) > -1;

  return collapsable ? (
    <Accordion>
      <Accordion.Title
        active={isOpened}
        onClick={() =>
          updateOpenFacets(
            isOpened
              ? openFacets.filter((f) => f !== field)
              : [...openFacets, field],
          )
        }
      >
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
