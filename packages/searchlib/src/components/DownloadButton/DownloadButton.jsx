import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { withSearch } from '@elastic/react-search-ui';

const DownloadButton = (props) => {
  const { searchTerm, filters } = props.searchContext;
  return (
    <Form>
      <input
        type="hidden"
        name="query"
        value={JSON.stringify({ searchTerm, filters })}
      />

      <Button>Download</Button>
    </Form>
  );
};

export default withSearch((context) => ({ searchContext: context }))(
  DownloadButton,
);
