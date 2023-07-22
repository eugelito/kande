import React from "react";
import { Image } from "cloudinary-react";

const FullScreenImage = ({ galleryImage, cloudName }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black">
      <Image
        cloudName={cloudName}
        publicId={galleryImage.public_id}
        version={new Date().getTime()}
        className="h-auto max-w-full max-h-full"
        loading="lazy"
      />
    </div>
  );
};

export default FullScreenImage;
