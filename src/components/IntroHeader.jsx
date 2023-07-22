import honeymoonImage from "/honeymoon.jpeg";

const IntroHeader = () => {
  return (
    <div className="intro-header bg-white shadow-2xl rounded-2xl">
      <div className="items-center mb-4 flex flex-col">
        <img
          className="mt-4 bg-blend-lighten rounded-2xl"
          src={honeymoonImage}
        ></img>
        <b className="text-xl text-blush mt-4">We're married!</b>
        <h1 className="text-green">Karen & Eugelito</h1>
        <b className="text-xl text-blush">6 July 2023</b>
      </div>
      <hr className="w-1/4 mx-auto mb-4" />
      <p className="max-w-2xl pt-0 p-4 rounded-2xl text-justify">
        To our cherished family and friends, your presence and support on our
        wedding day filled our hearts with love and joy.{" "}
        <b>Please share your captured moments on this website</b>, so everyone
        can relive and enjoy the beautiful memories.
      </p>
    </div>
  );
};

export default IntroHeader;
