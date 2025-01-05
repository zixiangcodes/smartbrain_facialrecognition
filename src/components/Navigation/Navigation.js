import React from 'react';
import './Navigation.css';

const Navigation = ({ onRouteChange, isSignedIn }) => {
	if (isSignedIn) {
		return (
			<nav className="navigation">
				<p onClick={() => onRouteChange('signout')} className="nav-link"> Sign Out </p>
			</nav>
		);
	} else {
		return (
			<nav className="navigation">
				<p onClick={() => onRouteChange('SignIn')} className="nav-link"> Sign In </p>
				<p onClick={() => onRouteChange('Register')} className="nav-link"> Register </p>
				{/* <p onClick={() => onRouteChange('Home')} className="nav-link"> Home </p> */}
				{/* To remove ^^ this direct access link once app has been completed. To access home page */}
			</nav>
		);
	}
}

export default Navigation;