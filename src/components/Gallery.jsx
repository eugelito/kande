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
          `https://res.cloudinary.com/${cloudName}/image/list/wedding.json?${Date.now()}`
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
    setIsFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
    setFullScreenImageIndex(null);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (
        isFullScreen &&
        (event.key === "ArrowLeft" || event.key === "ArrowRight")
      ) {
        event.stopPropagation();
        event.preventDefault();
        if (event.key === "ArrowLeft") {
          showPreviousImage();
        } else if (event.key === "ArrowRight") {
          showNextImage();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isFullScreen, fullScreenImageIndex]);

  const handleShowPrevious = () => {
    if (fullScreenImageIndex > 0) {
      setFullScreenImageIndex(fullScreenImageIndex - 1);
    } else {
      setFullScreenImageIndex(galleryImages.length - 1);
    }
  };

  const handleShowNext = () => {
    if (fullScreenImageIndex < galleryImages.length - 1) {
      setFullScreenImageIndex(fullScreenImageIndex + 1);
    } else {
      setFullScreenImageIndex(0);
    }
  };

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

      if (touchDelta > 400) {
        showNextImage();
      } else if (touchDelta < -400) {
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
          <div key={index} onClick={() => handleImageClick(index)}>
            <Image
              key={galleryImage.public_id}
              cloudName={cloudName}
              publicId={galleryImage.public_id}
              className={`${
                fullScreenImageIndex === index && isFullScreen
                  ? "fullscreen-image"
                  : "object-cover w-full h-full max-w-full rounded-lg hover:cursor-pointer"
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
          onClose={handleCloseFullScreen}
          onShowPrevious={handleShowPrevious}
          onShowNext={handleShowNext}
        />
      )}
    </>
  );
};

export default Gallery;
