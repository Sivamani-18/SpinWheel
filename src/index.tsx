import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
import SpinBase from './assets/SpinBase.png';
import defaultTickingSound from './assets/audio/spin-wheel-sound.mp3';
import './SpinWheel.css';

export type Sector = {
  color: string;
  text: string;
  label: string;
};

export type SpinWheelProps = {
  sectors: Sector[];
  size?: number;
  onSpinEnd?: (sector: Sector) => void;
  spinButtonText?:
    | string
    | ((isSpinning: boolean, currentLabel: string) => string);
  labelFontSize?: number;
  spinButtonFontSize?: number;
  spinButtonStyles?: React.CSSProperties;
  spinButtonArrowStyle?: React.CSSProperties;
  spinButtonClassName?: string;
  spinButtonArrowColor?: string;
  wheelBaseWidth?: string | number;
  wheelBaseBottom?: string | number;
  customModalContent?: (winner: Sector, onClose: () => void) => React.ReactNode;
  enableSound?: boolean;
  customSound?: string;
  spinDuration?: number;
  easingFunction?: (t: number) => number;
};

export type SpinWheelHandle = {
  spin: () => void;
};

const TAU = 2 * Math.PI;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const SpinWheel = forwardRef<SpinWheelHandle, SpinWheelProps>(
  (
    {
      sectors,
      size = 300,
      onSpinEnd = () => {},
      spinButtonText,
      labelFontSize = 16,
      spinButtonFontSize = 16,
      spinButtonStyles = {},
      spinButtonArrowStyle = {},
      spinButtonClassName = '',
      spinButtonArrowColor = '#fff',
      wheelBaseWidth = '80%',
      wheelBaseBottom = '-45px',
      customModalContent,
      enableSound = true,
      customSound,
      spinDuration = 5000,
      easingFunction,
    },
    ref
  ) => {
    const [imageHeight, setImageHeight] = useState(0);
    const [winner, setWinner] = useState<Sector | null>(null);
    const [showModal, setShowModal] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const angleRef = useRef(0);
    const startTimeRef = useRef<number | null>(null);
    const targetAngleRef = useRef(0);
    const spinningRef = useRef(false);
    const soundRef = useRef<HTMLAudioElement | null>(
      typeof window !== 'undefined'
        ? new Audio(customSound || defaultTickingSound)
        : null
    );

    const arc = TAU / sectors.length;

    const drawWheel = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rad = size / 2;
      ctx.clearRect(0, 0, size, size);

      sectors.forEach((sector, i) => {
        const ang = arc * i;
        ctx.beginPath();
        ctx.fillStyle = sector.color;
        ctx.moveTo(rad, rad);
        ctx.arc(rad, rad, rad, ang, ang + arc);
        ctx.lineTo(rad, rad);
        ctx.fill();

        ctx.save();
        ctx.translate(rad, rad);
        ctx.rotate(ang + arc / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = sector.text;
        ctx.font = `bold ${labelFontSize}px sans-serif`;
        ctx.fillText(sector.label, rad - 10, labelFontSize / 2);
        ctx.restore();
      });
    };

    const rotateCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.transform = `rotate(${angleRef.current}rad)`;
      }
    };

    const getCurrentSector = () => {
      const adjustedAngle = (angleRef.current + Math.PI / 2) % TAU;
      const index =
        Math.floor(sectors.length - (adjustedAngle / TAU) * sectors.length) %
        sectors.length;
      return sectors[index];
    };

    const animate = (timestamp: number) => {
      if (!spinningRef.current || startTimeRef.current === null) return;

      const elapsed = timestamp - startTimeRef.current;
      const t = Math.min(1, elapsed / spinDuration);
      const eased = (easingFunction || easeOutCubic)(t);
      const currentAngle = targetAngleRef.current * eased;

      angleRef.current = currentAngle;
      rotateCanvas();

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        spinningRef.current = false;

        if (soundRef.current) {
          soundRef.current.pause();
          soundRef.current.currentTime = 0;
        }

        const finalSector = getCurrentSector();
        setWinner(finalSector);
        setShowModal(true);
        onSpinEnd(finalSector);
      }
    };

    const handleSpin = () => {
      if (!spinningRef.current) {
        const spins = Math.floor(Math.random() * 3) + 4;
        const sectorIndex = Math.floor(Math.random() * sectors.length);
        const finalAngle =
          TAU * spins + arc * (sectors.length - sectorIndex) - arc / 2;

        targetAngleRef.current = finalAngle;
        startTimeRef.current = performance.now();
        spinningRef.current = true;

        if (enableSound && soundRef.current) {
          soundRef.current.loop = true;
          soundRef.current.currentTime = 0;
          soundRef.current.play().catch(console.warn);
        }

        requestAnimationFrame(animate);
      }
    };

    useImperativeHandle(ref, () => ({
      spin: handleSpin,
    }));

    const getButtonText = () => {
      const currentLabel = getCurrentSector().label;
      if (typeof spinButtonText === 'function') {
        return spinButtonText(spinningRef.current, currentLabel);
      }
      return spinButtonText || (spinningRef.current ? currentLabel : 'SPIN');
    };

    useEffect(() => {
      drawWheel();
    }, [sectors, labelFontSize]);

    return (
      <div
        className='spin-the-wheel-container'
        style={{ width: size, height: size + imageHeight }}
      >
        <div className='relative-wrapper'>
          <div className='bulb-ring'>
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className='bulb'
                style={{
                  transform: `rotate(${(360 / 24) * i}deg) translate(${
                    size / 2
                  }px)`,
                }}
              />
            ))}
          </div>

          <canvas id='wheel' ref={canvasRef} width={size} height={size} />

          <button
            id='spin'
            onClick={handleSpin}
            className={`spin-button ${spinButtonClassName}`}
            style={{
              fontSize: `${spinButtonFontSize}px`,
              ...spinButtonStyles,
            }}
          >
            {getButtonText()}
            <span
              className='spin-arrow'
              style={{
                position: 'absolute',
                top: '-17px',
                border: '10px solid transparent',
                borderBottomColor: spinButtonArrowColor,
                borderTop: 'none',
                content: '""',
                ...spinButtonArrowStyle,
              }}
            />
          </button>
        </div>

        <img
          ref={imgRef}
          onLoad={() => {
            if (imgRef.current) {
              setImageHeight(imgRef.current.offsetHeight);
            }
          }}
          src={SpinBase}
          alt='wheel base'
          className='wheel-base-img'
          style={{
            width:
              typeof wheelBaseWidth === 'number'
                ? `${wheelBaseWidth}px`
                : wheelBaseWidth,
            bottom:
              typeof wheelBaseBottom === 'number'
                ? `${wheelBaseBottom}px`
                : wheelBaseBottom,
          }}
        />

        {showModal &&
          winner &&
          (customModalContent ? (
            customModalContent(winner, () => setShowModal(false))
          ) : (
            <div className='win-modal'>
              <div className='modal-content'>
                <h2>🎉 You won: {winner.label}!</h2>
                <button onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          ))}
      </div>
    );
  }
);

export default SpinWheel;
