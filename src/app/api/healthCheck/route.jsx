import config from '@/museumConfig';
import { NextResponse } from 'next/server';

// stores appConfig object for all functions called within the same sequence
let appConfig;

// loadConfig must be called as the first function in each exported function (GET, POST, etc.)
const loadConfig = (app = 'CASM') => {
  appConfig = config[app] || {};
};

// Used in the original entry point in order to get initial access to the end point.
const getRequestHeaders = () => {
  const { auth, headers } = appConfig.api;
  return {
    HTTP_STQRY_PROJECT_TYPE: headers.HTTP_STQRY_PROJECT_TYPE,
    Authorization: `Basic ${btoa(`${auth.username}:${auth.password}`)}`,
  };
};

// Used in further fetch requests to get more detailed access.
// This has a different username than getRequestHeaders function
const getLegacyAppRequestHeaders = () => {
  const { auth, headers } = appConfig.api;
  return {
    HTTP_STQRY_PROJECT_TYPE: headers.HTTP_STQRY_PROJECT_TYPE,
    Authorization: `Basic ${btoa(`${auth.legacy_app_id}:${auth.password}`)}`,
  };
};

// placeholder for POST method
export async function POST(req) {
  return NextResponse.json({ message: 'POST request processed' });
}

// This method returns the health-check result.
// It fetches every collection, screen, and media item, per language and returns a detailed result.

export async function GET(req) {
  loadConfig();

  const { baseUrl, endPoints } = appConfig.api;
  const { languages } = appConfig;

  const projectURL = baseUrl + endPoints.project;

  // first fetch
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

    // console.log(responseData);

    let { collections, media_items, screens } = responseData;

    //TODO: Test for few elements only: Remove it later when the functionality is good
    if (collections && 1 === 1) {
      collections = collections.slice(0, 1);
    }

    if (collections && Array.isArray(collections) && collections.length > 0) {
      const collectionsPromiseArray = [];
      if (Array.isArray(languages) && languages.length > 0) {
        collections.forEach((collection) => {
          languages.forEach((lang) => {
            const { code } = lang;
            if (code) {
              //check this collection for the given language
              collection.health_check_language = code;
              const promise = getCollectionPromise(collection);
              if (promise) {
                collectionsPromiseArray.push(promise);
              }
            }
          });
        });
      }

      const collectionResult = await Promise.all(collectionsPromiseArray);
      console.log(
        'promise result: ',
        collectionResult.length
        // collectionResult
      );
    }

    return NextResponse.json({
      message: 'GET request processed',
      responseData,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.error(error);
  }
}

const getCollectionPromise = (payload) => {
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
        const obj = new Collection(responseData);
        obj.check();
        resolve({
          status: 'success',
          responseData: responseData,
          error: null,
          object: obj.getHealthReport(),
        });
      })
      .catch((error) => {
        // still resolve but with error. We don't want Promise.all to fail completely
        resolve({
          status: 'error',
          id: id,
          version: version,
          error: error,
          errorStatus: error.status,
        });
      });
  });
};

// Stores the Collection data. Members of this class will be evaluated according to the rules we defined.
// function check() : checks object according to the rules
// function getHealthReport(): returns the health report object for the given collection (with reduced data.)
class Collection {
  constructor(data) {
    // console.log('data', data);
    this.id = data.id;
    this.version = data.version;
    this.subtype = data.subtype;
    this.health_check_language = data.health_check_language || null;
    this.name = data.name;
    this.description = data.description;
    this.short_title = data.short_title;
    this.tour_mode = data.tour_mode;
    this.map_pin_color = data.map_pin_color;
    this.map_pin_icon = data.map_pin_icon;
    this.map_pin_style = data.map_pin_style;
    this.length_min = data.length_min;
    this.length_max = data.length_max;
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
    //TODO: Check current collection against
  }
  getHealthReport() {
    return { description: 'Health report for: ', reportItems: [] };
  }
}
