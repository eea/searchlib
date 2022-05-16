/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  sidebar: [
    {
      type: 'category',
      label: 'Searchlib UI',
      items: [{ type: 'autogenerated', dirName: 'searchlib-ui' }],
    },
    {
      type: 'category',
      label: 'Harvester',
      items: [{ type: 'autogenerated', dirName: 'harvesting' }],
    },
    {
      type: 'category',
      label: 'EEA NLPService',
      items: [{ type: 'autogenerated', dirName: 'nlpservice' }],
    },
    {
      type: 'category',
      label: 'Deployment',
      items: [{ type: 'autogenerated', dirName: 'deployment' }],
    },
  ],
};
