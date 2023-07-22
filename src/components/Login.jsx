import { forwardRef, useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = forwardRef(({ uploadWidget }, inputRef) => {
  const [passcode, setPasscode] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const login = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(
      auth,
      "eugelito@outlook.com",
      passcode.toLowerCase()
    )
      .then(() => {
        setShowErrorMessage(false);
        uploadWidget.open();
      })
      .catch((error) => {
        console.log(error);
        setShowErrorMessage(true);
      });
  };

  return (
    <form className="w-full max-w-xs pb-8" ref={inputRef}>
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="passcode"
      >
        Passcode
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline required:border-red-400 "
        id="passcode"
        type="password"
        placeholder="Please enter the passcode"
        required={showErrorMessage}
        value={passcode}
        onChange={(e) => {
          setPasscode(e.target.value);
          setShowErrorMessage(false);
        }}
      />
      {showErrorMessage && (
        <p className="mt-2 text-xs text-red-400">
          <b>Oops!</b> You have entered an incorrect passcode. Try again or
          contact{" "}
          <a
            href="mailto:eugelito@outlook.com?subject=karenandeuge.co.uk"
            className="underline text-green hover:text-blush"
          >
            eugelito@outlook.com
          </a>
        </p>
      )}
      <div className="flex items-end justify-between">
        <button
          className="bg-[#869380] hover:bg-[#d2adad] text-white font-bold py-2 px-4 mt-3 rounded focus:outline-none focus:shadow-outline "
          type="submit"
          onClick={login}
        >
          <svg
            className="w-[18px] h-[18px] text-white mr-2 inline-flex"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 15"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 7.5h11m0 0L8 3.786M12 7.5l-4 3.714M12 1h3c.53 0 1.04.196 1.414.544.375.348.586.82.586 1.313v9.286c0 .492-.21.965-.586 1.313A2.081 2.081 0 0 1 15 14h-3"
            />
          </svg>
          Log in to upload
        </button>
      </div>
    </form>
  );
});

export default Login;
