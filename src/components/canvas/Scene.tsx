import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";

export default function Scene({ children, ...props }) {
  return (
    <Canvas {...props}>
      <directionalLight intensity={0.75} />
      <ambientLight intensity={0.75} />
      {children}
      <Preload all />
      <OrbitControls />
    </Canvas>
  );
}
