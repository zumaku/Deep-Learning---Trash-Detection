import { useEffect, useRef, useState } from "react";
import { FaCamera, FaFileImage } from "react-icons/fa6";
import Webcam from "react-webcam";
import axios from "axios";

const App = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const [detectionResult, setDetectionResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // console.log("detectionResult terupdate")
        detectionResult !== null && drawDetection()
    }, [detectionResult])

    useEffect(() => {
        // console.log("isLoading terupdate")
    }, [isLoading])

    const capture = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const formData = new FormData();

        setIsLoading(true);

        formData.append(
            "file",
            dataURLtoFile(imageSrc, "snapshot.jpg"),
            "snapshot.jpg"
        );

        try {
            const response = await axios.post(
                // "http://192.168.7.110:5000/predict",
                "http://127.0.0.1:5000/predict",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setDetectionResult(response.data.result);
            setIsLoading(false)
        } catch (error) {
            console.error(error);
            setIsLoading(false)
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();

        setIsLoading(true);

        formData.append("file", file);

        try {
            const response = await axios.post(
                // "http://192.168.7.110:5000/predict",
                "http://127.0.0.1:5000/predict",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setDetectionResult(response.data.result);
            setIsLoading(false)
        } catch (error) {
            console.error(error);
            setIsLoading(false)
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current.click();
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
        <div className="w-full p-10 flex flex-col items-center m-auto">
            <h1 className="m-auto text-5xl font-bold mb-10 text-center">
                Trash
                <span className="text-green-600"> Classification</span>
            </h1>

            <div className="w-full sm:w-3/4 flex flex-col sm:flex-row justify-between items-center sm:items-start mb-20 gap-4 sm:gap-6">
                <div className="flex flex-col justify-between w-full sm:w-1/2 rounded-xl overflow-hidden">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        // width={640}
                        // height={480}
                        className="mb-3 rounded-b-xl"
                    />
                    <div className="flex gap-2">
                        <button onClick={capture} className="w-full flex justify-center items-center gap-2 rounded-xl font-bold py-3 text-lg bg-green-600 hover:bg-green-700 active:bg-green-800 text-[#242424]">
                            <FaCamera />
                            <p>Capture</p>
                        </button>
                        <button onClick={triggerFileInput} className="w-full flex justify-center items-center gap-2 rounded-xl font-bold py-3 text-lg bg-slate-50 hover:bg-slate-200 active:bg-slate-400 text-[#242424]">
                            <FaFileImage />
                            <p>Upload</p>
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-between w-full sm:w-1/2 rounded-xl overflow-hidden">
                    {!isLoading && detectionResult ? (
                        <canvas
                            ref={canvasRef}
                            className="rounded-xl w-full"
                        />
                    ): (
                        <div className="w-full p-4 aspect-video border-2 border-dashed border-green-500 flex justify-center items-center rounded-xl mb-3">
                            {isLoading ? (
                                <p className="text-gray-300 font-semibold text-center">Loading...</p>
                            ):(
                                <p className="text-gray-300 font-semibold text-center">Hasil deteksi akan tampil disini...</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <h3 className="m-auto text-2xl font-bold text-center">
                Tentang
                <span className="text-green-500"> Aplikasi</span>
            </h3>

            <p className="text-center mb-2">Dalam rangka memenuhi tugas mata kuliah Deep Learning </p>
            <p className="text-center mb-2">Dipersembahkan oleh Para Developer Hebat</p>
            <div className="font-bold text-center" id="footer">
                <a className="hover:underline hover:text-green-600" href="https://www.instagram.com/ahmadgazalizn/">Ahmad Gazali</a> | 
                <a className="hover:underline hover:text-green-600" href="https://www.instagram.com/amrulahsanullah07/"> Amrul Ahsanullah</a> | 
                <a className="hover:underline hover:text-green-600" href="https://www.instagram.com/rfiulmuizk/"> Rafiul Muiz</a> | 
                <a className="hover:underline hover:text-green-600" href="https://www.instagram.com/fajriishar/"> Fajri Ishar</a> | 
                <a className="hover:underline hover:text-green-600" href="https://www.instagram.com/fadliinlov3/"> Zul Fadli</a>
            </div>
        </div>
    );
};

export default App;
