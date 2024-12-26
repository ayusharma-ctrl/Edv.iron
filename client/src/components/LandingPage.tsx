/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ModeToggle } from './common/ToggleTheme';
import { useEffect, useRef } from 'react';

const LandingPage = () => {

  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let vantaEffect: any;

    if ((window as any)?.VANTA) {
      vantaEffect = (window as any)?.VANTA?.FOG({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
      });
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy(); // clean up on component unmount
      }
    };
  }, []);

  return (
    <div ref={vantaRef} className="min-h-screen flex flex-col items-start justify-center text-white p-8">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <h1 className="text-6xl font-bold mb-4 dark:text-black">Welcome to Edv.Iron</h1>
      <p className="text-2xl mb-8 dark:text-black">Simplifying school payments and transactions</p>
      <Link to="/dashboard">
        <Button size="lg" className="text-lg bg-white text-black dark:bg-black dark:text-white">
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default LandingPage;
