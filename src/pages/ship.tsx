import { PointerLockControls, Sky } from "@react-three/drei";
import dynamic from "next/dynamic";

const Ship = dynamic(() => import("../components/canvas/Ship"), { ssr: false });

export default function Page() {
  return <></>;
}

Page.canvas = () => {
  return (
    <>
      <Sky azimuth={1} inclination={0.6} distance={1000} />
      <PointerLockControls />
      <Ship />
    </>
  );
};
