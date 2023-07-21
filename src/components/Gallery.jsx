import { useEffect, useState } from "react";
import { Buffer } from "buffer";

const Gallery = ({ images }) => {
  const [galleryImages, setGalleryImages] = useState([images]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      const cloudName = import.meta.env.VITE_CLOUDINARYCLOUDNAME;

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`,
          {
            headers: {
              Authorization: `Basic ${Buffer.from(
                import.meta.env.VITE_CLOUDINARYAPIKEY +
                  ":" +
                  import.meta.env.VITE_CLOUDINARYAPISECRET
              ).toString("base64")}`,
            },
          }
        );
        setGalleryImages(response.data);
        console.log(response.data);
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
        {galleryImages.map((imageUrl, index) => (
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
        ))}
      </div>
      <hr />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="grid gap-4">
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg"
              alt=""
            />
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg"
              alt=""
            />
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg"
              alt=""
            />
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Gallery;
