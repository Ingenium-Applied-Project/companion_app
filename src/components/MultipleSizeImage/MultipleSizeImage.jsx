'use client';

import { useApp } from '@/providers/appProvider';
import { useEffect, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import styles from './MultipleSizeImage.module.css';

function MultipleSizeImage() {
  const [resizedImage, setResizedImage] = useState(null);

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

  useEffect(() => {
    if (heroImage) {
      console.log('Use Effect heroImage:', heroImage);
      resizeImage(heroImage);
    }
  }, [heroImage, resizedImage]);

  const handleHeroImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await setHeroSourceImage({ image: e.target.files[0] });
    }
  };

  const resizeImage = async (file) => {
    console.log('file:', file);
    try {
      // const image = await resizeFile(file);
      setResizedImage(await resizeFile(file));
    } catch (err) {
      console.log(err);
    }
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'base64'
      );
    });

  return (
    <div className={styles.container}>
      <h2>MultipleSizeImage</h2>

      {/* Upload Button */}
      <div>
        <input
          type="file"
          onChange={handleHeroImageUpload}
          accept="image/*"
          title="Upload Hero Image"
        />
      </div>

      <div>
        <div>
          {heroImage && <img src={heroImage} alt="Original Hero Image" />}
        </div>
      </div>

      {modifiedHeroImage && (
        <div>
          <img src={modifiedHeroImage} alt="Modified" />
          <div>
            <button onClick={downloadModifiedHeroImage}>Download</button>
          </div>
        </div>
      )}

      <div>
        {resizedImage && <img src={resizedImage} alt="Resized Hero Image" />}
      </div>
    </div>
  );
}

export default MultipleSizeImage;
