import React from "react";
import './FaceRecognition.css'

const FaceRecogniton = ({ imageUrl, box }) => {
    console.log('box',box);
  return (
    <div className="center ma">
      <div className='absolute mt2'>
        <img id='inputimage' alt={""} src={imageUrl} width='500px' height ='auto' />
        <div className='boundingbox' style ={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.left_col,}}></div>
      </div>
    </div>
  );
};

export default FaceRecogniton;
