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

export { HeroImageDefaultsCASM, LocalStorageKeys, StoryScreenTypes };
