import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function FloatPlane({ position, color, opacity, phase, amplitude }) {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = position[1] + Math.sin(t * 0.18 + phase) * amplitude;
    meshRef.current.rotation.z = Math.sin(t * 0.13 + phase) * 0.04;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[4.8, 3.6, 1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

export default function WorkDepthField() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 48 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }} dpr={[1, 1.3]} className="w-full h-full">
      <FloatPlane position={[-1.8, 0.45, -1.7]} color="#f5cfe0" opacity={0.06} phase={0.2} amplitude={0.1} />
      <FloatPlane position={[1.6, -0.4, -1.2]} color="#f8dfeb" opacity={0.05} phase={1.2} amplitude={0.08} />
      <FloatPlane position={[0, -0.8, -2.1]} color="#f3bdd7" opacity={0.045} phase={2.1} amplitude={0.07} />
    </Canvas>
  );
}
