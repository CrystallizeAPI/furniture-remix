export const ErrorComponent: React.FC<{ text?: string; code?: number }> = ({ text = 'Not Found', code = 404 }) => {
    return (
        <section className="flex items-center h-screen p-16">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className="mb-8 font-extrabold text-9xl">
                        <span className="sr-only">{text}</span>
                        {code}
                    </h2>
                    <p className="text-2xl font-semibold md:text-3xl mb-10">
                        Sorry, we couldn't {code === 404 ? 'find' : 'load'} this page.
                    </p>
                    <a rel="noopener noreferrer" href="/" className="px-8 py-3 font-semibold rounded bg-buttonBg2">
                        Back to homepage
                    </a>
                </div>
            </div>
        </section>
    );
};
