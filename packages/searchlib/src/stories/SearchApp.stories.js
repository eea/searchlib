import React from 'react';
import { SearchApp } from '@eeacms/search';
import config from '@eeacms/search/registry';
import installDemo from 'demo/src/demo';

import '@elastic/react-search-ui-views/lib/styles/styles.css';
import 'demo/src/semantic-ui.less';

const page = {
  title: 'Search UI/Demos',
  component: SearchApp,
  args: {
    appName: 'wise',
  },
  argTypes: {
    appName: {
      control: {
        type: 'select',
        options: ['wise', 'minimal'],
      },
    },
    debug: {
      control: {
        type: 'boolean',
      },
    },
  },
};
export default page;

const Template = (args) => {
  const registry = installDemo(config);
  return <SearchApp registry={registry} {...args} />;
};

export const Full = Template.bind({});
// WiseDemo.args = {
//   appName: 'wise',
// };
