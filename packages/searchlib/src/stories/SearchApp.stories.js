import SearchApp from '@eeacms/search/SearchApp';
import '@eeacms/search/index.css';

const page = {
  title: 'Search/Demo',
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

const Template = (args) => <SearchApp {...args} />;

export const WiseDemo = Template.bind({});
// WiseDemo.args = {
//   appName: 'wise',
// };
