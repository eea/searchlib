import SearchApp from '@eeacms/search';

const page = {
  title: 'Search/Demo',
  component: SearchApp,
};
export default page;

const Template = (args) => <SearchApp {...args} />;

export const WiseDemo = Template.bind({});
WiseDemo.args = {
  appName: 'wise',
};
