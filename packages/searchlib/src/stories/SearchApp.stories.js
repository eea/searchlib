import SearchApp from '@eeacms/search/SearchApp';
import config from '@eeacms/search/registry';
import installDemo from '@eeacms/search/demo';

import '@eeacms/search/index.css';
import '@eeacms/search/semantic-ui.less';

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
