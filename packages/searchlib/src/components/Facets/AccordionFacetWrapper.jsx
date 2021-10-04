import React from 'react';
import { withSearch, Facet as SUIFacet } from '@elastic/react-search-ui';
import { Accordion, Icon } from 'semantic-ui-react';
import MultiCheckboxFacet from './MultiCheckboxFacet';
import { useAtom } from 'jotai';
import { openFacetsAtom } from './state';
import { useUpdateAtom } from 'jotai/utils';

const FacetWrapperComponent = (props) => {
  const { collapsable = true, filters = [], field, label } = props;
  const hasFilter = !!filters.find((filter) => field === filter.field);
  const [openFacets] = useAtom(openFacetsAtom);
  const updateOpenFacets = useUpdateAtom(openFacetsAtom);

  React.useEffect(() => {
    let temp = openFacets;
    if (hasFilter && !(field in openFacets)) {
      temp[field] = { opened: true };
    } else {
      if (!(field in openFacets)) {
        temp[field] = { opened: false };
      }
    }
    updateOpenFacets(temp);
  }, [hasFilter, field, openFacets, updateOpenFacets]);

  let isOpened = openFacets[field]?.opened || false;
  const [counter, setCounter] = React.useState(0);

  return collapsable ? (
    <Accordion>
      <Accordion.Title
        active={isOpened}
        onClick={() => {
          setCounter(counter + 1); // Force render
          let temp = openFacets;
          if (isOpened) {
            temp[field] = { opened: false };
            isOpened = false;
          } else {
            temp[field] = { opened: true };
            isOpened = true;
          }
          updateOpenFacets(temp);
        }}
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
