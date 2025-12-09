import React, { useEffect, useRef } from 'react';

const FloatingAudioWaves = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };

    const drawWave = (amplitude, frequency, speed, color, yOffset) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2 + yOffset);

      for (let x = 0; x < canvas.width; x++) {
        const y = 
          Math.sin(x * frequency + time * speed) * amplitude +
          Math.cos(x * frequency * 0.7 + time * speed * 1.3) * amplitude * 0.5;
        ctx.lineTo(x, canvas.height / 2 + y + yOffset);
      }

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, `${color}00`);
      gradient.addColorStop(0.3, color);
      gradient.addColorStop(0.7, color);
      gradient.addColorStop(1, `${color}00`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.3;

      // Draw multiple audio waves
      drawWave(30, 0.01, 0.02, '#a855f7', 0); // Purple wave
      drawWave(40, 0.008, -0.03, '#3b82f6', 50); // Blue wave
      drawWave(25, 0.012, 0.04, '#8b5cf6', -50); // Indigo wave

      time += 0.05;
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
};

export default FloatingAudioWaves;