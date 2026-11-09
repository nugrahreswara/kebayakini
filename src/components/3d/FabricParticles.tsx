'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function FabricParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  // Generate particle positions in a wave pattern
  const particleCount = 2000;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const radius = 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
  }

  // Handle mouse movement
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (event) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    });
  }

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const time = clock.getElapsedTime();
      
      // Rotate the entire particle system
      pointsRef.current.rotation.x = time * 0.05;
      pointsRef.current.rotation.y = time * 0.075;

      // Subtle movement towards mouse
      pointsRef.current.rotation.x += mousePosition.current.y * 0.05;
      pointsRef.current.rotation.y += mousePosition.current.x * 0.05;

      // Wave effect
      const positionAttribute = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positionAttribute.array[i3];
        const z = positionAttribute.array[i3 + 2];
        
        positionAttribute.array[i3 + 1] = 
          positions[i3 + 1] + Math.sin(time + x * 0.5) * 0.3 + Math.cos(time + z * 0.5) * 0.3;
      }
      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#E0A96D"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </>
  );
}
