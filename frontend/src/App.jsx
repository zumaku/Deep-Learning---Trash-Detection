import { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const App = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [detectionResult, setDetectionResult] = useState(null);

    const capture = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const formData = new FormData();
        formData.append(
            "file",
            dataURLtoFile(imageSrc, "snapshot.jpg"),
            "snapshot.jpg"
        );

        try {
            const response = await axios.post(
                "http://localhost:5000/predict",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setDetectionResult(response.data.result);
        } catch (error) {
            console.error(error);
        }
    };

    const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const drawDetection = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
        };
        img.src = `data:image/jpeg;base64,${detectionResult}`;
    };

    return (
        <div>
            <h1>Realtime Object Detection</h1>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={640}
                    height={480}
                    style={{ margin: "auto" }}
                />
            </div>
            <button onClick={capture}>Capture</button>
            {detectionResult && (
                <div style={{ textAlign: "center" }}>
                    <h2>Detected Objects</h2>
                    <canvas ref={canvasRef} />
                    <button onClick={drawDetection}>Draw Detection</button>
                </div>
            )}
        </div>
    );
};

export default App;
