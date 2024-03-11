'use client';

import { useApp } from '@/providers/appProvider';
import { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
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
      <textarea
        style={{ height: 130, width: 340 }}
        value={JSON.stringify(heroImageFilters)}
      ></textarea>
      <div>
        <p className={styles.title}>Step 1 - Upload Image</p>
        {heroImage && (
          <img
            src={heroImage}
            alt="Original Hero Image"
            className={styles.image}
          />
        )}
        <div>
          <input
            type="file"
            onChange={handleHeroImageUpload}
            accept="image/*"
            className={styles.fileInput}
          />
        </div>
      </div>

      <div>
        <p className={styles.title}>Step 2 - Hero Image Title</p>

        <input
          type="text"
          value={heroImageText}
          onChange={handleTextChange}
          className={styles.textInput}
        />
      </div>

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
          <label className={styles.label}>Gradient Start Color:</label>

          <div
            className={styles.colorPreview}
            style={{ backgroundColor: heroImageFilters.gradientStartColor }}
            onClick={() => setShowColorPicker1(!showColorPicker1)}
          ></div>

          {showColorPicker1 && (
            <div className={styles.colorPickerOverlay}>
              <SketchPicker
                color={heroImageFilters.gradientStartColor}
                onChangeComplete={(color) => {
                  updateHeroFilterValue({
                    name: 'gradientStartColor',
                    value: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
                  });
                  // setShowColorPicker1(false);
                }}
              />
              <button onClick={() => setShowColorPicker1(false)}>Done</button>
            </div>
          )}
        </div>

        <div>
          <label className={styles.label}>Gradient End Color:</label>

          <div
            className={styles.colorPreview}
            style={{ backgroundColor: heroImageFilters.gradientEndColor }}
            onClick={() => setShowColorPicker2(!showColorPicker2)}
          ></div>

          {showColorPicker2 && (
            <div className={styles.colorPickerOverlay}>
              <SketchPicker
                color={heroImageFilters.gradientEndColor}
                onChangeComplete={(color) => {
                  updateHeroFilterValue({
                    name: 'gradientEndColor',
                    value: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
                  });
                  // setShowColorPicker1(false);
                }}
              />
              <button onClick={() => setShowColorPicker2(false)}>Done</button>
            </div>
          )}
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

      {modifiedHeroImage && (
        <div className={styles.modifiedImage}>
          <label className={styles.label}>Modified Image:</label>
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
