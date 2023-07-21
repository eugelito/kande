import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Login from "./Login";
import Gallery from "./Gallery";

const UploadWidget = () => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const [uploadWidget, setUploadWidget] = useState(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [images, setImages] = useState([]);

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
        folder: "wedding",
        styles: {
          palette: {
            window: "#FFF",
            windowBorder: "#90A0B3",
            tabIcon: "#869380",
            menuIcons: "#869380",
            textDark: "#869380",
            textLight: "#FFFFFF",
            link: "#869380",
            action: "#FF620C",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1",
          },
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
  }, []);

  const handleUploadClick = () => {
    if (isUserAuthenticated) {
      widgetRef.current.open();
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  };

  return (
    <>
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
        <Gallery images={images} />
      </div>
    </>
  );
};

export default UploadWidget;
