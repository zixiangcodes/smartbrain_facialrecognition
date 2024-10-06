import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box, onImageLoad }) => {
	return (
		<div className="face-recognition-container">
			<div className="image-container">
				<img
					id="inputimage"
					alt=""
					src={imageUrl}
					className="input-image"
					onLoad={() => onImageLoad(imageUrl)}
				/>
				{box && Object.keys(box).length > 0 && (
					<div
						className="bounding-box"
						style={{
							top: box.topRow,
							right: box.rightCol,
							bottom: box.bottomRow,
							left: box.leftCol
						}}
					></div>
				)}
			</div>
		</div>
	);
}

export default FaceRecognition;

// old code:
// const FaceRecognition = ({ imageUrl, box }) => {
// 	return (
// 		<div className="face-recognition-container">
// 			<div className="image-container">
// 				<img id="inputimage" alt="" src={imageUrl} className="input-image" />
// 				<div
// 					className="bounding-box"
// 					style={{
// 						'--top': box.topRow,
// 						'--right': box.rightCol,
// 						'--bottom': box.bottomRow,
// 						'--left': box.leftCol
// 					}}
// 				></div>
// 			</div>
// 		</div>
// 	);
// }