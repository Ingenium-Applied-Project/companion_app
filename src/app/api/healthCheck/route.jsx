import {
  ApiConstants,
  HealthCheckErrorCodes,
  HealthCheckErrorDescriptions,
  StoryScreenTypes,
} from '@/constants/constants';
import config from '@/museumConfig';
import { extractTextFromHTML } from '@/utils/api/apiUtils';
import { writeDataToFile } from '@/utils/devUtils';
import { getErrorMessage } from '@/utils/utils';
import { NextResponse } from 'next/server';

/** GENERAL INFORMATION
 
  The Story API call uses Promise.all() .. Even if there is an error condition, the backend does not throw and error. 
  Instead, it "resolves" the promise with an error-code. This means the backend continues working on the successfully 
  retrieved screens. 

  A successful return for a screen is below: 
   {
          status: ApiConstants.success,
          item: ApiConstants.screen_health_check,
          id: id,
          version: version,
          error: null,
          data: screenObject,
    }
    data object above contains all the information about the story-object. It is an instance of the "Screen" or "Collection" object



  An error is handled with another object
  {
          status: ApiConstants.error,
          item: ApiConstants.screen_health_check,
          id: id,
          version: version,
          error: error,
          data: null,
          errorStatus: error.status,
  }
  As opposed to the success, this object has an error object with a non-null value, and its data object is null. 
*/

// Returns app config for CASM. Check museumConfig.js
const getConfig = (app = 'CASM') => {
  return config[app] || {};
};

// Used in the initial GET, in order to get initial access to STORY end point.
const getRequestHeaders = () => {
  const appConfig = getConfig();
  const { auth, headers } = appConfig.api;
  return {
    HTTP_STQRY_PROJECT_TYPE: headers.HTTP_STQRY_PROJECT_TYPE,
    Authorization: `Basic ${btoa(`${auth.username}:${auth.password}`)}`,
  };
};

// Used in further fetch requests to get more detailed access.
// Note that this  has a different username than getRequestHeaders function
const getLegacyAppRequestHeaders = () => {
  const appConfig = getConfig();
  const { auth, headers } = appConfig.api;
  return {
    HTTP_STQRY_PROJECT_TYPE: headers.HTTP_STQRY_PROJECT_TYPE,
    Authorization: `Basic ${btoa(`${auth.legacy_app_id}:${auth.password}`)}`,
  };
};

// placeholder for POST method (won't be needed)
export async function POST(req) {
  return NextResponse.json({ message: 'POST request processed' });
}

/**
  This method returns the health-check result. It returns only the screens that have problems. Here is step by step what it does

  - Makes an initial GET request for access. This returns all screen and collection entries from backend. 
    Both screen and collection objects are in this format: 
      {
        "id": 25352,
        "version": 1711427388
      },


  - by using the object array previously retrieved, it creates two promises:
      collectionsHealthCheckPromise: A promises that returns collection data as an array
      screensHealthCheckPromise: Another promise returning screen data as an array
    These two promises above uses the appConfig.languages array to make 2 calls per screen: One for english and one for French. 
    These promises return an array objects that's mentioned at the top of the code. 
    
    Whenever a screen detail is retrieved for the specified language (en, fr), the backend does the following:
     - It creates a "Screen" object. The constructor defines whether this is an audio-tour, an artifact screen, or a not-defined screen. 
     - once the object is created, check() method is called on the object and perform checks based on the screen type


 */

export async function GET(_) {
  const appConfig = getConfig();

  const { baseUrl, endPoints } = appConfig.api;
  const projectURL = baseUrl + endPoints.project;

  // first fetch (for initial access)
  // If the first fetch is successful, then the system starts fetching each collection and screen
  const requestHeaders = getRequestHeaders();

  try {
    const response = await fetch(projectURL, {
      method: 'GET',
      headers: requestHeaders,
    });

    // Handle the response as needed
    if (!response.ok) {
      throw new Error(
        `Failed to fetch project data. Status: ${response.status}`
      );
    }

    const responseData = await response.json();

    let { collections, screens } = responseData;

    // DEV-ONLY +
    // screens = screens.filter((screen) => screen.id === 252502);

    // await writeDataToFile(collections, 'raw-collections.json');
    // await writeDataToFile(screens, 'raw-screens.json');

    if (collections && 1 === 1) {
      // collections = collections.slice(0, 10);
    }

    //TODO: TEST for few elements only: Remove it later when the functionality is good
    if (screens && 1 === 1) {
      // screens = screens.slice(0, 30); //testing
    }
    // DEV-ONLY -

    const startTime = Date.now();
    const collectionsHealthCheckPromise =
      getCollectionsHealthCheckPromise(collections);
    const screensHealthCheckPromise = getScreensHealthCheckPromise(screens);

    const promiseResults = await Promise.all([
      collectionsHealthCheckPromise,
      screensHealthCheckPromise,
    ]);

    // DEV-ONLY +
    // await writeDataToFile(promiseResults[0], 'result-Collections.json');
    // await writeDataToFile(promiseResults[1], 'result-Screens.json');
    const endTime = Date.now();
    // console.log(`Elapsed time ${endTime - startTime} miliseconds`);
    // DEV-ONLY -

    // remove all  non-issues
    const badScreens = promiseResults[1].filter((screenResult) => {
      const { data } = screenResult;
      if (data) {
        const { healthReport } = data;
        if (healthReport) {
          if (Array.isArray(healthReport.reportItems)) {
            return healthReport.reportItems.length > 0;
          } else {
            return false;
          }
        }
      } else {
        // issue here
        // console.log('XXXX');
        // console.log(screenResult);
        return false;
      }

      return false;
    });

    // console.log('badScreens.count', badScreens.length);

    const badScreenResult = badScreens.map((badScreen) => {
      // console.log(badScreen);
      const { name = '', title = '' } = badScreen.data.data;

      const {
        screenViewUrl = '',
        screenEditUrl = '',
        healthReport = {},
        health_check_language,
      } = badScreen.data;

      // console.log('serdar', badScreen.data);

      const { id = '', version = '' } = badScreen;

      return {
        key: `${id}-${health_check_language}`,
        id: id,
        version: version,
        name: name,
        title: title,
        screenEditUrl: screenEditUrl,
        screenViewUrl: screenViewUrl,
        healthReport: healthReport.reportItems || [],
      };
    });

    return NextResponse.json({
      message: 'GET request processed',
      // responseData,
      responseData: badScreenResult,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.error(error);
  }
}

// Major promise to get collections health check
const getCollectionsHealthCheckPromise = (collections) => {
  const appConfig = getConfig();
  const { languages } = appConfig;
  return new Promise((resolve, _) => {
    if (!Array.isArray(languages) || !languages.length) {
      resolve([]);
    }

    if (Array.isArray(collections) && collections.length > 0) {
      const healthCheckPromiseArray = [];
      collections.forEach((collection) => {
        languages.forEach((lang) => {
          const { code } = lang;
          if (code) {
            collection.health_check_language = code;
            const promise = getCollectionPromise(collection);
            if (promise) {
              healthCheckPromiseArray.push(promise);
            }
          }
        });
      });

      Promise.all(healthCheckPromiseArray)
        .then((results) => {
          resolve(results);
        })
        .catch((_) => {
          resolve([]);
        });
    } else {
      resolve([]);
    }
  });
};

/*
getScreensHealthCheckPromise

- This function retrieves every screen from the story backend (based on given screen array)
- Each screen is fetched per language (one fetch for en, another for fr)
- Upon successful fetch, a "Screen" object is created and the "check()" function is called.
  check function compares object data against the checkList settings in museumConfig.js

- Once each screen is checked internally, this function would have a list of screens in both french and english
  So it also checks whether French and English content are same for the same content. If there is same text content, then
  then this creates an error report as well. 

*/
const getScreensHealthCheckPromise = (screens) => {
  const appConfig = getConfig();

  const { languages } = appConfig;

  return new Promise((resolve, _) => {
    if (!Array.isArray(languages) || !languages.length) {
      resolve([]);
    }

    // This array contains all the promises (where each promise indicates a screen in either french or english)
    // And they are fetched with a Promise.all() later
    const healthCheckPromiseArray = [];

    // Build the promise array
    if (Array.isArray(screens) && screens.length > 0) {
      screens.forEach((screen) => {
        languages.forEach((lang) => {
          const { code } = lang;
          if (code) {
            screen.health_check_language = code;
            const promise = getScreenPromise(screen);
            if (promise) {
              healthCheckPromiseArray.push(promise);
            }
          }
        });
      });

      Promise.all(healthCheckPromiseArray)
        .then((results) => {
          // When they are all fetched, the backend already knows which screen has which internal problem (such as missing text)
          // Now it is time to test to make sure English and French versions have different content

          if (Array.isArray(screens) && screens.length > 0) {
            screens.forEach((screen) => {
              // screenMultiLangArr contains different languages for the same screen
              const screenMultiLangArr = results.filter((result) => {
                return (
                  result.status === ApiConstants.success &&
                  result.id === screen.id
                );
              });

              // Loop through screens where we have the successful data
              // if the array has 3 screens, 1st screen is compared to 2nd and 3rd screen.
              // then the 2nd screen is only compared to 3rd screen.
              // Note that the Screen data is available in the .data property as you can see below
              if (screenMultiLangArr && !Array.isArray(screenMultiLangArr)) {
                for (let i = 0; i < screenMultiLangArr.length; i++) {
                  const page1 = screenMultiLangArr[i];
                  for (let j = i + 1; j < screenMultiLangArr.length; j++) {
                    const page2 = screenMultiLangArr[i];

                    let value1 = '';
                    let value2 = '';

                    // Hero image description must be unique per language
                    value1 = page1.data.cover_image.description || null;
                    value2 = page2.data.cover_image.description || null;
                    if (value1 && value2 && compareText(value1, value2)) {
                      // add an error to page 1
                      page1.addHealthCheckError({
                        severity: HEALTH_CHECK_SEVERITY.HIGH,
                        description: getErrorMessage(
                          HealthCheckErrorCodes.DUPLICATE_CONTENT_MULTI,
                          [
                            page1.data.name,
                            'Cover Image Description',
                            page1.health_check_language,
                            page2.health_check_language,
                          ]
                        ),
                      });
                      // add an error to page 2
                      page2.addHealthCheckError({
                        severity: HEALTH_CHECK_SEVERITY.HIGH,
                        description: getErrorMessage(
                          HealthCheckErrorCodes.DUPLICATE_CONTENT_MULTI,
                          [
                            page2.data.name,
                            'Cover Image Description',
                            page2.health_check_language,
                            page1.health_check_language,
                          ]
                        ),
                      });
                    }

                    // Check the square image description between languages
                    value1 = page1.data.cover_image_grid.description || null;
                    value2 = page2.data.cover_image_grid.description || null;
                    if (value1 && value2 && compareText(value1, value2)) {
                      // add an error to page 1
                      page1.addHealthCheckError({
                        severity: HEALTH_CHECK_SEVERITY.HIGH,
                        description: getErrorMessage(
                          HealthCheckErrorCodes.DUPLICATE_CONTENT_MULTI,
                          [
                            page1.data.name,
                            'Cover Square Image Description',
                            page1.health_check_language,
                            page2.health_check_language,
                          ]
                        ),
                      });

                      // add an error to page 2
                      page2.addHealthCheckError({
                        severity: HEALTH_CHECK_SEVERITY.HIGH,
                        description: getErrorMessage(
                          HealthCheckErrorCodes.DUPLICATE_CONTENT_MULTI,
                          [
                            page2.data.name,
                            'Cover Square Image Description',
                            page2.health_check_language,
                            page1.health_check_language,
                          ]
                        ),
                      });
                    }

                    // In Story platform, sections are indentical in order.
                    // If you remove a section, it is removed in the other language too.
                    // However, this is not the case for image galleries
                    // English image gallery can have 3 images, where as French might have 2 images.

                    // get all screen elements from two target page data
                    const sections1 = page1.data.sections;
                    const sections2 = page2.data.sections;

                    if (Array.isArray(sections1)) {
                      for (let idx = 0; idx < sections1.length; idx++) {
                        const section1Element = sections1[idx];
                        const section2Element = sections2[idx];

                        // if the current type is "text", different languages must have different content
                        if (section1Element.type === 'text') {
                          if (section1Element.body === section2Element.body) {
                            // add an error to page 1
                            page1.addHealthCheckError({
                              severity: HEALTH_CHECK_SEVERITY.HIGH,
                              description: getErrorMessage(
                                HealthCheckErrorCodes.DUPLICATE_CONTENT_MULTI,
                                [
                                  page1.data.name,
                                  section1Element.title || 'Not found',
                                  page1.health_check_language,
                                  page2.health_check_language,
                                ]
                              ),
                            });
                            // add an error to page 2
                            page2.addHealthCheckError({
                              severity: HEALTH_CHECK_SEVERITY.HIGH,
                              description: getErrorMessage(
                                HealthCheckErrorCodes.DUPLICATE_CONTENT_MULTI,
                                [
                                  page2.data.name,
                                  section2Element.title || 'Not found',
                                  page2.health_check_language,
                                  page1.health_check_language,
                                ]
                              ),
                            });
                          }
                        }

                        // if it is a media gallery, then the number of images can be different.
                        // And we know that each image must have a different Description, so images
                        // are compared one by one according to their array size.
                        if (section1Element.type === 'media_group') {
                          const section1Images = section1Element.section_items;
                          const section2Images = section2Element.section_items;

                          if (
                            Array.isArray(section1Images) &&
                            Array.isArray(section2Images)
                          ) {
                            section1Images.forEach((section1Img) => {
                              section2Images.forEach((section2Img) => {
                                const section1Description =
                                  section1Img.description;
                                const section2Description =
                                  section2Img.description;

                                if (
                                  section1Description &&
                                  section2Description
                                ) {
                                  if (
                                    section1Description === section2Description
                                  ) {
                                    // add an error to page 1
                                    page1.addHealthCheckError({
                                      severity: HEALTH_CHECK_SEVERITY.HIGH,
                                      description: getErrorMessage(
                                        HealthCheckErrorCodes.DUPLICATE_IMAGE_DESCRIPTION_MULTI,
                                        [
                                          page1.data.name,
                                          section1Images.name || 'Not found',
                                          page1.health_check_language,
                                          page2.health_check_language,
                                        ]
                                      ),
                                    });
                                    // add an error to page 2
                                    page2.addHealthCheckError({
                                      severity: HEALTH_CHECK_SEVERITY.HIGH,
                                      description: getErrorMessage(
                                        HealthCheckErrorCodes.DUPLICATE_IMAGE_DESCRIPTION_MULTI,
                                        [
                                          page2.data.name,
                                          section2Images.name || 'Not found',
                                          page2.health_check_language,
                                          page1.health_check_language,
                                        ]
                                      ),
                                    });
                                  }
                                }
                              });
                            });
                          }
                        }
                      }
                    }
                  }
                }
              }
            });
          }

          // having all the screen objects, resolve them all.
          // Note that we could have resolved only the ones with issues, but we don't know if we
          // are going to check additional stuff after this. So it is better to return it all
          resolve(results);
        })
        .catch(() => {
          resolve([]);
        });
    } else {
      resolve([]);
    }
  });
};

const getScreenPromise = (payload) => {
  const appConfig = getConfig();

  const { id, version, health_check_language } = payload;
  const { baseUrl, endPoints } = appConfig.api;
  const url = (baseUrl + endPoints.screens)
    .replace(':id', id)
    .replace(':language', health_check_language)
    .replace(':version', version);
  const requestHeaders = getLegacyAppRequestHeaders();
  return new Promise((resolve, _) => {
    fetch(url, { method: 'GET', headers: requestHeaders })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch project data. Status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((responseData) => {
        responseData.health_check_language = health_check_language;
        const screenObject = new Screen(responseData);
        screenObject.check();

        resolve({
          status: ApiConstants.success,
          item: ApiConstants.screen_health_check,
          id: id,
          version: version,
          error: null,
          data: screenObject,
        });
      })
      .catch((error) => {
        resolve({
          status: ApiConstants.error,
          item: ApiConstants.screen_health_check,
          id: id,
          version: version,
          error: error,
          data: null,
          errorStatus: error.status,
        });
      });
  });
};

// Check a collection item
const getCollectionPromise = (payload) => {
  const appConfig = getConfig();

  const { id, version, health_check_language } = payload;
  const { baseUrl, endPoints } = appConfig.api;
  const url = (baseUrl + endPoints.collections)
    .replace(':id', id)
    .replace(':language', health_check_language)
    .replace(':version', version);

  const requestHeaders = getLegacyAppRequestHeaders();

  return new Promise((resolve, _) => {
    fetch(url, {
      method: 'GET',
      headers: requestHeaders,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch project data. Status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((responseData) => {
        responseData.health_check_language = health_check_language;
        const obj = new Collection(responseData);
        resolve({
          status: 'success',
          item: 'collection-health-check',
          error: null,
          data: obj, // represents the relevant data for our health check
          storyData: responseData, //represents story data
        });
      })
      .catch((error) => {
        resolve({
          status: 'error',
          item: 'collection-health-check',
          error: error,
          data: null,
          storyData: null,
          errorStatus: error.status,
          id: id,
          version: version,
        });
      });
  });
};

// Stores the Collection data. Members of this class will be evaluated according to the rules we defined.
// function check() : checks object according to the rules
class Collection {
  constructor(data) {
    this.data = data || null; // data from story
    this.health_check_language = data.health_check_language || null;
    this.healthReport = {
      description: '',
      reportItems: [],
    };
  }
  check() {
    //TODO: Check current collection against the rules.
  }
}

function compareBool(val1 = false, val2 = false) {
  const bool1 = val1 ? true : false;
  const bool2 = val2 ? true : false;
  return bool1 === bool2;
}

function compareText(text1 = undefined, text2 = undefined) {
  if (!text1 && !text2) {
    return true;
  }

  if (!text1 || !text2) return false;

  return text1.trim() === text2.trim();
}

function booleanToString(value) {
  return value ? 'on' : 'off';
}

//chat GPT
function haveSameExtension(property1, property2) {
  const getExtension = (filename) => {
    const matches = filename.match(/\.([^.]+)$/);
    return matches ? matches[1].toLowerCase() : '';
  };

  const ext1 = getExtension(property1);
  const ext2 = getExtension(property2);

  if (ext1 === ext2) {
    return null;
  }

  return {
    ext1: ext1,
    ext2: ext2,
  };
}

function searchTextArrayInText(targetText, searchStrings, checkType) {
  // returns if it hits a match
  if (!targetText || !searchStrings) return false;
  if (typeof targetText !== 'string') return false;
  if (!Array.isArray(searchStrings)) return false;

  switch (checkType) {
    case 'startsWith':
      return searchStrings.some((searchString) =>
        targetText.trim().startsWith(searchString.trim())
      );
    case 'includes':
      return searchStrings.some((searchString) =>
        targetText.trim().includes(searchString.trim())
      );
    default:
      return false; // Or throw an error if you prefer
  }
}

class Screen {
  constructor(data) {
    this.appConfig = getConfig();
    this.data = data; //story data
    this.health_check_language = data.health_check_language || null;
    this.screenViewUrl = this.appConfig.api.screenViewUrl.replace(
      '{ID}',
      this.data.id
    );
    this.screenEditUrl = this.appConfig.api.screenEditUrl.replace(
      '{ID}',
      this.data.id
    );
    this.story_screen_type = StoryScreenTypes.NOT_IDENTIFIED;
    this.healthReport = {
      description: '',
      reportItems: [],
    };

    const audioGuideRules =
      this.appConfig.screenIdentifiers.rules.audioGuides || null;
    const artifactScreenRules =
      this.appConfig.screenIdentifiers.rules.artifacts || null;

    //Must decide what kind of screen is that.
    // 1st check if it is an audio screen.. If not, check if it is an artifact screen
    if (this.story_screen_type === StoryScreenTypes.NOT_IDENTIFIED) {
      if (audioGuideRules) {
        if (
          searchTextArrayInText(
            data.name,
            audioGuideRules.startWith,
            'startsWith'
          ) &&
          searchTextArrayInText(
            data.name,
            audioGuideRules.mustContain,
            'includes'
          )
        ) {
          this.story_screen_type = StoryScreenTypes.AUDIO_GUIDE;
        }
      }
    }

    // If it is not an audio-guide  screen, check if it is an artifact screen
    if (this.story_screen_type === StoryScreenTypes.NOT_IDENTIFIED) {
      if (artifactScreenRules) {
        if (
          searchTextArrayInText(
            data.name,
            artifactScreenRules.startWith,
            'startsWith'
          ) &&
          searchTextArrayInText(
            data.name,
            artifactScreenRules.mustContain,
            'includes'
          )
        ) {
          this.story_screen_type = StoryScreenTypes.ARTIFACT;
        }
      }
    }

    // console.log('Screen Type: ', this.story_screen_type);
  }

  addHealthCheckError(payload) {
    payload.key = this.healthReport.reportItems.length + 1;
    this.healthReport.reportItems.push(new HealthCheckResult(payload));
  }

  check() {
    if (this.story_screen_type === StoryScreenTypes.ARTIFACT) {
      const checkListContent = this.appConfig.feature.checkList.content || null;
      const globalCheckList = this.appConfig.feature.globalCheckList || null;
      const currentItemSectionsArr = this.data.sections;
      const { cover_image, cover_image_grid } = this.data;
      const { imageDescriptionMinimumLength } = globalCheckList;
      if (!cover_image) {
        this.addHealthCheckError({
          severity: HEALTH_CHECK_SEVERITY.HIGH,
          description: getErrorMessage(
            HealthCheckErrorCodes.MUST_HAVE_A_VALUE,
            ['Header section, Large image']
          ),
        });
      } else {
        let { description } = cover_image;
        description = extractTextFromHTML(description);
        if (!description) {
          this.addHealthCheckError({
            severity: HEALTH_CHECK_SEVERITY.HIGH,
            description: getErrorMessage(
              HealthCheckErrorCodes.MUST_HAVE_A_VALUE,
              ['Header section -> Large image -> Description']
            ),
          });
        } else {
          if (
            imageDescriptionMinimumLength > 0 &&
            description.length < imageDescriptionMinimumLength
          ) {
            this.addHealthCheckError({
              severity: HEALTH_CHECK_SEVERITY.HIGH,
              description: getErrorMessage(
                HealthCheckErrorCodes.IMAGE_DESCRIPTION_TOO_SHORT,
                [
                  imageDescriptionMinimumLength,
                  description.length,
                  this.data.name,
                  '',
                ]
              ),
            });
          }
        }
      }

      if (!cover_image_grid) {
        this.addHealthCheckError({
          description: getErrorMessage(
            HealthCheckErrorCodes.MUST_HAVE_A_VALUE,
            ['Header section, Square image']
          ),
        });
      } else {
        let { description } = cover_image_grid;
        description = extractTextFromHTML(description);
        if (!description) {
          this.addHealthCheckError({
            description: getErrorMessage(
              HealthCheckErrorCodes.MUST_HAVE_A_VALUE,
              ['Header section -> Square image -> Description']
            ),
          });
        } else {
          if (
            imageDescriptionMinimumLength > 0 &&
            description.length < imageDescriptionMinimumLength
          ) {
            this.addHealthCheckError({
              severity: HEALTH_CHECK_SEVERITY.HIGH,
              description: getErrorMessage(
                HealthCheckErrorCodes.IMAGE_DESCRIPTION_TOO_SHORT,
                [
                  imageDescriptionMinimumLength,
                  description.length,
                  this.data.name,
                  '',
                ]
              ),
            });
          }
        }
      }

      //check header image

      // check config array once

      if (Array.isArray(checkListContent)) {
        checkListContent.forEach((value, index) => {
          // check if the order is correct
          const expectedSection = value.for; // 'location' | 'highlights etc
          const settings = value.settings;
          const currentContentItem = currentItemSectionsArr[index];
          const {
            screen,
            titleText,
            icon,
            collapsable,
            descriptionMinimumLength,
          } = settings;
          let expectedValue = null;
          let currentValue = null;

          switch (expectedSection) {
            case 'location':
              {
                const isLinkGroup =
                  currentContentItem &&
                  currentContentItem.section_type === 'link_group';

                const sectionItemCount = currentContentItem.section_items
                  ? currentContentItem.section_items.length
                  : -1;

                if (!isLinkGroup) {
                  // expected something but it is not there.
                  this.addHealthCheckError({
                    description: getErrorMessage(
                      HealthCheckErrorCodes.SECTION_NOT_FOUND,
                      ['Location Section', index + 1]
                    ),
                  });
                } else if (sectionItemCount !== 1) {
                  this.addHealthCheckError({
                    description: getErrorMessage(
                      HealthCheckErrorCodes.MUST_HAVE_ONE_VALUE,
                      [
                        'Location section, buttons:',
                        'Location Button',
                        sectionItemCount,
                      ]
                    ),
                  });
                } else {
                  //check collapsible

                  expectedValue = collapsable;
                  // console.log('currentContentItem', currentContentItem);
                  currentValue = currentContentItem.collapsable;

                  if (!compareBool(expectedValue, currentValue)) {
                    this.addHealthCheckError({
                      description: getErrorMessage(
                        HealthCheckErrorCodes.MUST_BE_A_VALUE,
                        [
                          'Location Section Collapsable:',
                          booleanToString(expectedValue),
                          booleanToString(currentValue),
                        ]
                      ),
                    });
                  }

                  if (screen === 'self') {
                    expectedValue = this.data.id || null;
                    currentValue = currentContentItem.section_items[0].item_id;

                    if (expectedValue !== currentValue) {
                      this.addHealthCheckError({
                        description: getErrorMessage(
                          HealthCheckErrorCodes.LOCATION_SELF_WRONG
                        ),
                      });
                    }
                  }

                  expectedValue =
                    titleText[this.health_check_language] || undefined;
                  currentValue = currentContentItem.title;
                  if (!compareText(expectedValue, currentValue)) {
                    this.addHealthCheckError({
                      description: getErrorMessage(
                        HealthCheckErrorCodes.MUST_BE_BLANK,
                        ['Location Section. Title', currentContentItem.title]
                      ),
                    });
                  }
                }

                if (icon) {
                  let { type = undefined, name = undefined } = icon;
                  expectedValue = name;
                  currentValue =
                    currentContentItem.section_items[0].stock_icon_icon;
                  if (expectedValue !== currentValue) {
                    this.addHealthCheckError({
                      description: getErrorMessage(
                        HealthCheckErrorCodes.LOCATION_ICON_WRONG,
                        ['Location Pin Icon', expectedValue, currentValue]
                      ),
                    });
                  }

                  expectedValue = type;
                  currentValue =
                    currentContentItem.section_items[0].stock_icon_style;
                  if (expectedValue !== currentValue) {
                    this.addHealthCheckError({
                      description: getErrorMessage(
                        HealthCheckErrorCodes.LOCATION_ICON_STYLE,
                        ['Location Pin Style', expectedValue, currentValue]
                      ),
                    });
                  }
                }
              }
              break;
            case 'highlights':
              {
                expectedValue =
                  titleText[this.health_check_language] || undefined;

                currentValue = currentContentItem.title || undefined;

                if (!compareText(expectedValue, currentValue)) {
                  this.addHealthCheckError({
                    description: getErrorMessage(
                      HealthCheckErrorCodes.MUST_BE_A_VALUE,
                      ['Highlights Section Title:', expectedValue, currentValue]
                    ),
                  });
                }

                //check collapsible
                expectedValue = collapsable;
                currentValue = currentContentItem.collapsable;
                if (!compareBool(expectedValue, currentValue)) {
                  this.addHealthCheckError({
                    description: getErrorMessage(
                      HealthCheckErrorCodes.MUST_BE_A_VALUE,
                      [
                        'Highlights Section Collapsable',
                        booleanToString(expectedValue),
                        booleanToString(currentValue),
                      ]
                    ),
                  });
                }
              }

              break;
            case 'image-gallery':
              {
                // look for media_group
                expectedValue = 'media_group';
                currentValue = currentContentItem.section_type;

                let isMediaGallery = compareText(expectedValue, currentValue);
                let imageCount =
                  (currentContentItem.section_items &&
                    Array.isArray(currentContentItem.section_items) &&
                    currentContentItem.section_items.length) ||
                  -1;

                if (!isMediaGallery) {
                  this.addHealthCheckError({
                    description: getErrorMessage(
                      HealthCheckErrorCodes.SECTION_NOT_FOUND,
                      ['Media Gallery', index + 1]
                    ),
                  });
                } else if (imageCount <= 0) {
                  this.addHealthCheckError({
                    description: getErrorMessage(
                      HealthCheckErrorCodes.EMPTY_GALLERY_FOUND
                    ),
                  });
                } else {
                  expectedValue = collapsable;
                  currentValue = currentContentItem.collapsable;

                  if (expectedValue !== currentValue) {
                    this.addHealthCheckError({
                      description: getErrorMessage(
                        HealthCheckErrorCodes.MUST_BE_A_VALUE,
                        [
                          'Media Gallery Section Collapsable:',
                          booleanToString(expectedValue),
                          booleanToString(currentValue),
                        ]
                      ),
                    });
                  }

                  // check each image
                  const images = currentContentItem.section_items;
                  images.forEach((image) => {
                    let {
                      media_type = '',
                      name = '',
                      caption = '',
                      // attribution = '',
                      description = '',
                      file = {},
                    } = image;

                    let { filename = '', file_size = null } = file;

                    name = name.trim();
                    caption = caption.trim();
                    // attribution = attribution.trim();
                    description = description.trim();
                    description = extractTextFromHTML(description);

                    if (media_type === 'image') {
                      if (!description) {
                        this.addHealthCheckError({
                          severity: HEALTH_CHECK_SEVERITY.HIGH,
                          description: getErrorMessage(
                            HealthCheckErrorDescriptions.IMAGE_MISSING_PROPERTY,
                            ['Description', name, filename]
                          ),
                        });
                      }
                      if (description && descriptionMinimumLength) {
                        if (description.length < descriptionMinimumLength) {
                          this.addHealthCheckError({
                            severity: HEALTH_CHECK_SEVERITY.HIGH,
                            description: getErrorMessage(
                              HealthCheckErrorCodes.IMAGE_DESCRIPTION_TOO_SHORT,
                              [
                                descriptionMinimumLength,
                                description.length,
                                name,
                                filename,
                              ]
                            ),
                          });
                        }
                      }
                      if (!caption) {
                        //missing caption
                        this.addHealthCheckError({
                          severity: HEALTH_CHECK_SEVERITY.MEDIUM,
                          description: getErrorMessage(
                            HealthCheckErrorCodes.IMAGE_MISSING_PROPERTY,
                            ['Caption', name, filename]
                          ),
                        });
                      }

                      // Too much extra stuff
                      const fileExtensionCheck = haveSameExtension(
                        name,
                        filename
                      );
                      if (fileExtensionCheck) {
                        const { ext1 = '', ext2 = '' } = fileExtensionCheck;
                        this.addHealthCheckError({
                          severity: HEALTH_CHECK_SEVERITY.MEDIUM,
                          description: getErrorMessage(
                            HealthCheckErrorCodes.IMAGE_EXTENSION_ERROR,
                            [ext1, ext2, name, filename]
                          ),
                        });
                      }
                    }
                  });
                }
              }
              break;
            case 'history':
              break;
            case 'provenance':
              break;
            case 'technical-information':
              break;
            case 'airplane-model':
              break;
          }
        });
      }
    }

    if (this.story_screen_type === StoryScreenTypes.AUDIO_GUIDE) {
      // TODO: handle audio guide files
    }

    if (this.story_screen_type === StoryScreenTypes.NOT_IDENTIFIED) {
      // TODO: handle non-idendified screens
    }

    //check content first
  }
}

const HEALTH_CHECK_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

class HealthCheckResult {
  constructor(data) {
    this.severity = data.severity || HEALTH_CHECK_SEVERITY.LOW;
    this.description = data.description || 'No error description';
    this.suggestion = data.suggestion || 'No fix suggestion';
  }
}
