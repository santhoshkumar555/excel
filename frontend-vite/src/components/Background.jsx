import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Background = () => {
    const containerRef = useRef();
    const threeRef = useRef({
        scene: null,
        camera: null,
        renderer: null,
        particles: null,
        lines: null,
        animationFrameId: null
    });

    useEffect(() => {
        const { current } = threeRef;
        const particleCount = 200;
        const lineDistance = 150;
        const mainColor = 0x6366f1;

        let lineGeometry = new THREE.BufferGeometry();

        const updateLines = () => {
            const positions = current.particles.children[0].geometry.attributes.position.array;
            const linePositions = [];
            const maxLines = 1000;
            let lineCount = 0;

            for (let i = 0; i < particleCount; i++) {
                for (let j = i + 1; j < particleCount; j++) {
                    const dx = positions[i * 3] - positions[j * 3];
                    const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                    const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < lineDistance && lineCount < maxLines) {
                        linePositions.push(
                            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                        );
                        lineCount++;
                    }
                }
            }

            lineGeometry.setAttribute(
                'position',
                new THREE.Float32BufferAttribute(linePositions, 3)
            );
            current.lines.children[0].geometry = lineGeometry;
        };

        const animate = () => {
            current.animationFrameId = requestAnimationFrame(animate);

            current.particles.rotation.y += 0.0005;
            current.particles.rotation.x += 0.0002;

            const posArray = current.particles.children[0].geometry.attributes.position.array;
            for (let i = 0; i < posArray.length; i++) {
                posArray[i] += (Math.random() - 0.5) * 0.05;
            }
            current.particles.children[0].geometry.attributes.position.needsUpdate = true;

            updateLines();
            current.renderer.render(current.scene, current.camera);
        };

        const onWindowResize = () => {
            if (!current.camera || !current.renderer) return;
            current.camera.aspect = window.innerWidth / window.innerHeight;
            current.camera.updateProjectionMatrix();
            current.renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const init = () => {
            current.scene = new THREE.Scene();
            current.scene.background = new THREE.Color(0x000000);

            current.camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );
            current.camera.position.z = 250;

            current.renderer = new THREE.WebGLRenderer({ antialias: true });
            current.renderer.setSize(window.innerWidth, window.innerHeight);
            if (containerRef.current) {
                containerRef.current.appendChild(current.renderer.domElement);
            }

            current.particles = new THREE.Group();
            const particleMaterial = new THREE.PointsMaterial({
                color: mainColor,
                size: 3,
                blending: THREE.AdditiveBlending,
                transparent: true
            });
            const particleGeometry = new THREE.BufferGeometry();
            const positions = [];
            for (let i = 0; i < particleCount; i++) {
                const x = (Math.random() - 0.5) * 500;
                const y = (Math.random() - 0.5) * 500;
                const z = (Math.random() - 0.5) * 500;
                positions.push(x, y, z);
            }
            particleGeometry.setAttribute(
                'position',
                new THREE.Float32BufferAttribute(positions, 3)
            );
            current.particles.add(new THREE.Points(particleGeometry, particleMaterial));
            current.scene.add(current.particles);

            current.lines = new THREE.Group();
            const lineMaterial = new THREE.LineBasicMaterial({
                color: mainColor,
                transparent: true,
                opacity: 0.1
            });
            current.lines.add(new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial));
            current.scene.add(current.lines);
        };

        init();
        onWindowResize();
        window.addEventListener('resize', onWindowResize);
        animate();

        return () => {
            window.removeEventListener('resize', onWindowResize);
            if (current.animationFrameId) {
                cancelAnimationFrame(current.animationFrameId);
            }
            if (current.renderer && current.renderer.domElement) {
                current.renderer.domElement.remove(); // just remove canvas
            }
            // do NOT dispose scene/renderer/geometry here — it breaks animation on refresh
        };
    }, []);

    return <div ref={containerRef} className="fixed inset-0 z-[-1] overflow-hidden"></div>;
};

export default Background;
