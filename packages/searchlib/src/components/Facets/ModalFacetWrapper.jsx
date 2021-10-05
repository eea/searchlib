import React from 'react';
import { withSearch, Facet as SUIFacet } from '@elastic/react-search-ui';
import { Card, Modal, Button, Header, Image } from 'semantic-ui-react';
import MultiCheckboxFacet from './MultiCheckboxFacet';
// import { useAtom } from 'jotai';
// import { openFacetsAtom } from './state';
// import { useUpdateAtom } from 'jotai/utils';

const FacetWrapperComponent = (props) => {
  const { filters = [], field, label } = props;
  const [isOpened, setIsOpened] = React.useState();

  return (
    <>
      <Modal
        onClose={() => setIsOpened(false)}
        onOpen={() => setIsOpened(true)}
        open={isOpened}
        trigger={
          <Card fluid raised header={label} onClick={() => {}} meta={123} />
        }
      >
        <Modal.Header>{field}</Modal.Header>
        <Modal.Content image>
          <SUIFacet
            {...props}
            active={isOpened}
            view={props.view || MultiCheckboxFacet}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => setIsOpened(false)}>
            Nope
          </Button>
          <Button
            content="Yep, that's me"
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
