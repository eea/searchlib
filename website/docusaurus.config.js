/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'EEA Searchlib',
  tagline: 'Search library on top of ElasticSearch',
  url: 'https://eea.europa.eu',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'eea', // Usually your GitHub org/user name.
  projectName: 'searchlib', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Searchlib',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Searchlib UI',
        },
        {type: 'doc', docId: 'harvester', label: 'Harvester', position: 'left'},
        {type: 'doc', docId: 'indexing', label: 'Indexing', position: 'left'},
        {type: 'doc', docId: 'semanticsearch', label: 'Semantic Search Service', position: 'left'},
        {
          href: 'https://github.com/eea/searchlib',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Searchlib UI',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Github',
              href: 'https://github.com/eea/searchlib',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} EEA. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/eea/searchlib/edit/main/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/main/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
