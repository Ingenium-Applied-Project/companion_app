const ApiConstants = {
  success: 'success',
  error: 'error',
  screen_health_check: 'screen-health-check',
};

const LocalStorageKeys = {
  HERO_IMAGE: 'HERO_IMAGE',
};

const HeroImageDefaultsCASM = {
  gradientStartHeight: 0.5,
  gradientEndHeight: 1,
  gradientStartColor: 'rgba(0,0,0,0)',
  gradientEndColor: 'rgba(0,0,0,1)',
  fillRectHeight: 1,
  exportQuality: 2, //high
  defaultExportFormat: 'image/jpeg',
};

const StoryScreenTypes = {
  AUDIO_GUIDE: 'Audio Guide',
  ARTIFACT: 'Artifact',
  NOT_IDENTIFIED: 'Screen Type Not Found',
};

const HealthCheckErrorCodes = {
  MUST_BE_BLANK: 'MUST_BE_BLANK',
  MUST_BE_A_VALUE: 'MUST_BE_A_VALUE',
  MUST_HAVE_A_VALUE: 'MUST_HAVE_A_VALUE',
  MUST_HAVE_ONE_VALUE: 'MUST_HAVE_ONE_VALUE',
  SECTION_NOT_FOUND: 'SECTION_NOT_FOUND',

  TOO_SHORT: 'TOO_SHORT',
  LOCATION_SELF_WRONG: 'LOCATION_SELF_WRONG',
  LOCATION_ICON_WRONG: 'LOCATION_ICON_WRONG',
  LOCATION_ICON_STYLE: 'LOCATION_ICON_STYLE',
  EMPTY_GALLERY_FOUND: 'EMPTY_GALLERY_FOUND',
  IMAGE_MISSING_PROPERTY: 'IMAGE_MISSING_PROPERTY',
  IMAGE_DESCRIPTION_TOO_SHORT: 'IMAGE_DESCRIPTION_TOO_SHORT',
  IMAGE_EXTENSION_ERROR: 'IMAGE_EXTENSION_ERROR',

  DUPLICATE_CONTENT_MULTI: 'DUPLICATE_CONTENT_MULTI',
  DUPLICATE_IMAGE_DESCRIPTION_MULTI: 'DUPLICATE_IMAGE_DESCRIPTION_MULTI',
};

const HealthCheckErrorDescriptions = {
  // {1 is generally the field name}
  MUST_BE_BLANK: '{1}: Blank value is expected. Current value: {2}',
  MUST_BE_A_VALUE: '{1}: Must have value of "{2}". Found "{3}"',
  MUST_HAVE_A_VALUE: '{1}: Must have a value.',
  MUST_HAVE_ONE_VALUE: '{1}: Expected one {2} item only, but found {3} items',
  SECTION_NOT_FOUND: 'Section "{1}" not found! Expected {1} on index {2}',

  TOO_SHORT: '{1}. The field is short. Expected minimum length: {2}',
  LOCATION_SELF_WRONG:
    'Location pin should address the page itself. It is addressing another page.',
  LOCATION_ICON_WRONG:
    '{1}: Location pin icon is wrong. Expected {2}; found: {3}',
  LOCATION_ICON_STYLE:
    '{1}: Location pin icon style is wrong. Expected {2}; found: {3}',
  EMPTY_GALLERY_FOUND: 'Gallery is empty. ',
  IMAGE_MISSING_PROPERTY: 'Missing {1} on image {2} {3}',
  IMAGE_DESCRIPTION_TOO_SHORT:
    'Image description is too short. Expected minimum {1} but found {2} on image {3}{4}',
  IMAGE_EXTENSION_ERROR:
    'Image extension is wrong. Expected "{1}" extension. Found "{2}" extension on image {3}',
  DUPLICATE_CONTENT_MULTI:
    'Duplicate Content on screen {1}: Check {2} for languages {3} and {4}.',
  DUPLICATE_IMAGE_DESCRIPTION_MULTI:
    'Duplicate image descriptions on screen {1}: Check image {2} for languages {3} and {4}.',
};

const HealthCheckSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

const HealthCheckSuggestions = {};

export {
  ApiConstants,
  HealthCheckErrorCodes,
  HealthCheckErrorDescriptions,
  HealthCheckSeverity,
  HealthCheckSuggestions,
  HeroImageDefaultsCASM,
  LocalStorageKeys,
  StoryScreenTypes,
};
