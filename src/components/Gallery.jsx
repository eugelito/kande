import React, { useEffect, useState } from "react";
import { Image } from "cloudinary-react";
import axios from "axios";

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(null);
  const cloudName = import.meta.env.VITE_CLOUDINARYCLOUDNAME;

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

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {/* {images.map((imageUrl, index) => (
          <div
            key={index}
            className={`${
              fullScreenImageIndex === index && isFullScreen
                ? "fullscreen-overlay"
                : ""
            }`}
            onClick={() => handleImageClick(index)}
          >
            <img
              className={`${
                fullScreenImageIndex === index && isFullScreen
                  ? "fullscreen-image"
                  : "h-auto max-w-full rounded-lg hover:cursor-pointer"
              }`}
              src={imageUrl.url}
              alt={`Image ${index}`}
              loading="lazy"
            />
          </div>
        ))} */}
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
              version={new Date().getTime()}
              crop="fill"
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
    </>
  );
};

export default Gallery;
