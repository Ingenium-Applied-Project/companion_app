const isBlobURL = (url) => {
  return url.startsWith('blob:');
};

export { isBlobURL };
