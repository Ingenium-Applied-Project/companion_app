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
  // IMPORTANT: When you add a new value here, make sure you add it to HealthCheckErrorCodes as well.

  MUST_BE_BLANK: '{1}: Expected no value but found "{2}".',
  MUST_BE_A_VALUE: '{1}: Expected value to be "{2}", but found "{3}"."',
  MUST_HAVE_A_VALUE: '{1}: A value is required.',
  MUST_HAVE_ONE_VALUE:
    '{1}: Expected exactly one {2} item, but found {3} items.',
  SECTION_NOT_FOUND:
    'Section "{1}" not found! Expected to find "{1}" at index {2}.',

  TOO_SHORT: '{1}: The field is too short. Minimum expected length: {2}.',
  LOCATION_SELF_WRONG:
    'The location pin should point to the current page, but it points to another page.',

  LOCATION_ICON_WRONG:
    '{1}: Incorrect location pin icon. Expected "{2}", found "{3}".',
  LOCATION_ICON_STYLE:
    '{1}: Incorrect location pin icon style. Expected "{2}", found "{3}".',
  EMPTY_GALLERY_FOUND: 'The gallery is empty.',
  IMAGE_MISSING_PROPERTY: 'Image {2} {3} is missing the property "{1}".',
  IMAGE_DESCRIPTION_TOO_SHORT:
    'Image description is too short. Minimum expected length: {1}, but found {2} for image {3}{4}.',
  IMAGE_EXTENSION_ERROR:
    'Incorrect image extension for image {3}. Expected "{1}", found "{2}".',
  DUPLICATE_CONTENT_MULTI:
    'Duplicate content detected on screen {1}. Check {2} for languages {3} and {4}.',
  DUPLICATE_IMAGE_DESCRIPTION_MULTI:
    'Duplicate image descriptions detected on screen {1}. Check image {2} for languages {3} and {4}.',
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
