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

export { getErrorMessage, isBlobURL };
