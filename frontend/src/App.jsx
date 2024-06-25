import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>YOLOv5 Object Detection</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Submit</button>
      {result && <img src={`data:image/jpeg;base64,${result}`} alt="Result" />}
    </div>
  );
}

export default App;

