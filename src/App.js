//import logo from './logo.svg';
import './App.css';
import React, {useRef} from 'react';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';

function App() {
  //setup
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  //load facemesh
  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: {width: 640, height: 480},
      scale: 0.8
    });
    setInterval(() => {
      detect(net)
    }, 100);
  };

  //detect function
  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" && 
      webcamRef.current !== null && 
      webcamRef.current.video.readyState === 4) {
        //get video properties
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        //set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        //set canvas width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        //make detections
        const face = await net.estimateFaces(video);
        console.log(face);

        //get canvas context for drawing
        //const ctx = canvasRef.current.getContext("2d");
        //requestAnimationFrame(()=>{detect(net)});

      }
  };

  runFacemesh();
  return (
    <div className="App">
      <Webcam ref={webcamRef} style={
        {
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zindex: 9,
          width: 640,
          height: 480
        }
      }/>
      <canvas ref={canvasRef} style={
        {
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zindex: 9,
          width: 640,
          height: 480
        }
      }/>
    </div>
  );
}

export default App;
