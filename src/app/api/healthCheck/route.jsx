import config from '@/museumConfig';
import { writeDataToFile } from '@/utils/devUtils';
import { NextResponse } from 'next/server';

// Returns app config for CASM
const getConfig = (app = 'CASM') => {
  return config[app] || {};
};

// Used in the original entry point in order to get initial access to STORY end point.
const getRequestHeaders = () => {
  const appConfig = getConfig();
  const { auth, headers } = appConfig.api;
  return {
    HTTP_STQRY_PROJECT_TYPE: headers.HTTP_STQRY_PROJECT_TYPE,
    Authorization: `Basic ${btoa(`${auth.username}:${auth.password}`)}`,
  };
};

// Used in further fetch requests to get more detailed access.
// This has a different username than getRequestHeaders function
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

// This method returns the health-check result.
// It fetches every collection and screen, per language (en and fr) and returns a detailed report.
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

    //DEV only
    await writeDataToFile(collections, 'collections.json');
    await writeDataToFile(screens, 'screens.json');

    //DEV

    //TODO: TEST for few elements only: Remove it later when the functionality is good
    if (collections && 1 === 1) {
      // collections = collections.slice(0, 10);
    }

    //TODO: TEST for few elements only: Remove it later when the functionality is good
    if (screens && 1 === 1) {
      screens = screens.slice(0, 30); //testing
    }

    // Create promises for each main functional area.
    // - collections
    // - screens

    const collectionsHealthCheckPromise =
      getCollectionsHealthCheckPromise(collections);
    const screensHealthCheckPromise = getScreensHealthCheckPromise(screens);

    const startTime = Date.now();
    const promiseResults = await Promise.all([
      collectionsHealthCheckPromise,
      screensHealthCheckPromise,
    ]);
    // console.log(promiseResults[0]);
    // console.log(promiseResults[1]);

    // console.log(promiseResults[0].length, 'collections printed');
    // console.log(promiseResults[1].length, 'screens printed');
    await writeDataToFile(promiseResults[0], 'evaluatedCollections.json');
    await writeDataToFile(promiseResults[1], 'evaluatedScreens.json');

    const endTime = Date.now();
    console.log(`Elapsed time ${endTime - startTime} miliseconds`);

    if (
      promiseResults[1] &&
      Array.isArray(promiseResults[1]) &&
      promiseResults[1].length > 0
    ) {
      // create
      promiseResults.forEach((screenResult) => {
        // console.log(screenResult);
      });
    }

    return NextResponse.json({
      message: 'GET request processed',
      // responseData,
      responseData: promiseResults[1],
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

const getScreensHealthCheckPromise = (screens) => {
  const appConfig = getConfig();

  const { languages } = appConfig;

  return new Promise((resolve, _) => {
    if (!Array.isArray(languages) || !languages.length) {
      resolve([]);
    }

    const healthCheckPromiseArray = [];
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
        // console.log('raw screen sections', responseData.sections);
        const obj = new Screen(responseData);
        resolve({
          status: 'success',
          item: 'screen-health-check',
          error: null,
          data: obj,
          storyData: responseData, //represents story data
        });
      })
      .catch((error) => {
        resolve({
          status: 'error',
          item: 'screen-health-check',
          error: error,
          data: null,
          storyData: null, //represents story data
          errorStatus: error.status,
          id: id,
          version: version,
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
// function getHealthReport(): returns the health report object for the given collection (with reduced data.)
class Collection {
  healthReport = {};
  constructor(data) {
    this.data = data || null; // data from story
    this.health_check_language = data.health_check_language || null;
  }
  check() {
    //TODO: Check current collection against the rules.
  }
  getHealthReport() {
    this.healthReport.description = `Health report for ${this.id} and ${this.health_check_language}`;
    this.healthReport.reportItems = [];
    return this.healthReport;
  }
}

class Screen {
  healthReport = {};

  constructor(data) {
    this.data = data; //story data
    this.health_check_language = data.health_check_language || null;
    this.appConfig = getConfig();

    // access to sections with this.data.sections
    
  }
  check = () => {
    //check content first
    const checkListArr = this.appConfig.feature.checkList.content || null;
    if (checkListArr) {
      checkListArr.forEach((element) => {
        const { for: forSection } = element;
        switch (forSection) {
          case 'location':
            const storySections = this.data.sections.filter(el => e,)
            break;
          case 'highlights':
            break;
          case 'image-gallery':
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
  };

  getHealthReport() {
    this.healthReport.description = `Health report for ${this.id} and ${this.health_check_language}`;
    this.healthReport.reportItems = [];
    return this.healthReport;
  }
}

const HEALTH_CHECK_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

const HEALTH_CHECK_DESCRIPTIONS = {
  //TODO: Add options
};

const HEALTH_CHECK_SUGGESTIONS = {
  //TODO: Add options
};
class HealthCheckResult {
  constructor(data) {
    this.severity = data.severity || HEALTH_CHECK_SEVERITY.LOW;
  }

  createHealthCheckResult = (payload) => {
    const {
      severity = HEALTH_CHECK_SEVERITY.LOW,
      description = 'No Description',
      suggestion = 'No suggestion',
    } = payload;

    return {
      severity: severity,
      description: description,
      suggestion: suggestion,
    };
  };
}
