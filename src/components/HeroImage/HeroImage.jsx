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
      <div className={styles.title}>
        <p>Hero Image</p>
      </div>

      <div className={styles.imageContainer}>
        <img src={modifiedHeroImage} alt="Modified" className={styles.image} />
      </div>

      <div className={styles.uploadButtonContainer}>
        <input
          type="file"
          onChange={handleHeroImageUpload}
          accept="image/*"
          id="file-upload"
          className={styles.fileInput}
        />
      </div>

      {/* Filters */}
      <div className={styles.filtersContainer}>
        <button
          title="remove"
          onClick={handleRemoveImage}
          className={styles.removeButton}
        >
          Reset
        </button>
        {/* <input
          type="text"
          value={heroImageText}
          onChange={handleTextChange}
          className={styles.textInput}
          placeholder="Write the title..."
        /> */}
        <div>
          <label className={styles.label}>Gradient Start Height Pct:</label>
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
        {/* Check box Sizes */}
        <div className={styles.checkboxSizesContainer}>
          <label className={styles.label}>
            <input type="checkbox" id="checkbox1" value="small" />
            Small
          </label>
          <label className={styles.label}>
            <input type="checkbox" id="checkbox1" value="medium" />
            Medium
          </label>
          <label className={styles.label}>
            <input type="checkbox" id="checkbox1" value="large" />
            Large
          </label>
        </div>

        <button onClick={downloadModifiedHeroImage} className={styles.button}>
          Download
        </button>
      </div>
    </div>
  );
};

export default HeroImage;
