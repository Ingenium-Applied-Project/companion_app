'use client';

import { useApp } from '@/providers/appProvider';
import styles from './HeroImage.module.css';

const HeroImage = () => {
  const {
    heroImage,
    setHeroImageText,
    heroImageText,
    setHeroSourceImage,
    modifiedHeroImage,
    heroImageFilters,
    updateHeroFilterValue,
    downloadModifiedHeroImage,
    removeHeroSourceImage,
  } = useApp();

  const handleHeroImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await setHeroSourceImage({ image: e.target.files[0] });
    }
  };

  const handleTextChange = async (e) => {
    setHeroImageText(e.target.value);
  };

  const handleFilterChange = async (e) => {
    const { name, value } = e.target;
    await updateHeroFilterValue({ name: name, value: value });
  };

  const handleRemoveImage = async () => {
    await removeHeroSourceImage();
  };

  return (
    <div className={styles.container}>
      {/* Text Input where user enters the screen-title */}
      <div className={styles.textInputContainer}>
        <input
          type="text"
          value={heroImageText}
          onChange={handleTextChange}
          className={styles.textInput}
        />
      </div>

      {/* Upload Button */}
      <div>
        <div className={styles.uploadButtonContainer}>
          {heroImage && (
            <button
              title="test"
              className={styles.fileInput}
              onClick={handleRemoveImage}
            >
              Remove Image
            </button>
          )}
          <input
            type="file"
            onChange={handleHeroImageUpload}
            accept="image/*"
            className={styles.fileInput}
            title="Upload Hero Image"
          />
        </div>
      </div>
      <div className={styles.originalImageContainer}>
        {heroImage && (
          <div className={styles.imageContainer}>
            <img
              src={heroImage}
              alt="Original Hero Image"
              className={styles.image}
            />
            <h2 className={styles.title2}>{heroImageText}</h2>
          </div>
        )}
      </div>
      <div className={styles.modifiedImageContainer}>
        {modifiedHeroImage && (
          <div>
            <div className={styles.imageContainer}>
              <img
                src={modifiedHeroImage}
                alt="Modified"
                className={styles.image}
              />
              <h2 className={styles.title2}>{heroImageText}</h2>
            </div>
            <div>
              <button onClick={downloadModifiedHeroImage}>Download</button>
            </div>

            <div>
              <p className={styles.title}> Step 3 Adjust Settings</p>

              <div>
                <label className={styles.label}>
                  Gradient Start Height Pct:
                </label>
                <input
                  type="range"
                  name="gradientStartHeight"
                  min="0"
                  max="100"
                  value={heroImageFilters.gradientStartHeight * 100}
                  onChange={handleFilterChange}
                  className={styles.rangeInput}
                />
              </div>

              <div>
                <label className={styles.label}>Export Quality:</label>
                <input
                  type="range"
                  name="exportQuality"
                  min="0"
                  max="3"
                  step="1"
                  value={heroImageFilters.exportQuality}
                  onChange={handleFilterChange}
                  className={styles.rangeInput}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroImage;
