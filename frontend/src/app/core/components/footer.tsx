import CrystallizeLogo from "~/assets/crystallizeLogo.svg";

export const Footer = () => {
  return (
    <div className="lg:w-content w-full mx-auto p-8 sm:px-6 flex mt-60 items-center">
    <img src={`${CrystallizeLogo}`}/>
      <p>Powered by <a href="https://crystallize.com" className="underline">Crystallize</a></p>
    </div>
  );
};
