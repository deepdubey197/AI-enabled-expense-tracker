import React, { useCallback, useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';

export const TextExtraction = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("");

  const convertImageToText = useCallback(async () => {
    if (!selectedImage) return;

    try {
      const { data } = await Tesseract.recognize(selectedImage, 'eng', {
        logger: (info) => console.log(info),
      });

      setTextResult(data.text);
    } catch (error) {
      console.error('Error during recognition:', error);
    }
  }, [selectedImage]);

  useEffect(() => {
    convertImageToText();
  }, [selectedImage, convertImageToText]);

  const handleChangeImage = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    } else {
      setSelectedImage(null);
      setTextResult('');
    }
  };

  return (
    <div className="TextExtraction">
      <h1>ImText</h1>
      <p>Gets words in an image!</p>
      <div className="input-wrapper">
        <label htmlFor="upload">Upload Image</label>
        <input type="file" id="upload" accept="image/*" onChange={handleChangeImage} />
      </div>

      <div className="result">
        {selectedImage && (
          <div className="box-image">
            <img src={URL.createObjectURL(selectedImage)} alt="thumb" />
          </div>
        )}
        {textResult && (
          <div className="box-p">
            <p>{textResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};