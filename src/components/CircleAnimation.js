import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CircleAnimation = () => {
  const circleRefs = useRef([]);
  const numLayers = 10;
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    // Set up audio context and analyser
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      const animate = () => {
        if (analyserRef.current && dataArrayRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const frequency = dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length / 256;

          circleRefs.current.forEach((circle, index) => {
            gsap.to(circle, {
              duration: 0.1,
              scale: 1 + frequency * (index + 1) * 0.1,
              opacity: 1 - frequency * (index + 1) * 0.05,
            });
          });
        } else {
          // Breathing effect when animation is at rest
          gsap.to(circleRefs.current, {
            duration: 3,
            scale: 1.02,
            yoyo: true,
            repeat: -1,
            ease: 'power1.inOut',
          });
        }

        requestAnimationFrame(animate);
      };

      animate();
    });
  }, []);

  return (
    <div className="circle-container">
      {[...Array(numLayers)].map((_, index) => (
        <div
          key={index}
          className="circle"
          ref={(el) => (circleRefs.current[index] = el)}
        />
      ))}
    </div>
  );
};

export default CircleAnimation;
