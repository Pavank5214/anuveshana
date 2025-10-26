import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text3D } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { CSG } from "three-csg-ts";

export default function DualNamePlank() {
  const [nameA, setNameA] = useState("Alice");
  const [nameB, setNameB] = useState("Bob");
  const meshRef = useRef();

  const fontUrl = "/fonts/helvetiker_regular.typeface.json";

  useEffect(() => {
    if (!meshRef.current) return;

    // Create base plank
    const plank = new THREE.Mesh(
      new THREE.BoxGeometry(8, 1, 1.2),
      new THREE.MeshStandardMaterial({ color: "#deb887" })
    );

    // Create name A (front)
    const textGeoA = new THREE.TextGeometry(nameA, {
      font: new THREE.FontLoader().parse(require(fontUrl)),
      size: 0.7,
      height: 0.2,
    });
    const textMeshA = new THREE.Mesh(textGeoA, new THREE.MeshStandardMaterial({ color: "black" }));
    textMeshA.position.set(-3, 0, 0.6);

    // Create name B (side)
    const textGeoB = new THREE.TextGeometry(nameB, {
      font: new THREE.FontLoader().parse(require(fontUrl)),
      size: 0.7,
      height: 0.2,
    });
    const textMeshB = new THREE.Mesh(textGeoB, new THREE.MeshStandardMaterial({ color: "black" }));
    textMeshB.rotation.y = Math.PI / 2;
    textMeshB.position.set(0.6, 0, 0);

    // Merge them all
    let csgPlank = CSG.fromMesh(plank);
    csgPlank = csgPlank.union(CSG.fromMesh(textMeshA));
    csgPlank = csgPlank.union(CSG.fromMesh(textMeshB));

    const result = CSG.toMesh(csgPlank, new THREE.Matrix4());
    result.material = new THREE.MeshStandardMaterial({ color: "#deb887" });

    // Update reference mesh
    meshRef.current.geometry.dispose();
    meshRef.current.geometry = result.geometry;
  }, [nameA, nameB]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Input fields */}
      <div className="mb-4 flex gap-2">
        <input
          value={nameA}
          onChange={(e) => setNameA(e.target.value)}
          placeholder="Left Name"
          className="border p-2 rounded"
        />
        <input
          value={nameB}
          onChange={(e) => setNameB(e.target.value)}
          placeholder="Right Name"
          className="border p-2 rounded"
        />
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [6, 4, 6] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} />
        <OrbitControls />

        {/* Final merged plank */}
        <mesh ref={meshRef}>
          <meshStandardMaterial color="#deb887" />
        </mesh>
      </Canvas>
    </div>
  );
}
