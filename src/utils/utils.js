import { HealthCheckErrorDescriptions } from '@/constants/constants';

const isBlobURL = (url) => {
  return url.startsWith('blob:');
};

function getErrorMessage(errorKey, params) {
  errorKey = errorKey.trim();
  let errorMessage = HealthCheckErrorDescriptions[errorKey];
  if (!errorMessage) {
    return 'Invalid error key';
  }

  params.forEach((param, index) => {
    const placeholder = `{${index + 1}}`;
    errorMessage = errorMessage.replace(placeholder, param);
  });

  return errorMessage;
}

// This function is needed to compare falsy values properly. undefined === false etc
function compareBool(val1 = false, val2 = false) {
  const bool1 = val1 ? true : false;
  const bool2 = val2 ? true : false;
  return bool1 === bool2;
}

// this compares to text values, case-sensitive
function compareText(text1 = undefined, text2 = undefined) {
  if (!text1 && !text2) {
    return true;
  }

  if (!text1 || !text2) return false;

  return text1.trim() === text2.trim();
}

// a simple toString() method for boolean. Related to the ui switches like collapsable
function booleanToString(value) {
  return value ? 'on' : 'off';
}

export {
  booleanToString,
  compareBool,
  compareText,
  getErrorMessage,
  isBlobURL,
};
