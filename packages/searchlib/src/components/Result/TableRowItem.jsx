import React from 'react';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { Table } from 'semantic-ui-react';
import { Header } from './ResultModal';

const normalizeStr = (str) => {
  let tmp = document.createElement('DIV');
  tmp.innerHTML = str;
  str = tmp.textContent || tmp.innerText || '';
  return str;
};

const WrappedRowItem = (props) => {
  const { appConfig } = useAppConfig();
  const { tableViewParams } = appConfig;
  const { result } = props;

  return (
    <Table.Row>
      {tableViewParams.columns.map((col, index) => (
        <Table.Cell key={index}>
          {index === 0 ? (
            <div>
              <Header {...props} {...tableViewParams} appConfig={appConfig} />
            </div>
          ) : (
            normalizeStr(
              Array.isArray(result[col.field]?.raw)
                ? result[col.field]?.raw.sort().join(', ')
                : result[col.field]?.raw || '',
            )
          )}
        </Table.Cell>
      ))}
    </Table.Row>
  );
};

const TableRowItem = (props) => <WrappedRowItem {...props} />;

export default TableRowItem;
