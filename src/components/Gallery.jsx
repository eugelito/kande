import React, { useEffect, useState, useRef } from "react";
import { Image } from "cloudinary-react";
import axios from "axios";
import FullScreenImage from "./FullScreenImage";

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(null);
  const cloudName = import.meta.env.VITE_CLOUDINARYCLOUDNAME;
  const containerRef = useRef(null);
  const touchStartX = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `https://res.cloudinary.com/${cloudName}/image/list/wedding.json`
        );
        setGalleryImages(response.data.resources);
        console.log(response.data.resources);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const handleImageClick = (index) => {
    setFullScreenImageIndex(index);
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isFullScreen) {
        if (event.key === "ArrowLeft") {
          showPreviousImage();
        } else if (event.key === "ArrowRight") {
          showNextImage();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullScreen]);

  const showPreviousImage = () => {
    if (fullScreenImageIndex > 0) {
      setFullScreenImageIndex(fullScreenImageIndex - 1);
    } else {
      setFullScreenImageIndex(galleryImages.length - 1);
    }
  };

  const showNextImage = () => {
    if (fullScreenImageIndex < galleryImages.length - 1) {
      setFullScreenImageIndex(fullScreenImageIndex + 1);
    } else {
      setFullScreenImageIndex(0);
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (isFullScreen) {
      const touchEndX = e.touches[0].clientX;
      const touchDelta = touchStartX.current - touchEndX;

      if (touchDelta > 100) {
        showNextImage();
      } else if (touchDelta < -100) {
        showPreviousImage();
      }
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {galleryImages.map((galleryImage, index) => (
          <div
            key={index}
            className={`${
              fullScreenImageIndex === index && isFullScreen
                ? "fullscreen-overlay"
                : ""
            }`}
            onClick={() => handleImageClick(index)}
          >
            <Image
              key={galleryImage.public_id}
              cloudName={cloudName}
              publicId={galleryImage.public_id}
              className={`${
                fullScreenImageIndex === index && isFullScreen
                  ? "fullscreen-image"
                  : "h-auto max-w-full rounded-lg hover:cursor-pointer"
              }`}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      {isFullScreen && fullScreenImageIndex !== null && (
        <FullScreenImage
          galleryImage={galleryImages[fullScreenImageIndex]}
          cloudName={cloudName}
        />
      )}
    </>
  );
};

export default Gallery;
