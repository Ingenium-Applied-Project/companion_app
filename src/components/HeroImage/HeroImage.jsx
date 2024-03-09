'use client';

import { useApp } from '@/providers/appProvider';

const HeroImage = () => {
  const { setHeroImageText, heroImageText, setHeroSourceImage } = useApp();

  const handleHeroImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await setHeroSourceImage({ image: e.target.files[0] });
    }
  };

  const handleTextChange = async (e) => {
    setHeroImageText(e.target.value);
  };

  return (
    <div className="container">
      <div className="source-container">
        <div>
          <p>Enter a title for your image:</p>
          <input
            type="text"
            value={heroImageText}
            onChange={handleTextChange}
          />
        </div>
        <p>Upload Hero Image:</p>
        <input type="file" onChange={handleHeroImageUpload} accept="image/*" />
      </div>

      <div className="modified-image-container">
        <div className="filters-container">[Filters here]</div>
        <div className="modified-image">[Image here]</div>
        <div className="download-button"></div>
      </div>
    </div>
  );
};

export default HeroImage;
