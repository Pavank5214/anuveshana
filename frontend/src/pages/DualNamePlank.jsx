import React, { useState, useRef, useMemo, Suspense, useDeferredValue } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
} from "@react-three/drei";
import * as THREE from "three";
import { Geometry, Base, Intersection } from "@react-three/csg";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Type,
  Palette,
  Layout,
  Box,
  Eye,
  Sparkles,
} from "lucide-react";

/** 
 * 🎨 DUAL NAME PLANK STUDIO - HARMONIZED EDITION 🎨
 * UI components and layout shared with InitialNameStand.jsx and NameKeychain.jsx.
 */

const FONT_URL = "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json";

const ALLOWED_COLORS = [
  { name: 'Orange', hex: '#ff6200' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'Grey', hex: '#737373' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0066cc' },
  { name: 'Green', hex: '#32CD32' },
  { name: 'Yellow', hex: '#FFDE21' },
  { name: 'Purple', hex: '#C986E3' },
  { name: 'Gold', hex: '#D3AF37' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Royal Blue', hex: '#02066F' },
  { name: 'Cyan Blue', hex: '#00FFFF' },
  { name: 'Light Green', hex: '#32CD32' },
  { name: 'Dark Green', hex: '#003314' },
  { name: 'Light Brown', hex: '#C89D7C' },
  { name: 'Dark Brown', hex: '#332421' },
  { name: 'Silver', hex: '#D9D9D9' },
];

const AVAILABLE_SIZES = ['S', 'M', 'L'];

const MAX_NAME_LENGTH = 10;

// Standard Heart shape for balanced 3D extrusion
const createHeartShape = () => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(-1.1, 1.1, -2.1, 2.1, -1.1, 3.1);
  shape.bezierCurveTo(-0.6, 3.6, 0.15, 3.4, 0, 2.5);
  shape.bezierCurveTo(-0.15, 3.4, 0.6, 3.6, 1.1, 3.1);
  shape.bezierCurveTo(2.1, 2.1, 1.1, 1.1, 0, 0);
  return shape;
};

// 🧱 INDIVIDUAL LETTER BLOCK COMPONENT 🧱
const LetterBrick = ({ charA, charB, textColor, materialProps, position }) => {
  const font = useLoader(FontLoader, FONT_URL);

  const { geometryA, geometryB } = useMemo(() => {
    if (!font || !charA || !charB) return { geometryA: null, geometryB: null };
    const config = { font, size: 1.5, height: 6, curveSegments: 4 };

    const gA = new TextGeometry(charA, config);
    const gB = new TextGeometry(charB, config);

    gA.center();
    gB.center();

    return {
      geometryA: BufferGeometryUtils.mergeVertices(gA),
      geometryB: BufferGeometryUtils.mergeVertices(gB)
    };
  }, [charA, charB, font]);

  if (!geometryA || !geometryB) return null;

  return (
    <group position={position} rotation={[0, (30 * Math.PI) / 180, 0]}>
      <mesh castShadow receiveShadow>
        <meshStandardMaterial color={textColor} {...materialProps} />
        <Geometry computeVertexNormals>
          <Base geometry={geometryA} />
          <Intersection geometry={geometryB} rotation={[0, Math.PI / 2, 0]} />
        </Geometry>
      </mesh>
    </group>
  );
};

// ❤️ HEART ILLUSION BRICK COMPONENT ❤️
const HeartBrick = ({ position }) => {
  const { geometryA, geometryB } = useMemo(() => {
    const heartShape = createHeartShape();
    const config = { depth: 5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1 };

    const gA = new THREE.ExtrudeGeometry(heartShape, config);
    const gB = new THREE.ExtrudeGeometry(heartShape, config);

    gA.center();
    gB.center();

    return {
      geometryA: BufferGeometryUtils.mergeVertices(gA),
      geometryB: BufferGeometryUtils.mergeVertices(gB)
    };
  }, []);

  if (!geometryA || !geometryB) return null;

  return (
    <group position={position} rotation={[0, (30 * Math.PI) / 180, 0]} scale={0.5}>
      <mesh castShadow receiveShadow>
        <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.15} />
        <Geometry computeVertexNormals>
          <Base geometry={geometryA} />
          <Intersection geometry={geometryB} rotation={[0, Math.PI / 2, 0]} />
        </Geometry>
      </mesh>
    </group>
  );
};

// 🌟 THE LETTER-BY-LETTER ANAMORPHIC MODEL 🌟
const IllusionModel = ({ nameA, nameB, plankColor, textColor, materialProps }) => {
  const safeA = useDeferredValue(nameA?.trim().toUpperCase() || "NAME");
  const safeB = useDeferredValue(nameB?.trim().toUpperCase() || "NISH");

  const lettersA = safeA.split("");
  const lettersB = safeB.split("").reverse();
  const maxLen = Math.max(lettersA.length, lettersB.length);

  const spacing = 1.8;
  const totalWidth = (maxLen - 1) * spacing + 8.5;

  return (
    <group position={[0, 0.1, 0]}>
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[totalWidth, 0.12, 3.4]} />
        <meshStandardMaterial color={plankColor} roughness={0.8} />
      </mesh>
      <group>
        {Array.from({ length: maxLen }).map((_, i) => (
          <LetterBrick
            key={`${i}-${lettersA[i]}-${lettersB[i]}`}
            charA={lettersA[i] || " "}
            charB={lettersB[i] || " "}
            textColor={textColor}
            materialProps={materialProps}
            position={[(i - (maxLen - 1) / 2) * spacing, 0.8, 0]}
          />
        ))}
      </group>
      <HeartBrick position={[totalWidth / 2 - 1.0, 0.8, 0]} />
    </group>
  );
};

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { toast } from "sonner";

const DualNamePlank = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const guestId = useSelector((state) => state.cart.guestId);

  const [nameA, setNameA] = useState("ABHAY");
  const [nameB, setNameB] = useState("NISHA");
  const [plankColor, setPlankColor] = useState(ALLOWED_COLORS[1].hex); // White
  const [textColor, setTextColor] = useState(ALLOWED_COLORS[0].hex); // Orange
  const [selectedSize, setSelectedSize] = useState(AVAILABLE_SIZES[1]); // M
  const [materialType, setMaterialType] = useState("matte");
  const controlsRef = useRef();


  const materialProps = useMemo(() => {
    switch (materialType) {
      case "metal": return { metalness: 0.85, roughness: 0.18 };
      case "matte": return { metalness: 0.08, roughness: 0.85 };
      case "glossy": return { metalness: 0.12, roughness: 0.12 };
      default: return { metalness: 0.1, roughness: 0.8 };
    }
  }, [materialType]);

  const snapView = (angle) => {
    if (!controlsRef.current) return;
    const baseOffset = (30 * Math.PI) / 180;
    const targetAngle = angle === "front" ? baseOffset : baseOffset + Math.PI / 2;
    const camera = controlsRef.current.object;
    if (camera) {
      const x = Math.sin(targetAngle) * 20;
      const z = Math.cos(targetAngle) * 20;
      camera.position.set(x, 2.5, z);
      controlsRef.current.target.set(0, 0.4, 0);
      controlsRef.current.update();
    }
  };

  const ColorStrip = ({ title, colors, selectedColor, onSelect }) => {
    const selectedName = colors.find(c => c.hex === selectedColor)?.name;

    return (
      <div className="space-y-2.5 lg:space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette size={14} className="text-orange-500" />
            <h3 className="text-[11px] lg:text-xs font-bold text-white uppercase tracking-widest">{title}</h3>
          </div>
          <span className="text-[9px] lg:text-[10px] text-slate-400 font-medium uppercase tracking-wider bg-white/5 px-2 py-1 rounded-md">
            {selectedName || selectedColor}
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5 lg:gap-3 pt-1">
          {colors.map((c) => (
            <button
              key={c.hex}
              onClick={() => onSelect(c.hex)}
              aria-label={`Select ${c.name}`}
              className={`w-8 h-8 lg:w-[38px] lg:h-[38px] rounded-full border-2 transition-all shrink-0 hover:scale-110 focus:outline-none ${selectedColor === c.hex
                ? 'border-orange-500 scale-110 ring-2 ring-orange-500/80 ring-offset-2 ring-offset-[#111620] z-10'
                : 'border-slate-700/50 hover:border-slate-500'
                }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-[100dvh] w-full bg-[#06090F] pt-21 mt-5 lg:pt-24 font-sans flex flex-col lg:flex-row overflow-hidden">
      {/* Preview Area */}
      <div className="h-[45%] lg:h-auto lg:flex-[1.4] relative flex items-center justify-center p-4 lg:p-20 bg-[radial-gradient(circle_at_center,_#111827_0%,_#06090F_100%)] z-0 shrink-0">
        <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
          <Canvas shadows camera={{ position: [13, 7, 16], fov: 38 }}>
            <Suspense fallback={null}>
              <IllusionModel
                nameA={nameA}
                nameB={nameB}
                plankColor={plankColor}
                textColor={textColor}
                materialProps={materialProps}
              />
              <ambientLight intensity={0.6} />
              <directionalLight position={[12, 12, 10]} intensity={1.8} castShadow shadow-bias={-0.0002} />
              <Environment preset="city" background={false} />
            </Suspense>
            <OrbitControls
              ref={controlsRef}
              makeDefault
              minPolarAngle={Math.PI / 5}
              maxPolarAngle={Math.PI / 1.9}
              enablePan={false}
              minDistance={6}
              maxDistance={22}
            />
            <ContactShadows position={[0, -0.08, 0]} opacity={0.6} scale={26} blur={2.8} far={5} />
          </Canvas>
        </div>

        {/* Info Labels */}
        <div className="absolute top-4 left-4 hidden sm:flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
            <Sparkles size={12} className="text-orange-500" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Anamorphic Studio</span>
          </div>
        </div>

        {/* Quick view buttons */}
        <div className="absolute bottom-4 left-4 flex gap-2.5 pointer-events-auto z-20">
          <button onClick={() => snapView("front")} className="px-3.5 mb-5 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 shadow-xl active:scale-95">
            <Eye size={14} className="text-blue-400" /> Side A
          </button>
          <button onClick={() => snapView("side")} className="px-3.5 mb-5 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 shadow-xl active:scale-95">
            <Eye size={14} className="text-orange-400" /> Side B
          </button>
        </div>
      </div>

      {/* Controls Area */}
      <motion.div
        className="h-[55%] lg:h-auto w-full lg:w-[460px] bg-[#121721] lg:bg-[#111620]/95 backdrop-blur-3xl border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.4)] lg:shadow-[-10px_-20px_40px_rgba(0,0,0,0.4)] rounded-t-3xl lg:rounded-t-none"
      >
        {/* Mobile Drawer Handle */}
        <div className="w-full flex justify-center pt-3 pb-1 lg:hidden shrink-0">
          <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>

        <div className="flex-1 overflow-y-auto p-5 lg:p-10 pt-2 lg:pt-10 scrollbar-hide">
          <div className="max-w-md mx-auto space-y-6 lg:space-y-10 pb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 lg:p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-[0_0_15px_rgba(255,98,0,0.15)]">
                  <Layout size={18} className="lg:w-5 lg:h-5" />
                </div>
                <h2 className="text-lg lg:text-2xl font-black text-white uppercase tracking-tighter italic">Personalize</h2>
              </div>
            </div>

            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-5">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Type size={14} className="text-orange-500" />
                      <label className="text-[11px] lg:text-xs font-bold text-white uppercase tracking-widest">Front Name</label>
                    </div>
                    <span className={`text-[10px] font-medium ${nameA.length >= MAX_NAME_LENGTH ? 'text-red-400' : 'text-slate-500'}`}>
                      {nameA.length}/{MAX_NAME_LENGTH}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={nameA}
                    maxLength={MAX_NAME_LENGTH}
                    onChange={(e) => setNameA(e.target.value.toUpperCase().replace(/[^A-Z0-9\s]/g, ""))}
                    className="w-full bg-[#06090F] border border-white/10 rounded-xl px-4 py-3.5 lg:py-4 text-xs lg:text-sm font-bold text-white uppercase tracking-widest focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all shadow-inner placeholder:text-slate-700"
                    placeholder="NAME A"
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Type size={14} className="text-orange-500" />
                      <label className="text-[11px] lg:text-xs font-bold text-white uppercase tracking-widest">Side Name</label>
                    </div>
                    <span className={`text-[10px] font-medium ${nameB.length >= MAX_NAME_LENGTH ? 'text-red-400' : 'text-slate-500'}`}>
                      {nameB.length}/{MAX_NAME_LENGTH}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={nameB}
                    maxLength={MAX_NAME_LENGTH}
                    onChange={(e) => setNameB(e.target.value.toUpperCase().replace(/[^A-Z0-9\s]/g, ""))}
                    className="w-full bg-[#06090F] border border-white/10 rounded-xl px-4 py-3.5 lg:py-4 text-xs lg:text-sm font-bold text-white uppercase tracking-widest focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all shadow-inner placeholder:text-slate-700"
                    placeholder="NAME B"
                  />
                </div>
              </div>

              {/* Color Selection Strips - RESTORED */}
              <div className="space-y-8 px-1">
                <ColorStrip
                  title="Name Color"
                  colors={ALLOWED_COLORS}
                  selectedColor={textColor}
                  onSelect={setTextColor}
                />
                <ColorStrip
                  title="Plank Color"
                  colors={ALLOWED_COLORS}
                  selectedColor={plankColor}
                  onSelect={setPlankColor}
                />
              </div>

              <div className="pt-4 px-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Material Finish</label>
                <div className="grid grid-cols-3 gap-2">
                  {['matte', 'metal', 'glossy'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setMaterialType(type)}
                      className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${materialType === type
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                        : 'bg-white/5 text-slate-500 hover:bg-white/10'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 lg:pt-8 border-t border-white/5 space-y-2 lg:space-y-3 font-medium">
              <div className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#ff6200]" />
                <p className="text-[9px] lg:text-[10px] text-slate-300 font-black uppercase tracking-widest text-center">
                  Best results with similar length names
                </p>
              </div>
              <p className="text-[10px] lg:text-xs text-slate-500 text-center leading-relaxed px-2 lg:px-4">
                This studio uses an anamorphic intersection engine to create double-sided illusions.
              </p>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default DualNamePlank;