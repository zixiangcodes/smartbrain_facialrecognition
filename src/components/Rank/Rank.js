import React from 'react';
import './Rank.css';

const Rank = ({ name = 'User', entries = 0 }) => {
	return (
		<div className="rank-container">
			<div className="rank-text">
				{`${name}, your current entry count is...`}
				{/* Note: You don't need to add entries, as its already added below */}
			</div>
			<div className="rank-number">
				[ {entries} ]
			</div>
		</div>
	);
}

export default Rank;