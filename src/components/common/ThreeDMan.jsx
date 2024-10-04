import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import manAn from "../../assets/manAn.glb";

const Model = () => {
  const group = useRef();
  const { scene, animations } = useGLTF(manAn);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const danceAction = actions["Armature|mixamo.com|Layer0"];
    if (danceAction) {
      danceAction.play();
    }
  }, [actions]);

  return (
    <primitive ref={group} object={scene} position={[0, -3.5, 0]} scale={2} />
  );
};

const ThreeDMan = ({ onModelLoaded }) => {
  return (
    <div className="w-full h-96">
      <Canvas
        className=""
        camera={{ position: [0, 2, 10], fov: 50 }}
        onCreated={() => onModelLoaded("3D Model Loaded")}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Model />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default ThreeDMan;
