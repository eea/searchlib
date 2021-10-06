import React from 'react';
import { withSearch, Facet as SUIFacet } from '@elastic/react-search-ui';
import { Card, Modal, Button } from 'semantic-ui-react'; // , Header, Image
import MultiCheckboxFacet from './MultiCheckboxFacet';
import { useAppConfig } from '@eeacms/search/lib/hocs';

const getFacetTotalCount = (facets, name) => {
  return facets?.[name]?.[0]?.data?.reduce((acc, { count }) => acc + count, 0);
};

const FacetWrapperComponent = (props) => {
  const { filters = [], facets = {}, field, label } = props;
  const [isOpened, setIsOpened] = React.useState();
  const isActive = filters.find((f) => f.field === field);
  const { appConfig } = useAppConfig();
  const facetConfig = appConfig.facets.find((f) => f.field === field);

  return (
    <>
      <Modal
        onClose={() => setIsOpened(false)}
        onOpen={() => setIsOpened(true)}
        open={isOpened}
        trigger={
          <Card
            fluid
            header={label}
            color={isActive && 'red'}
            onClick={() => {}}
            meta={getFacetTotalCount(facets, field)}
          />
        }
      >
        <Modal.Header>{facetConfig?.title || field}</Modal.Header>
        <Modal.Content image>
          <SUIFacet
            {...props}
            active={isOpened}
            view={props.view || MultiCheckboxFacet}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => setIsOpened(false)}>
            Cancel
          </Button>
          <Button
            content="Apply"
            labelPosition="right"
            icon="checkmark"
            onClick={() => setIsOpened(false)}
            positive
          />
        </Modal.Actions>
      </Modal>
    </>
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

// import { useAtom } from 'jotai';
// import { openFacetsAtom } from './state';
// import { useUpdateAtom } from 'jotai/utils';
// const hasFilter = !!filters.find((filter) => field === filter.field);
// const [openFacets] = useAtom(openFacetsAtom);
// const updateOpenFacets = useUpdateAtom(openFacetsAtom);
//
// React.useEffect(() => {
//   let temp = openFacets;
//   if (hasFilter && !(field in openFacets)) {
//     temp[field] = { opened: true };
//   } else {
//     if (!(field in openFacets)) {
//       temp[field] = { opened: false };
//     }
//   }
//   // updateOpenFacets(temp);
// }, [hasFilter, field, openFacets, updateOpenFacets]);
// let isOpened = openFacets[field]?.opened || false;
// const [counter, setCounter] = React.useState(0);
//   <Accordion.Title
//     active={isOpened}
//     onClick={() => {
//       setCounter(counter + 1); // Force render
//       let temp = openFacets;
//       if (isOpened) {
//         temp[field] = { opened: false };
//         isOpened = false;
//       } else {
//         temp[field] = { opened: true };
//         isOpened = true;
//       }
//       updateOpenFacets(temp);
//     }}
//   >
//     <Icon name="dropdown" />
//     {label}
//   </Accordion.Title>
//   <Accordion.Content active={isOpened}>
//     <SUIFacet
//       {...props}
//       active={isOpened}
//       view={props.view || MultiCheckboxFacet}
//     />
//   </Accordion.Content>
// </Accordion>
