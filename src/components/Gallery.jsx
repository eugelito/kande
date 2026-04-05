import React, { useEffect, useState, useRef, useMemo } from "react";
import { Image, Transformation } from "cloudinary-react";
import axios from "axios";
import FullScreenImage from "./FullScreenImage";

function mergeServerAndOptimistic(server, optimistic) {
  const ids = new Set(server.map((r) => r.public_id));
  const extra = optimistic.filter(
    (r) => r && r.public_id && !ids.has(r.public_id)
  );
  return [...server, ...extra];
}

const Gallery = ({
  refreshKey = 0,
  optimisticUploads = [],
  onListSynced,
}) => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(null);
  const cloudName = import.meta.env.VITE_CLOUDINARYCLOUDNAME;
  const containerRef = useRef(null);
  const touchStartX = useRef(null);
  const onListSyncedRef = useRef(onListSynced);
  onListSyncedRef.current = onListSynced;

  const displayImages = useMemo(
    () => mergeServerAndOptimistic(galleryImages, optimisticUploads),
    [galleryImages, optimisticUploads]
  );

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const cacheBust =
          refreshKey > 0 ? `?cb=${refreshKey}` : "";
        const response = await axios.get(
          `https://res.cloudinary.com/${cloudName}/image/list/wedding.json${cacheBust}`
        );
        const resources = response.data.resources ?? [];
        setGalleryImages(resources);
        onListSyncedRef.current?.(resources);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [cloudName, refreshKey]);

  useEffect(() => {
    if (refreshKey === 0) return;
    const t = window.setTimeout(() => {
      const cacheBust = `?cb=${refreshKey}r${Date.now()}`;
      axios
        .get(
          `https://res.cloudinary.com/${cloudName}/image/list/wedding.json${cacheBust}`
        )
        .then((response) => {
          const resources = response.data.resources ?? [];
          setGalleryImages(resources);
          onListSyncedRef.current?.(resources);
        })
        .catch(() => {});
    }, 3000);
    return () => window.clearTimeout(t);
  }, [cloudName, refreshKey]);

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
  }, [isFullScreen, fullScreenImageIndex, displayImages.length]);

  const handleShowPrevious = () => {
    if (fullScreenImageIndex > 0) {
      setFullScreenImageIndex(fullScreenImageIndex - 1);
    } else {
      setFullScreenImageIndex(displayImages.length - 1);
    }
  };

  const handleShowNext = () => {
    if (fullScreenImageIndex < displayImages.length - 1) {
      setFullScreenImageIndex(fullScreenImageIndex + 1);
    } else {
      setFullScreenImageIndex(0);
    }
  };

  const showPreviousImage = () => {
    if (fullScreenImageIndex > 0) {
      setFullScreenImageIndex(fullScreenImageIndex - 1);
    } else {
      setFullScreenImageIndex(displayImages.length - 1);
    }
  };

  const showNextImage = () => {
    if (fullScreenImageIndex < displayImages.length - 1) {
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
      const touchDelta = touchEndX - touchStartX.current;

      if (touchDelta > 100) {
        showPreviousImage();
      } else if (touchDelta < -100) {
        showNextImage();
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
        onTouchEnd={() => {
          touchStartX.current = null;
        }}
      >
        {displayImages.map((galleryImage, index) => (
          <div key={galleryImage.public_id} onClick={() => handleImageClick(index)}>
            <Image
              cloudName={cloudName}
              publicId={galleryImage.public_id}
              version={galleryImage.version}
              className={`${
                fullScreenImageIndex === index && isFullScreen
                  ? "fullscreen-image"
                  : "object-cover w-full h-full max-w-full rounded-lg hover:cursor-pointer"
              }`}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 50vw, 25vw"
              alt=""
            >
              <Transformation
                fetchFormat="auto"
                quality="auto"
                crop="fill"
                width="600"
                height="600"
                gravity="auto"
              />
            </Image>
          </div>
        ))}
      </div>
      {isFullScreen && fullScreenImageIndex !== null && (
        <FullScreenImage
          galleryImage={displayImages[fullScreenImageIndex]}
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
