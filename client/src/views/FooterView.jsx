const FooterView = ({strings}) => {
    return (
        <footer className="bg-gray-800 text-white text-center py-4 w-full">
            <div className="flex flex-col md:flex-row items-center justify-between px-6 max-w-screen-lg mx-auto">
                {/* Text box 1 */}
                <p className="text-sm md:text-base">IV1201 at KTH</p>

                {/* Text box 2 */}
                <p className="text-sm md:text-base mt-2 md:mt-0">
                    {strings.created_by}
                </p>
            </div>
        </footer>
    );
};

export default FooterView;