import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Cloud, Clouds } from '@pmndrs/vanilla';

const CloudComponent = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        // Add clouds
        const clouds = new Clouds({ texture: new THREE.TextureLoader().load('/cloud.png') });
        scene.add(clouds);

        // Create a single cloud
        const cloud = new Cloud({
            segments: 40,
            bounds: new THREE.Vector3(10, 5, 5),
            volume: 8,
            color: new THREE.Color('white'),
            opacity: 0.6,
        });
        cloud.position.set(0, 0, -5); // Position the cloud in front of the camera
        clouds.add(cloud);

        camera.position.z = 15;

        const clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const elapsed = clock.getElapsedTime();
            clouds.update(camera, elapsed, delta);
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
    }, []);

    return <div ref={containerRef} className="absolute inset-0 z-20" />;
};

export default CloudComponent;
