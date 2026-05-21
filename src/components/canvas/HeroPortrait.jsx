import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';

function PortraitMesh() {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = Math.sin(t * 0.55) * 0.065;
    meshRef.current.rotation.x = Math.sin(t * 0.32) * 0.035;
    meshRef.current.rotation.y = Math.cos(t * 0.24) * 0.045;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[4.2, 5.2, 24, 24]} />
      <MeshDistortMaterial color="#fffaf7" distort={0.22} speed={0.75} radius={1} transparent opacity={0.34} />
    </mesh>
  );
}

export default function HeroPortrait() {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }} dpr={[1, 1.5]} className="w-full h-full">
      <ambientLight intensity={1.4} />
      <directionalLight position={[2, 5, 2]} intensity={0.9} />
      <PortraitMesh />
    </Canvas>
  );
}
