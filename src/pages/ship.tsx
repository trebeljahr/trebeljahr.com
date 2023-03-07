export default function Page() {
  return <></>;
}

Page.canvas = () => {
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};
