import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Login from "./Login";
import Gallery from "./Gallery";

const UploadWidget = () => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const inputPasscodeRef = useRef(null);
  const [uploadWidget, setUploadWidget] = useState(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
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
        tags: ["wedding"],
        folder: "wedding",
        resourceType: "image",
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
          setUploadSuccess(true);
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
      window.scrollTo(0, 700);
    }
  };

  return (
    <>
      <div className="mb-6">
        <div className="bg-white flex flex-wrap items-center justify-center w-full mt-4 mb-4 rounded-2xl">
          {uploadSuccess && (
            <div
              class="bg-[#869380] text-white rounded-b px-4 py-3 shadow-md"
              role="alert"
            >
              <div class="flex">
                <div class="py-1">
                  <svg
                    class="fill-current h-6 w-6 white mr-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                  </svg>
                </div>
                <div>
                  <b>Image(s) uploaded successfully! </b> It may take a moment
                  to appear in the gallery below. Please <b>refresh the page</b>{" "}
                  after a minute if it hasn't appeared.
                </div>
              </div>
            </div>
          )}
          {!isUserAuthenticated && showLogin ? (
            <Login uploadWidget={uploadWidget} />
          ) : (
            <button
              className="bg-[#869380] hover:bg-[#d2adad] text-white font-bold pl-8 pr-8 py-2 px-4 rounded inline-flex items-center fixed bottom-0 mb-8"
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
              <span>Upload image</span>
            </button>
          )}
        </div>
        <Gallery images={images} />
      </div>
    </>
  );
};

export default UploadWidget;
