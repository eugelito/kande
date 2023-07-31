import React from "react";
import { Image } from "cloudinary-react";

const FullScreenImage = ({
  galleryImage,
  cloudName,
  onClose,
  onShowPrevious,
  onShowNext,
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black">
      <div className="relative w-full h-full flex items-center justify-center">
        <button
          className="absolute top-1/2 left-4 -translate-y-1/2 z-50 text-white text-4xl font-bold bg-transparent border-none focus:outline-none"
          onClick={onShowPrevious}
        >
          &#8249;
        </button>
        <Image
          cloudName={cloudName}
          publicId={galleryImage.public_id}
          version={new Date().getTime()}
          className="h-auto max-w-full max-h-full"
          loading="lazy"
        />
        <button
          className="absolute top-1/2 right-4 -translate-y-1/2 z-50 text-white text-4xl font-bold bg-transparent border-none focus:outline-none"
          onClick={onShowNext}
        >
          &#8250;
        </button>
      </div>
      <button
        className="absolute top-4 right-12 z-50 text-white text-xl font-bold"
        onClick={onClose}
      >
        X
      </button>
    </div>
  );
};

export default FullScreenImage;
