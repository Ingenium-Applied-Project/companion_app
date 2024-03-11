const config = [
  {
    name: 'CASM',
    config: [
      {
        name: 'check list',
        content: [
          {
            type: 'link',
            settings: {
              screen: 'self', //or could be url: 'self'
              title: undefined,
              icon: {
                type: 'solid',
                name: 'location-dot',
              },
            },
          },
          {
            type: 'text',
            settings: {
              title: 'Highlights:',
              collapsable: false,
            },
          },
          {
            type: 'image gallery',
            settings: {
              title: 'Image Gallery:',
              collapsable: false,
            },
          },
          {
            type: 'text',
            settings: {
              title: 'History:',
              collapsable: false,
            },
          },
          {
            type: 'text',
            settings: {
              title: 'Provenance:',
              collapsable: false,
            },
          },
          {
            type: 'text',
            settings: {
              title: 'Technical Information:',
              collapsable: false,
            },
          },
          {
            type: 'single media section',
            settings: {
              title: undefined,
              collapsable: false,
            },
          },
        ],
      },
      {},
      {},
    ],
  },
  {
    name: 'MUSEUM #2',
    config: [{}, {}, {}],
  },
  {
    name: 'MUSEUM #3',
    config: [{}, {}, {}],
  },
];

export default config;
