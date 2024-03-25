'use client';

import { useApp } from '@/providers/appProvider';
import { useEffect, useRef, useState } from 'react';
// import ImageResize from './ImageResizer';

import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';
import styles from './MultipleSizeImage.module.css';

import { CanvasPreview } from '@/components/MultipleSizeImage/CanvasPreview';
import { UseDebounceEffect } from './UseDebounceEffect';

function MultipleSizeImage() {
  let ASPECTRATIO = 1;

  const [imgSrc, setImgSrc] = useState('');
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const hiddenAnchorRef = useRef(null);
  const blobUrlRef = useRef('');
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(1);

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
    if (modifiedHeroImage) {
      setCrop(undefined); // Makes crop preview update between images.
      setImgSrc(modifiedHeroImage);
    }
  }, [modifiedHeroImage]);

  const handleHeroImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files);
      await setHeroSourceImage({ image: e.target.files[0] });
    }
  };

  function onImageLoad(e) {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

    const crop = centerCrop(
      makeAspectCrop(
        {
          // You don't need to pass a complete crop into
          // makeAspectCrop or centerCrop.
          unit: '%',
          width: 100,
        },
        1,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  }

  function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  // function onImageLoad(e) {
  //   if (aspect) {
  //     const { width, height } = e.currentTarget;
  //     setCrop(centerAspectCrop(width, height, aspect));
  //   }
  // }

  async function onDownloadCropClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: 'image/png',
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);

    if (hiddenAnchorRef.current) {
      hiddenAnchorRef.current.href = blobUrlRef.current;
      hiddenAnchorRef.current.click();
    }
  }

  UseDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        CanvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else {
      setAspect(ASPECTRATIO);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, ASPECTRATIO);
        setCrop(newCrop);
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  }

  return (
    <div className={styles.container}>
      <h2>MultipleSizeImage</h2>

      {/* Upload Button */}
      <div>
        <label htmlFor="hero-image-upload">
          Upload image to add gradient and crop
        </label>
        <input
          id="hero-image-upload"
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

      {/* *************************************************** */}

      <div>
        <div>
          {/* <input
            type="file"
            accept="image/*"
            onChange={handleHeroImageUpload}
          /> */}
          <div>
            <label htmlFor="scale-input">Scale: </label>
            <input
              id="scale-input"
              type="number"
              step="0.1"
              value={scale}
              disabled={!imgSrc}
              onChange={(e) => setScale(Number(e.target.value))}
            />
          </div>

          {/* <div>
            <label htmlFor="rotate-input">Rotate: </label>
            <input
              id="rotate-input"
              type="number"
              value={rotate}
              disabled={!imgSrc}
              onChange={(e) =>
                setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
              }
            />
          </div> */}

          <div>
            <button onClick={handleToggleAspectClick}>
              Toggle aspect {aspect ? 'off' : 'on'}
            </button>
          </div>
        </div>
        {!!imgSrc && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            // minWidth={400}
            minHeight={100}
            // circularCrop
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        )}
        {!!completedCrop && (
          <>
            <div>
              <canvas
                ref={previewCanvasRef}
                style={{
                  border: '1px solid black',
                  objectFit: 'contain',
                  width: completedCrop.width,
                  height: completedCrop.height,
                }}
              />
            </div>
            <div>
              <button onClick={onDownloadCropClick}>Download Crop</button>
              <div style={{ fontSize: 12, color: '#666' }}>
                If you get a security error when downloading try opening the
                Preview in a new tab (icon near top right).
              </div>
              <a
                href="#hidden"
                ref={hiddenAnchorRef}
                download
                style={{
                  position: 'absolute',
                  top: '-200vh',
                  visibility: 'hidden',
                }}
              >
                Hidden download
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MultipleSizeImage;
