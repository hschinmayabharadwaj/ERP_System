import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial, RoundedBox, Html } from "@react-three/drei";
import * as THREE from 'three';
import { cn } from "../../lib/utils";

/**
 * CardContent Component - Renders HTML content with parallax effect
 */
const CardContent = ({ content, cardRotation, mousePosition, viewport }) => {
  const contentRef = useRef(null);
  const parallaxAmount = 0.1;

  useFrame(() => {
    if (contentRef.current && cardRotation && mousePosition && viewport) {
      const parallaxX = -cardRotation.y * parallaxAmount * 10;
      const parallaxY = cardRotation.x * parallaxAmount * 10;

      contentRef.current.position.x = parallaxX;
      contentRef.current.position.y = parallaxY;
    }
  });

  return (
    <group ref={contentRef} position={[0, 0, 0.7]}>
      <Html transform pointerEvents="none">
        <div>{content}</div>
      </Html>
    </group>
  );
};

/**
 * Scene Component - 3D scene with card mesh and lighting
 */
const Scene = ({
  children,
  maxRotation = 0.05,
  scale = 1.2,
  position = [0, 0, 0],
  color = "#111",
  opacity = 0.9,
  reflective = true,
  title,
  content,
  rotationSmoothness = 0.1,
  hoverScale = 1.03,
  hoverLift = 0.3,
  hoverColor = "#333",
  hoverLightIntensity = 5,
  dynamicLight = true,
}) => {
  const group = useRef(null);
  const cardMesh = useRef(null);
  const dynamicLightRef = useRef(null);

  const [hover, setHover] = useState(false);
  const { mouse, viewport } = useThree();

  const targetRotation = useRef(new THREE.Vector3(0, 0, 0));
  const targetScale = useRef(scale);
  const targetZ = useRef(position[2]);
  const targetColor = useRef(new THREE.Color(color));
  const baseColor = useRef(new THREE.Color(color));
  const hoverColorTarget = useRef(new THREE.Color(hoverColor));

  useEffect(() => {
    baseColor.current.set(color);
    hoverColorTarget.current.set(hoverColor);
    targetScale.current = scale;
    targetZ.current = position[2];
    targetColor.current.set(color);
  }, [scale, position, color, hoverColor]);

  useEffect(() => {
    if (hover) {
      targetScale.current = scale * hoverScale;
      targetZ.current = position[2] + hoverLift;
      targetColor.current.set(hoverColor);
    } else {
      targetScale.current = scale;
      targetZ.current = position[2];
      targetColor.current.set(color);
    }
  }, [hover, scale, position, hoverScale, hoverLift, color, hoverColor]);

  useFrame(() => {
    if (!group.current || !cardMesh.current) return;

    const rotationTargetX = mouse.y * -maxRotation;
    const rotationTargetY = mouse.x * maxRotation;

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      hover ? rotationTargetX : 0,
      rotationSmoothness
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      hover ? rotationTargetY : 0,
      rotationSmoothness
    );

    group.current.scale.x = group.current.scale.y = group.current.scale.z = THREE.MathUtils.lerp(
      group.current.scale.x,
      targetScale.current,
      rotationSmoothness
    );

    group.current.position.z = THREE.MathUtils.lerp(
      group.current.position.z,
      targetZ.current,
      rotationSmoothness
    );

    if (cardMesh.current.material) {
      const material = cardMesh.current.material;
      if (material.color) {
        material.color.lerp(targetColor.current, rotationSmoothness * 0.5);
      }
    }

    if (dynamicLightRef.current && dynamicLight) {
      const lightOffset = new THREE.Vector3(
        group.current.rotation.y * 5,
        -group.current.rotation.x * 5 + 3,
        2
      );

      lightOffset.applyEuler(group.current.rotation);
      dynamicLightRef.current.position.copy(lightOffset);
      dynamicLightRef.current.intensity = THREE.MathUtils.lerp(
        dynamicLightRef.current.intensity,
        hover ? hoverLightIntensity : 0,
        rotationSmoothness
      );
    }
  });

  return (
    <group
      ref={group}
      scale={5}
      position={position}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <RoundedBox ref={cardMesh} args={[12, 8.4, 0.4]} radius={0.4} smoothness={10} castShadow receiveShadow>
        {reflective ? (
          <MeshReflectorMaterial
            color={color}
            roughness={0.2}
            metalness={0.8}
            opacity={opacity}
            transparent={opacity < 1}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.7}
            opacity={opacity}
            transparent={opacity < 1}
          />
        )}
      </RoundedBox>

      <CardContent
        title={title}
        content={content}
        cardRotation={group.current ? group.current.rotation : undefined}
        mousePosition={mouse}
        viewport={viewport}
      />

      {dynamicLight && (
        <pointLight
          ref={dynamicLightRef}
          position={[0, 0, 0]}
          intensity={0}
          distance={15}
          decay={2}
          color="#ffffff"
          castShadow
          visible={false}
        />
      )}

      <group position={[0, 0, 0.16]}>
        {children}
      </group>
    </group>
  );
};

/**
 * Card3D Component - Main wrapper component for 3D card with Canvas
 */
const Card3D = ({
  children,
  className,
  maxRotation,
  scale = 0.8,
  position,
  color = "#111",
  opacity = 0.9,
  reflective = true,
  title,
  content,
  rotationSmoothness,
  hoverScale,
  hoverLift,
  hoverColor,
  hoverLightIntensity,
  dynamicLight,
}) => {
  return (
    <div className={cn("h-[300px] w-[400px] relative", className)}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 23], fov: 20 }}
        flat
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 25]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-5, -10, -10]} intensity={0.3} />
        <directionalLight position={[0, -10, 5]} color="blue" />
        <directionalLight position={[10, 0, 5]} intensity={0.4} color="blue" />

        <Scene
          maxRotation={maxRotation}
          scale={scale}
          position={position}
          color={color}
          opacity={opacity}
          reflective={reflective}
          title={title}
          content={content}
          rotationSmoothness={rotationSmoothness}
          hoverScale={hoverScale}
          hoverLift={hoverLift}
          hoverColor={hoverColor}
          hoverLightIntensity={hoverLightIntensity}
          dynamicLight={dynamicLight}
        >
          {children}
        </Scene>
      </Canvas>
    </div>
  );
};

export default Card3D;
