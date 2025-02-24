

const HomeView = ({ model, strings }) => {
    

    return (
        <div className="flex items-center justify-center w-full h-full">
            <p className="italic text-xl">{strings.welcome}</p>
        </div>
    );
};

export default HomeView;
