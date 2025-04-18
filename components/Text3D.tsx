'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Environment, Float, OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';

export interface Text3DProps {
  width?: number;
  height?: number;
  className?: string;
}

function TextScene() {
  const textRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[1, 1, 1]} intensity={1} />
      <Center>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group ref={textRef}>
            <Text3D
              font="/fonts/helvetiker_regular.typeface.json"
              size={0.8}
              height={0.12}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.02}
              bevelSize={0.02}
              bevelOffset={0}
              bevelSegments={5}
              position={[0, 0.4, 0]}
            >
              Jenjang
              <meshStandardMaterial color="#1CC5AE" roughness={0.2} metalness={0.8} />
            </Text3D>
            <Text3D
              font="/fonts/helvetiker_regular.typeface.json"
              size={0.8}
              height={0.12}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.02}
              bevelSize={0.02}
              bevelOffset={0}
              bevelSegments={5}
              position={[0, -0.4, 0]}
            >
              Karir
              <meshStandardMaterial color="#5A4FCF" roughness={0.2} metalness={0.8} />
            </Text3D>
          </group>
        </Float>
      </Center>
      <OrbitControls enableZoom={false} />
      <Environment preset="city" />
    </>
  );
}

export default function Text3DScene({ width = 600, height = 400, className = '' }: Text3DProps) {
  return (
    <div style={{ width, height }} className={className}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <TextScene />
      </Canvas>
    </div>
  );
} 