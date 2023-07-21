import honeymoonImage from "/honeymoon.jpeg";

const IntroHeader = () => {
  return (
    <div className="intro-header">
      <div className="text-center mb-4 flex flex-col items-center">
        <b className="text-xl text-blush mt-4">We're married!</b>
        <h1 className="text-green">Karen & Eugelito</h1>
        <b className="text-xl text-blush">06 July 2023</b>
        <img
          className="mt-4 rounded-lg bg-blend-lighten	shadow-[8px_8px_0px_0px_rgba(240,219,188)]"
          src={honeymoonImage}
        ></img>
      </div>
      <p className="max-w-2xl p-4 rounded-2xl">
        To our cherished family and friends, your presence and support on our
        wedding day filled our hearts with love and joy.{" "}
        <b>Please share your captured moments on this website</b>, so everyone
        can relive and enjoy the beautiful memories.
      </p>
    </div>
  );
};

export default IntroHeader;
