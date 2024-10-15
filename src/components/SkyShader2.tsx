import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const SkyShader2: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [manualTime, setManualTime] = useState<number | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const skyRef = useRef<Sky | null>(null);
    const clockRef = useRef(new THREE.Clock());
    const [sliderValue, setSliderValue] = useState(0);
    const [initialTime] = useState(5.9); // Just before dawn (6:00 AM)

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        cameraRef.current = camera;
        const renderer = new THREE.WebGLRenderer();
        rendererRef.current = renderer;

        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        // Sky
        const sky = new Sky();
        skyRef.current = sky;
        sky.scale.setScalar(450000);
        scene.add(sky);

        const sun = new THREE.Vector3();

        const effectController = {
            turbidity: 1.6,
            rayleigh: 0.214,
            mieCoefficient: 0.002,
            mieDirectionalG: 0.831,
            elevation: 32.5,
            azimuth: 175.6,
            exposure: 0.1887
        };

        const uniforms = sky.material.uniforms;

        const updateSky = (time: number) => {
            // Calculate sun position based on time (0-24 seconds)
            const dayProgress = (time % 24) / 24;

            // Sun positions and parameters
            const nightValues = {
                elevation: -20,
                azimuth: 140,
                turbidity: 15.9,
                rayleigh: 4,
                mieCoefficient: 0.093,
                mieDirectionalG: 1,
                exposure: 0.3731
            };
            const preSunriseValues = {
                elevation: -5,
                azimuth: 180,
                turbidity: 15.9,
                rayleigh: 4,
                mieCoefficient: 0.093,
                mieDirectionalG: 1,
                exposure: 0.3731
            };
            const sunriseValues = {
                elevation: 0,
                azimuth: 180,
                turbidity: 6.5,
                rayleigh: 1.394,
                mieCoefficient: 0.035,
                mieDirectionalG: 0.902,
                exposure: 0.4591
            };
            const noonValues = {
                elevation: 42.5,
                azimuth: 160,
                turbidity: 0.1,
                rayleigh: 1.214,
                mieCoefficient: 0.022,
                mieDirectionalG: 0.97,
                exposure: 0.1887
            };
            const sunsetValues = {
                elevation: 0,
                azimuth: 140,
                turbidity: 12.4,
                rayleigh: 1.148,
                mieCoefficient: 0.027,
                mieDirectionalG: 0.865,
                exposure: 0.4223
            };

            let currentValues;
            let fadeEffect = 1;

            if (dayProgress < 0.2) { // Night to pre-sunrise
                currentValues = lerpObjects(nightValues, preSunriseValues, dayProgress * 5);
                fadeEffect = Math.min(1, dayProgress * 5); // Start fading in
            } else if (dayProgress < 0.25) { // Pre-sunrise to sunrise
                currentValues = lerpObjects(preSunriseValues, sunriseValues, (dayProgress - 0.2) * 20);
                fadeEffect = Math.min(1, (dayProgress - 0.2) * 20); // Continue fading in
            } else if (dayProgress < 0.5) { // Sunrise to noon
                currentValues = lerpObjects(sunriseValues, noonValues, (dayProgress - 0.25) * 4);
            } else if (dayProgress < 0.75) { // Noon to sunset
                currentValues = lerpObjects(noonValues, sunsetValues, (dayProgress - 0.5) * 4);
            } else { // Sunset to night
                currentValues = lerpObjects(sunsetValues, nightValues, (dayProgress - 0.75) * 4);
                fadeEffect = Math.max(0, 1 - ((dayProgress - 0.75) * 4)); // Fade out
            }

            Object.assign(effectController, currentValues);

            // Apply fade effect to exposure
            effectController.exposure *= fadeEffect;

            uniforms['turbidity'].value = effectController.turbidity;
            uniforms['rayleigh'].value = effectController.rayleigh;
            uniforms['mieCoefficient'].value = effectController.mieCoefficient;
            uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

            const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
            const theta = THREE.MathUtils.degToRad(effectController.azimuth);

            sun.setFromSphericalCoords(1, phi, theta);

            uniforms['sunPosition'].value.copy(sun);
            renderer.toneMappingExposure = effectController.exposure;
        };

        // Helper function to interpolate between two objects
        const lerpObjects = (objA: any, objB: any, t: number) => {
            const result: any = {};
            for (const key in objA) {
                if (objA.hasOwnProperty(key) && objB.hasOwnProperty(key)) {
                    result[key] = THREE.MathUtils.lerp(objA[key], objB[key], t);
                }
            }
            return result;
        };

        // Modify the camera position
        camera.position.set(0, 200, 400); // Set x, y, and z positions
        camera.lookAt(new THREE.Vector3(0, 0, 0)); // Make the camera look at the center

        const animate = () => {
            requestAnimationFrame(animate);
            const elapsedTime = isDragging ? (manualTime || initialTime) : clockRef.current.getElapsedTime();
            updateSky(elapsedTime);

            // Update progress for the circle indicator
            setProgress((elapsedTime % 24) / 24);

            // Optional: Add slight camera movement for more dynamism
            camera.position.y = -300 + Math.sin(elapsedTime * 0.1) * 10;
            camera.lookAt(new THREE.Vector3(0, 0, 0));

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, [manualTime, isDragging, initialTime]);

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(event.target.value);
        setManualTime(newTime);
        setSliderValue(newTime);
    };

    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setManualTime(null);
    };

    const isNightTime = (time: number) => {
        const dayProgress = (time % 24) / 24;
        return dayProgress < 0.25 || dayProgress > 0.75;
    };

    const getSliderColor = (time: number) => {
        return isNightTime(time) ? 'rgb(147, 21, 234)' : 'rgb(249, 115, 22)';
    };

    const currentTime = isDragging ? sliderValue : (progress * 24 + initialTime) % 24;
    const currentColor = getSliderColor(currentTime);

    return (
        <div ref={containerRef} className="relative w-full h-full">
            <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                initial={{ width: '3rem', height: '3rem' }}
                animate={{ width: isHovered ? '12rem' : '3rem' }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    className="bg-black bg-opacity-20 rounded-full overflow-hidden flex items-center justify-center relative"
                    style={{
                        boxShadow: `inset 0 0 0 2px ${currentColor}`,
                    }}
                    animate={{
                        width: isHovered ? '100%' : '3rem',
                        height: '3rem',
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <input
                        type="range"
                        min="0"
                        max="24"
                        step="0.1"
                        value={currentTime}
                        onChange={handleTimeChange}
                        onMouseDown={handleDragStart}
                        onMouseUp={handleDragEnd}
                        onTouchStart={handleDragStart}
                        onTouchEnd={handleDragEnd}
                        className="w-full h-full opacity-0 absolute cursor-pointer z-10"
                    />
                    <div
                        className="h-full absolute left-0 top-0 transition-colors duration-300"
                        style={{
                            width: `${(currentTime / 24) * 100}%`,
                            backgroundColor: currentColor,
                        }}
                    ></div>
                    {isHovered ? (
                        <>
                            <SunIcon className="w-6 h-6 text-white opacity-50 absolute left-[24px] top-1/2 transform -translate-y-1/2 z-0" />
                            <MoonIcon className="w-4 h-4 text-white opacity-50 absolute left-3/4 top-1/2 transform -translate-y-1/2 z-0" />
                        </>
                    ) : (
                        isNightTime(isDragging ? sliderValue : progress * 24) ? (
                            <MoonIcon className="w-4 h-4 text-white opacity-50" />
                        ) : (
                            <SunIcon className="w-6 h-6 text-white opacity-50" />
                        )
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SkyShader2;
