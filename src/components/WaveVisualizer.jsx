import React, { useRef, useEffect, useState } from 'react';

const WaveVisualizer = ({ onSpeakingChange, onStartSpeaking, onStopSpeaking,className }) => {
  const canvasRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationIdRef = useRef(null);

  const handleSpeakingChange = (speaking) => {
    setIsSpeaking(speaking);
    onSpeakingChange(speaking);
  };

  const draw = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    const sliceWidth = (canvas.width * 1.0) / analyser.fftSize;
    let x = 0;
    let sum = 0;

    for (let i = 0; i < analyser.fftSize; i++) {
      const v = dataArray[i] / 128.0;
      if (isNaN(v) || v === undefined) {
        continue;
      }
      const y = (v * canvas.height) / 2;
      const absValue = Math.abs(v - 1);
      sum += absValue;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

    const average = sum / analyser.fftSize;

    if (average > 0.009) { // Ajusta el umbral según sea necesario
      if (!isSpeaking) {
        setIsSpeaking(true);
        handleSpeakingChange(true);
      }
    } 
    if (average < 0.009) {
      if (!isSpeaking) {
        setIsSpeaking(false);
        handleSpeakingChange(false);
      }
    }
    animationIdRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    const handleSuccess = (stream) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      draw();
    };

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(handleSuccess)
      .catch((err) => {
        console.error('Error accediendo al micrófono:', err);
      });

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return <div className={className}><canvas ref={canvasRef} style={{ maxHeight: '3rem', width: '100%' }} /></div>;
};

export default WaveVisualizer;