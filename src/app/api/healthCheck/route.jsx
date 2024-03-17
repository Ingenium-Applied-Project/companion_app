import config from '@/museumConfig';
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

    let { collections, media_items, screens } = responseData;

    //TODO: TEST for few elements only: Remove it later when the functionality is good
    if (collections && 1 === 1) {
      collections = collections.slice(0, 10);
    }

    //TODO: TEST for few elements only: Remove it later when the functionality is good
    if (screens && 1 === 1) {
      screens = screens.slice(0, 10);
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
    console.log(promiseResults[0]);
    console.log(promiseResults[1]);

    console.log(promiseResults[0].length, 'collections printed');
    console.log(promiseResults[1].length, 'screens printed');
    const endTime = Date.now();
    console.log(`Elapsed time ${endTime - startTime} miliseconds`);
    return NextResponse.json({
      message: 'GET request processed',
      responseData,
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
        });
      })
      .catch((error) => {
        resolve({
          status: 'error',
          item: 'screen-health-check',
          error: error,
          data: null,
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
        });
      })
      .catch((error) => {
        resolve({
          status: 'error',
          item: 'collection-health-check',
          error: error,
          data: null,
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
    // console.log('data', data);
    this.id = data.id;
    this.version = data.version;
    this.subtype = data.subtype;
    this.health_check_language = data.health_check_language || null;
    this.name = data.name || null;
    this.description = data.description || null;
    this.short_title = data.short_title || null;
    this.tour_mode = data.tour_mode || null;
    this.map_pin_color = data.map_pin_color || null;
    this.map_pin_icon = data.map_pin_icon || null;
    this.map_pin_style = data.map_pin_style || null;
    this.length_min = data.length_min || null;
    this.length_max = data.length_max || null;
    this.cover_image = null;
    this.cover_image_grid = null;
    this.sections = [];

    if (data.cover_image) {
      this.cover_image = {
        id: data.cover_image.id || null,
        name: data.cover_image.name || null,
        media_type: data.cover_image.media_type || null,
        attribution: data.cover_image.attribution || null,
        description: data.cover_image.description || null,
        caption: data.cover_image.caption || '',
        file_id: data.cover_image.file.id || null,
        file_name: data.cover_image.filename || null,
        file_content_type: data.cover_image.content_type || null,
        file_size: data.cover_image.file_size || -1,
        file_original_url: data.cover_image.original_url || null,
        file_width: data.cover_image.width || -1,
        file_height: data.cover_image.height || -1,
      };
    }

    if (data.cover_image_grid) {
      this.cover_image_grid = {
        id: data.cover_image_grid.id || null,
        name: data.cover_image_grid.name || null,
        media_type: data.cover_image_grid.media_type || null,
        attribution: data.cover_image_grid.attribution || null,
        description: data.cover_image_grid.description || null,
        caption: data.cover_image_grid.caption || '',
        file_id: data.cover_image_grid.file.id || null,
        file_name: data.cover_image_grid.filename || null,
        file_content_type: data.cover_image_grid.content_type || null,
        file_size: data.cover_image_grid.file_size || -1,
        file_original_url: data.cover_image_grid.original_url || null,
        file_width: data.cover_image_grid.width || -1,
        file_height: data.cover_image_grid.height || -1,
      };
    }

    if (data.sections) {
      const { sections } = data.sections;
      if (Array.isArray(sections) && sections.length > 0) {
        this.sections = sections;
      }
    }
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
    // console.log('data', data);
    this.id = data.id;
    this.version = data.version;
    this.screen_type = data.screen_type; //story | x | y | z
    this.health_check_language = data.health_check_language || null;
    this.name = data.name; //e.g. WA-SU-ExhibitionK-ColdWar-MikoyanGurevichMigLim2
    this.title = data.title || ''; //WSK Lim-2 (Mikoyan-Gurevich MiG- 15bis)
    this.short_title = data.short_title || ''; //WSK Lim-2 (Mikoyan-Gurevich MiG- 15bis)
    this.header_layout = data.header_layout || null; // image_and_title | x
    this.map_pin_color = data.map_pin_color || null;
    this.map_pin_icon = data.map_pin_icon || null;
    this.map_pin_style = data.map_pin_style || null;
    this.cover_image = null;
    this.cover_image_grid = null;

    if (data.cover_image) {
      this.cover_image = {
        id: data.cover_image.id || null,
        name: data.cover_image.name || null,
        media_type: data.cover_image.media_type || null,
        attribution: data.cover_image.attribution || null,
        description: data.cover_image.description || null,
        caption: data.cover_image.caption || '',
        file_id: data.cover_image.file.id || null,
        file_name: data.cover_image.filename || null,
        file_content_type: data.cover_image.content_type || null,
        file_size: data.cover_image.file_size || -1,
        file_original_url: data.cover_image.original_url || null,
        file_width: data.cover_image.width || -1,
        file_height: data.cover_image.height || -1,
      };
    }

    if (data.cover_image_grid) {
      this.cover_image_grid = {
        id: data.cover_image_grid.id || null,
        name: data.cover_image_grid.name || null,
        media_type: data.cover_image_grid.media_type || null,
        attribution: data.cover_image_grid.attribution || null,
        description: data.cover_image_grid.description || null,
        caption: data.cover_image_grid.caption || '',
        file_id: data.cover_image_grid.file.id || null,
        file_name: data.cover_image_grid.filename || null,
        file_content_type: data.cover_image_grid.content_type || null,
        file_size: data.cover_image_grid.file_size || -1,
        file_original_url: data.cover_image_grid.original_url || null,
        file_width: data.cover_image_grid.width || -1,
        file_height: data.cover_image_grid.height || -1,
      };
    }
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
