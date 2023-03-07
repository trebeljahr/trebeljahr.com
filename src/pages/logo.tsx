import Instructions from "@/components/dom/Instructions";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import Logo from "@components/canvas/Logo";

export default function Page() {
  return (
    <>
      <Instructions>
        This is a minimal starter for Nextjs + React-three-fiber and Threejs.
        Click on the <span className="text-cyan-200">atoms nucleus</span> to
        navigate to the <span className="text-green-200">/blob</span> page.
        OrbitControls are enabled by default.
      </Instructions>
      <Canvas>
        <directionalLight intensity={0.75} />
        <ambientLight intensity={0.75} />
        <Preload all />
        <OrbitControls />
        <Logo scale={0.5} route="/blob" position-y={-1} />;
      </Canvas>
    </>
  );
}

export async function getStaticProps() {
  return { props: { title: "Logo" } };
}
