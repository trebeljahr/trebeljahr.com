import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { IUniform, ShaderMaterial, Vector2 } from "three";

type Props = {
  otherUniforms?: { [uniform: string]: IUniform<any> };
  fragmentShader: string;
};

export function FullCanvasShader({
  otherUniforms = {},
  fragmentShader,
}: Props) {
  const shaderRef = useRef<ShaderMaterial>(null!);
  const { size } = useThree();

  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.u_time.value = clock.getElapsedTime();
      shaderRef.current.uniforms.u_resolution.value.set(
        size.width,
        size.height
      );
    }
  });

  return (
    <mesh key={Math.random()}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={shaderRef}
        uniforms={{
          ...otherUniforms,
          u_time: { value: 0 },
          u_resolution: { value: new Vector2(size.width, size.height) },
          u_pixelRatio: { value: window.devicePixelRatio },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
