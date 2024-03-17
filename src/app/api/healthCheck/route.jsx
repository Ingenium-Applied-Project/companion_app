import config from '@/museumConfig';
import { NextResponse } from 'next/server';

let appConfig = {};

const getRequestHeaders = () => {
  const { auth, headers } = appConfig.api;

  return {
    HTTP_STQRY_PROJECT_TYPE: headers.HTTP_STQRY_PROJECT_TYPE,
    Authorization: `Basic ${btoa(`${auth.username}:${auth.password}`)}`,
  };
};

const getLegacyAppRequestHeaders = () => {
  const { auth, headers } = appConfig.api;
  return {
    HTTP_STQRY_PROJECT_TYPE: headers.HTTP_STQRY_PROJECT_TYPE,
    Authorization: `Basic ${btoa(`${auth.legacy_app_id}:${auth.password}`)}`,
  };
};

export async function POST(req) {
  return NextResponse.json({ message: 'POST request processed' });
}

export async function GET(req) {
  loadConfig();

  const { baseUrl, endPoints } = appConfig.api;

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

    const { collections, media_items, screens } = responseData;

    collections;
    if (collections && collections[0]) {
      getCollectionPromise(collections[0])
        .then((result) => {
          console.log('Result: ', result);
          // console.log('sucess');
        })
        .catch((error) => {
          console.error(error);
        });
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
  const { id, version } = payload;
  const { baseUrl, endPoints } = appConfig.api;
  const url = (baseUrl + endPoints.collections)
    .replace(':id', id)
    .replace(':version', version)
    .replace(':language', 'en');
  const requestHeaders = getLegacyAppRequestHeaders();

  return new Promise(async (resolve, _) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: requestHeaders,
      });
      //   console.log('fetch url', url);
      // console.log('fetch headers', response);
      // Handle the response as needed
      if (!response.ok) {
        throw new Error(
          `Failed to fetch project data. Status: ${response.status}`
        );
      }
      const responseData = await response.json();
      const obj = new Collection(responseData);

      resolve({
        status: 'success',
        responseData: responseData,
        error: null,
        object: obj,
      });
    } catch (error) {
      resolve({
        status: 'error',
        id: id,
        version: version,
        error: error,
        errorStatus: error.status,
      });
    }
  });
};

const loadConfig = (app = 'CASM') => {
  appConfig = config[app] || {};
};

class Collection {
  constructor(data) {
    // console.log('data', data);
    this.id = data.id;
    this.version = data.version;
    this.subtype = data.subtype;
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
  getReport() {}
}

const getCollectionObject = (payload) => {
  const obj = {};

  obj.id = payload.id;
  // obj.subtype =

  return obj;
};

const collection = {
  id: '',
  version: '',
  url: '',
  type: '',
  passed: [{}],
  failed: [{}],
  /*
    * name: Must start with WA

  
  */
};
