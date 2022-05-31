import CrystallizeLogo from '~/assets/crystallizeLogo.svg';

export const Footer = () => {
    return (
        <div className="2xl container w-full mx-auto py-8 sm:px-6 flex mt-60 items-center">
            <img src={`${CrystallizeLogo}`} alt="Crystallize logo" width="38" height="31" />
            <p>
                Powered by{' '}
                <a href="https://crystallize.com" className="underline">
                    Crystallize
                </a>
            </p>
        </div>
    );
};
