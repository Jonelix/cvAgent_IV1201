const HomeView = ({ text, onTextChange, onSearch }) => {
    return (
        <div>
            <input
                type="text"
                value={text}
                onChange={onTextChange}
                placeholder="Search for a player"
            />
            <button onClick={onSearch}>Search</button>
        </div>
    );
};

export default HomeView;
