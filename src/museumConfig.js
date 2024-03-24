const config = {
  CASM: {
    feature: {
      checkList: {
        content: [
          {
            type: 'links or buttons section',
            for: 'location',
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
            type: 'text section',
            for: 'highlights',
            settings: {
              title: { en: 'Highlights:', fr: 'Highlights (FR):' },
              collapsable: false,
            },
          },
          {
            type: 'media gallery section',
            for: 'image-gallery',
            settings: {
              title: { en: 'Image Gallery:', fr: 'Image Gallery (FR):' },
              collapsable: false,
              descriptionMinimumLength: 30,
            },
          },
          {
            type: 'text section',
            for: 'history',
            settings: {
              title: { en: 'History:', fr: 'History (FR):' },
              collapsable: false,
            },
          },
          {
            type: 'text section',
            for: 'provenance',
            settings: {
              title: { en: 'Provenance:', fr: 'Provenance (FR)' },
              collapsable: false,
            },
          },
          {
            type: 'text section',
            for: 'technical-information',
            settings: {
              title: {
                en: 'Technical Information:',
                fr: 'Technical Information(FR): ',
              },
              collapsable: false,
            },
          },
          {
            type: 'single media section',
            for: 'airplane-model',
            settings: {
              title: undefined,
              collapsable: false,
            },
          },
        ],
      },
    },
    api: {
      baseUrl: 'https://app.mytoursapp.com/api/v3/',
      auth: {
        username: '8919',
        password: 'f313a575-e87e-45b4-88ef-43445071f0da',
        legacy_app_id: '9403',
      },
      headers: {
        HTTP_STQRY_PROJECT_TYPE: 'app',
      },
      endPoints: {
        rootProject: 'project',
        project: 'project/manifest',
        collections: 'collections/:id/:language/:version/',
        screens: 'screens/:id/:language/:version',
        media_items: 'media_items/:id',
      },
    },
    languages: [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'French' },
    ],
  },
  MUSEUM2: {},
  MUSEUM3: {},
};

// const config1 = [
//   {
//     name: 'CASM',
//     config: [
//       {
//         name: 'check list',
//         content: [
//           {
//             type: 'link',
//             settings: {
//               screen: 'self', //or could be url: 'self'
//               title: undefined,
//               icon: {
//                 type: 'solid',
//                 name: 'location-dot',
//               },
//             },
//           },
//           {
//             type: 'text',
//             settings: {
//               title: 'Highlights:',
//               collapsable: false,
//             },
//           },
//           {
//             type: 'image gallery',
//             settings: {
//               title: 'Image Gallery:',
//               collapsable: false,
//             },
//           },
//           {
//             type: 'text',
//             settings: {
//               title: 'History:',
//               collapsable: false,
//             },
//           },
//           {
//             type: 'text',
//             settings: {
//               title: 'Provenance:',
//               collapsable: false,
//             },
//           },
//           {
//             type: 'text',
//             settings: {
//               title: 'Technical Information:',
//               collapsable: false,
//             },
//           },
//           {
//             type: 'single media section',
//             settings: {
//               title: undefined,
//               collapsable: false,
//             },
//           },
//         ],
//       },
//       {},
//       {},
//     ],
//   },
//   {
//     name: 'MUSEUM #2',
//     config: [{}, {}, {}],
//   },
//   {
//     name: 'MUSEUM #3',
//     config: [{}, {}, {}],
//   },
// ];

export default config;
