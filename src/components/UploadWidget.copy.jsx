import React, { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { auth } from "../firebase";
import Login from "./Login";

const UploadWidget = () => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const [uploadWidget, setUploadWidget] = useState(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [images, setImages] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      setIsUserAuthenticated(user !== null);
    });

    return () => {
      listen();
    };
  }, []);

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dkpqtkm74",
        uploadPreset: "mngtywa2",
        sources: ["local"],
        styles: {
          // styles configuration here...
        },
      },
      function (error, result) {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          setImages((prev) => [...prev, { url: result.info.secure_url }]);
        }
      }
    );
    setUploadWidget(widgetRef.current);

    // Fetch the images from the Cloudinary gallery using the Cloudinary API
    axios
      .get("https://api.cloudinary.com/v1_1/dkpqtkm74/resources", {
        params: {
          type: "upload",
          prefix: "v1689717711", // Replace this with the prefix of your Cloudinary gallery
          max_results: 20, // Replace this with the number of images to fetch
        },
      })
      .then((res) => {
        const imageUrls = res.data.resources.map((resource) => resource.url);
        setImages(imageUrls);
      })
      .catch((error) => {
        console.error("Error fetching images from Cloudinary gallery:", error);
      });
  }, []);

  const handleUploadClick = () => {
    if (isUserAuthenticated) {
      widgetRef.current.open();
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  };

  const handleImageClick = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-center w-full mb-4">
        {!isUserAuthenticated && showLogin ? (
          <Login uploadWidget={uploadWidget} />
        ) : (
          <button
            className="bg-[#869380] text-white font-bold py-2 px-4 rounded inline-flex items-center hover:bg-[#d2adad]"
            onClick={handleUploadClick}
          >
            <svg
              className="mr-1"
              fill="#fff"
              height="18"
              viewBox="0 0 24 24"
              width="18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
            </svg>
            <span>Upload image or video</span>
          </button>
        )}
      </div>
      <hr className="mb-4 text-gray-100 opacity-90" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="grid gap-4">
          {images.map((imageUrl, index) => (
            <img
              key={index}
              className="h-auto max-w-full rounded-lg hover:cursor-pointer"
              src={imageUrl}
              alt={`Image ${index}`}
              loading="lazy"
              onClick={handleImageClick}
            />
          ))}
        </div>
      </div>
      {isFullScreen && (
        <div className="fullscreen-overlay" onClick={handleImageClick}>
          <img
            className="fullscreen-image"
            src={images[0]} // Use the first image for full-screen display
            alt=""
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

export default UploadWidget;
