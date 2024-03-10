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

  return (
    <div className={styles.container}>
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
        <p>Step 3</p>
        <div>View</div>
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
//   <div>
//     <label className={styles.label}>Gradient Start Height:</label>
//     <input
//       type="range"
//       name="gradientStartHeight"
//       min="0"
//       max="100"
//       value={heroImageFilters.gradientStartHeight * 100}
//       onChange={handleFilterChange}
//       className={styles.rangeInput}
//     />
//   </div>
//   <div>
//     <label className={styles.label}>Gradient End Height:</label>
//     <input
//       type="range"
//       name="gradientEndHeight"
//       min="0"
//       max="100"
//       value={heroImageFilters.gradientEndHeight * 100}
//       onChange={handleFilterChange}
//       className={styles.rangeInput}
//     />
//   </div>
//   <div>
//     <label className={styles.label}>Gradient Start Color:</label>
//     <input
//       type="color"
//       name="gradientStartColor"
//       value={heroImageFilters.gradientStartColor}
//       onChange={handleFilterChange}
//       className={styles.colorInput}
//     />
//   </div>
//   <div>
//     <label className={styles.label}>Gradient End Color:</label>
//     <input
//       type="color"
//       name="gradientEndColor"
//       value={heroImageFilters.gradientEndColor}
//       onChange={handleFilterChange}
//       className={styles.colorInput}
//     />
//   </div>
//   <div>
//     <label className={styles.label}>Fill Rect Height:</label>
//     <input
//       type="range"
//       name="fillRectHeight"
//       min="0"
//       max="100"
//       value={heroImageFilters.fillRectHeight * 100}
//       onChange={handleFilterChange}
//       className={styles.rangeInput}
//     />
//   </div>
//   <div>
//     <label className={styles.label}>Quality:</label>
//     <input
//       type="range"
//       name="exportQuality"
//       min="1"
//       max="100"
//       value={heroImageFilters.exportQuality * 100}
//       onChange={handleFilterChange}
//       className={styles.rangeInput}
//     />
//   </div>
// </div>
// <div className={styles.modifiedImage}>
//   {modifiedHeroImage && (
//     <img
//       src={modifiedHeroImage}
//       alt="Modified"
//       className={styles.image}
//     />
//   )}
// </div>
// <div className={styles.downloadButton}>[Download button]</div>
// </div>
