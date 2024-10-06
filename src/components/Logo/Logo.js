import React from 'react';
import Tilt from 'react-parallax-tilt';
import Neural from './Neural.png';
import './Logo.css';

const Logo = () => {
	return (
		<div className="logo-container">
			<Tilt className="tilt-component" options={{ max: 55 }}>
				<div className="tilt-inner">
					<img className="logo-image" alt="logo" src={Neural} />
				</div>
			</Tilt>
		</div>
	);
}

export default Logo;