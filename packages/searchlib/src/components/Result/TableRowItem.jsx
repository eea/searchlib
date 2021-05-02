import React from 'react';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { Table } from 'semantic-ui-react';

const WrappedRowItem = (props) => {
  const { appConfig } = useAppConfig();
  const { tableViewParams } = appConfig;
  const { result } = props;
  return (
    <Table.Row>
      {tableViewParams.columns.map((col, index) => (
        <Table.Cell key={index}>{result[col.field].raw}</Table.Cell>
      ))}
    </Table.Row>
  );
};

const TableRowItem = (props) => <WrappedRowItem {...props} />;

export default TableRowItem;
