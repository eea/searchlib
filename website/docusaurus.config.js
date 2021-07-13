/** @type {import('@docusaurus/types').DocusaurusConfig} */

module.exports = {
  title: 'EEA Semantic Search Service',
  tagline: 'Semantic Search Service powered by ElasticSearch',
  url: 'https://eea.europa.eu',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'eea', // Usually your GitHub org/user name.
  projectName: 'searchlib', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Semantic Search',
      logo: {
        alt: 'Semantic Search Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'searchlib-ui/intro',
          position: 'left',
          label: 'Searchlib UI',
        },
        {
          type: 'doc',
          docId: 'harvesting/intro',
          label: 'Harvester',
          position: 'left',
        },
        { type: 'doc', docId: 'indexing', label: 'Indexing', position: 'left' },
        {
          type: 'doc',
          docId: 'deployment/intro',
          label: 'Deployment',
          position: 'left',
        },
        {
          type: 'doc',
          docId: 'quickaccess',
          label: 'Quick access',
          position: 'left',
        },
        {
          href: '/ecosystem',
          label: 'Services diagram',
          position: 'left',
        },
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
            // {
            //   label: 'Searchlib UI',
            //   to: 'searchlib-ui',
            // },
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
          editUrl: 'https://github.com/eea/searchlib/edit/main/website/',
        },
        blog: {
          showReadingTime: true,
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
