/**
 * MainView Component - Serves as the main container for rendering child components.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered within the main container
 * 
 * @returns {JSX.Element} MainView component
 */
const MainView = ({ children }) => {
    return <main>{children}</main>;
};

export default MainView;
