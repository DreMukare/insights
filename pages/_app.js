import '../styles/global.css';

/**
 * Component to expose global styles to entire application
 */

const App = ({ Component, pageProps }) => {
	return <Component {...pageProps} />;
};

export default App;
