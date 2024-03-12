'use client';

import { useApp } from '@/providers/appProvider';
import { useEffect, useState } from 'react';
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
  } = useApp();

  const [showColorPicker1, setShowColorPicker1] = useState(false);
  const [showColorPicker2, setShowColorPicker2] = useState(false);

  const handleClickOutside = (event) => {
    // Check if the click is outside the color picker
    if (!event.target.closest('.sketch-picker') && showColorPicker1) {
      setShowColorPicker1(false);
    }

    if (!event.target.closest('.sketch-picker') && showColorPicker2) {
      setShowColorPicker2(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker1, showColorPicker2]);

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
      <div className={styles.uploadButtonContainer}>
        <input
          type="file"
          onChange={handleHeroImageUpload}
          accept="image/*"
          className={styles.fileInput}
          title="Upload Hero Image"
        />
      </div>
      <div className="">
        <div>
          {heroImage && (
            <img
              src={heroImage}
              alt="Original Hero Image"
              className={styles.image}
            />
          )}
        </div>
      </div>
      <div>
        {modifiedHeroImage && (
          <div className={styles.modifiedImage}>
            <img
              src={modifiedHeroImage}
              alt="Modified"
              className={styles.image}
            />
            <div className={styles.downloadButton}>
              <button onClick={downloadModifiedHeroImage}>Download</button>
            </div>
          </div>
        )}
        <div>
          <p className={styles.title}> Step 3 Adjust Settings</p>

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
              min="1"
              max="100"
              value={heroImageFilters.exportQuality * 100}
              onChange={handleFilterChange}
              className={styles.rangeInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;

// <div className={styles.sourceContainer}>
// <div>
//   <p>Enter a title for your image:</p>
//   <input
//     type="text"
//     value={heroImageText}
//     onChange={handleTextChange}
//     className={styles.textInput}
//   />
// </div>
// <span>Upload Hero Image:</span>
// <input
//   type="file"
//   onChange={handleHeroImageUpload}
//   accept="image/*"
//   className={styles.fileInput}
// />
// </div>

// <div className={styles.modifiedImageContainer}>
// <div className={styles.filtersContainer}>

// </div>

// <div className={styles.downloadButton}>[Download button]</div>
// </div>
