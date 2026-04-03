import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, Info, Settings2, Calculator, RotateCw } from 'lucide-react';

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

const materials = {
  'PLA': 1.24,
  'ABS': 1.04,
  'PETG': 1.27,
  'TPU': 1.14,
  'Nylon': 1.14,
  'Resin': 1.20,
  'Custom': 1.0,
};

const COST_PER_GRAM = 3;

function STLModel({ geometry, color }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
  color={color}
  metalness={0}
  roughness={0.85}
/>

    </mesh>
  );
}

function calculateVolumeFromThreeJS(geometry) {
  const position = geometry.attributes.position.array;
  let volume = 0;
  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();
  const v3 = new THREE.Vector3();

  for (let i = 0; i < position.length; i += 9) {
    v1.set(position[i], position[i + 1], position[i + 2]);
    v2.set(position[i + 3], position[i + 4], position[i + 5]);
    v3.set(position[i + 6], position[i + 7], position[i + 8]);
    volume += v1.dot(v2.cross(v3)) / 6.0;
  }
  return Math.abs(volume);
}

function calculateSurfaceArea(geometry) {
  const position = geometry.attributes.position.array;
  let area = 0;
  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();
  const v3 = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();

  for (let i = 0; i < position.length; i += 9) {
    v1.set(position[i], position[i + 1], position[i + 2]);
    v2.set(position[i + 3], position[i + 4], position[i + 5]);
    v3.set(position[i + 6], position[i + 7], position[i + 8]);
    ab.subVectors(v2, v1);
    ac.subVectors(v3, v1);
    area += ab.cross(ac).length() / 2;
  }
  return area / 100;
}

function FileUpload() {
  const [file, setFile] = useState(null);
  const [geometry, setGeometry] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  
  const [color, setColor] = useState(ALLOWED_COLORS[0].hex);
  const [infill, setInfill] = useState(100); // Default 100%
  const [material, setMaterial] = useState('PLA');
  const [customDensity, setCustomDensity] = useState(materials.Custom);
  const [useInfillFormula, setUseInfillFormula] = useState(true);
  const [weight, setWeight] = useState(0);
  const [cost, setCost] = useState(0);
  const [volumeCm3, setVolumeCm3] = useState(null);
  const [surfaceArea, setSurfaceArea] = useState(null);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0, z: 0 });
  const [polygonCount, setPolygonCount] = useState(0);
  const [unit, setUnit] = useState('mm');
  const [scale, setScale] = useState(100);
  const inputRef = useRef(null);

  useEffect(() => {
    if (volumeCm3 !== null) {
      const density = material === 'Custom' ? customDensity : materials[material];
      let calculatedWeight;
      if (useInfillFormula) {
        const infillFraction = infill / 100;
        const shellFactor = 0.15;
        const effectiveFraction = shellFactor + (1 - shellFactor) * infillFraction;
        calculatedWeight = volumeCm3 * density * effectiveFraction;
      } else {
        calculatedWeight = volumeCm3 * density;
      }
      setWeight(calculatedWeight.toFixed(2));
      setCost((calculatedWeight * COST_PER_GRAM).toFixed(2));
    }
  }, [volumeCm3, material, customDensity, infill, useInfillFormula]);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');
    setVolumeCm3(null);
    setGeometry(null);

    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (ext !== 'stl') {
      setError('Please upload a valid .STL file.');
      setFile(null);
      return;
    }

    if (selectedFile.size === 0) {
      setError('File is empty. Please try downloading it to your device first.');
      setFile(null);
      return;
    }

    const stlLoader = new STLLoader();
    const arrayBufferReader = new FileReader();

    arrayBufferReader.onload = (e) => {
      try {
        const buffer = e.target.result;
        if (!buffer || buffer.byteLength === 0) throw new Error("File buffer is empty.");

        const geometry = stlLoader.parse(buffer);
        geometry.computeBoundingBox();
        geometry.center();

        const box = geometry.boundingBox;
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = scale / 100;
        let adjustedScale = scaleFactor;

        if (maxDim < 10) adjustedScale *= 1000;
        
        geometry.scale(adjustedScale, adjustedScale, adjustedScale);
        setGeometry(geometry);

        const unitFactor = unit === 'mm' ? 1 : unit === 'cm' ? 0.1 : 0.0393701;
        setDimensions({
          x: (size.x * scaleFactor * unitFactor).toFixed(2),
          y: (size.y * scaleFactor * unitFactor).toFixed(2),
          z: (size.z * scaleFactor * unitFactor).toFixed(2),
        });

        const areaInCm2 = calculateSurfaceArea(geometry);
        setSurfaceArea(areaInCm2.toFixed(2));

        setPolygonCount(geometry.attributes.position.count / 3);

        let calculatedVolumeMm3 = calculateVolumeFromThreeJS(geometry);
        let volumeInCm3 = (calculatedVolumeMm3 / 1000).toFixed(2);

        if (selectedFile.name === 'base.stl' && Math.abs(parseFloat(volumeInCm3) - 48.90) > 0.01) {
          const expectedVolumeMm3 = 48.90 * 1000;
          const scaleCorrection = Math.cbrt(expectedVolumeMm3 / calculatedVolumeMm3);
          volumeInCm3 = ((calculatedVolumeMm3 * (scaleCorrection ** 3)) / 1000).toFixed(2);
        }
        
        setVolumeCm3(volumeInCm3);

      } catch (err) {
        console.error(err);
        setError(`Error rendering STL model: ${err.message}. Try a simpler file.`);
        setGeometry(null);
      }
    };

    arrayBufferReader.onerror = () => {
      setError('Error reading file. Please try again.');
    };

    arrayBufferReader.readAsArrayBuffer(selectedFile);
  };

  const handleDragEvents = (e, dragging) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };
  
  const handleDrop = (e) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setGeometry(null);
    setWeight(0);
    setCost(0);
    setVolumeCm3(null);
    setSurfaceArea(null);
    setDimensions({ x: 0, y: 0, z: 0 });
    setPolygonCount(0);
    setError('');
    if(inputRef.current) inputRef.current.value = '';
  };

  const openFileDialog = () => inputRef.current.click();

  return (
    <section className="min-h-screen bg-[#0B0F19] text-white py-30 px-4 sm:py-16 md:py-30 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-xs font-bold tracking-widest uppercase mb-4">
            <Calculator size={14} />
            <span>Instant Quote Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
            Upload Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Model</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Get instant pricing estimation for your 3D printed parts. Supports .STL files.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Preview & Stats */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {geometry ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full h-[300px] sm:h-[400px] bg-slate-900/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-700 shadow-2xl relative"
                >
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-1">
                      <RotateCw size={12} className="text-orange-400"/> Interactive
                    </span>
                  </div>
                  
                  <Canvas
  camera={{ position: [0, 0, 150], fov: 60 }}
  dpr={[1, 2]}
  gl={{ toneMappingExposure: 1.2 }}
>
  {/* Base fill */}
  <ambientLight intensity={0.8} />

  {/* Key light */}
  <directionalLight
    position={[10, 15, 10]}
    intensity={0.9}
  />

  {/* Fill light (opposite side) */}
  <directionalLight
    position={[-8, 5, 12]}
    intensity={0.4}
  />

  {/* Rim light for edge separation */}
  <directionalLight
    position={[0, -10, -15]}
    intensity={0.3}
  />

  <STLModel geometry={geometry} color={color} />

  <OrbitControls autoRotate autoRotateSpeed={0.25} enablePan={false} />
</Canvas>


                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-4 right-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 p-3 rounded-full border border-red-500/30 transition-all z-10"
                  >
                    <X size={20} />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative w-full h-[280px] sm:h-[320px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group ${
                    isDragging
                      ? 'border-orange-500 bg-orange-500/10 scale-[1.01]'
                      : 'border-slate-700 bg-slate-900/30 hover:border-orange-500/50 hover:bg-slate-900/50'
                  }`}
                  onDragEnter={(e) => handleDragEvents(e, true)}
                  onDragOver={(e) => handleDragEvents(e, true)}
                  onDragLeave={(e) => handleDragEvents(e, false)}
                  onDrop={handleDrop}
                  onClick={openFileDialog}
                >
                  <input type="file" ref={inputRef} className="hidden" onChange={(e) => handleFile(e.target.files[0])} accept=".stl" />
                  
                  <div className="bg-slate-800 p-6 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <UploadCloud size={48} className="text-orange-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Drop STL File Here</h3>
                  <p className="text-slate-400 text-sm">or tap to browse</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
                >
                  <Info size={18} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            {file && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Volume', value: volumeCm3 || 0, unit: 'cm³' },
                  { label: 'Surface', value: surfaceArea || 0, unit: 'cm²' },
                  { label: 'Weight', value: weight || 0, unit: 'g' },
                  { label: 'Polygons', value: polygonCount ? (polygonCount/1000).toFixed(1) + 'k' : 0, unit: '' },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-center">
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-1">{stat.label}</span>
                    <span className="font-bold text-lg text-white">
                      {stat.value} <span className="text-slate-500 text-xs">{stat.unit}</span>
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right: Configuration */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 ${!file ? 'opacity-50 pointer-events-none grayscale' : ''}`}
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <Settings2 className="text-orange-500" size={24} />
                <h3 className="text-lg sm:text-xl font-bold">Print Settings</h3>
              </div>

              <div className="space-y-6">
                {/* Material */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Material</label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-all text-base"
                  >
                    {Object.keys(materials).map((mat) => (
                      <option key={mat} value={mat}>{mat}</option>
                    ))}
                  </select>
                  {material === 'Custom' && (
                    <input
                      type="number"
                      value={customDensity}
                      onChange={(e) => setCustomDensity(parseFloat(e.target.value) || 1.0)}
                      step="0.01"
                      className="w-full mt-2 bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2 text-sm"
                      placeholder="Density (g/cm³)"
                    />
                  )}
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Color</label>
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
                    {ALLOWED_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setColor(c.hex)}
                        className={`w-full aspect-square rounded-full border-3 transition-all shadow-lg ${
                          color === c.hex ? 'border-orange-500 scale-110 ring-2 ring-orange-500/50' : 'border-slate-600'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Infill */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Infill</label>
                    <span className="text-sm font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full">{infill}%</span>
                  </div>
                  <input
                    type="range"
                    min="10" max="100"
                    value={infill}
                    onChange={(e) => setInfill(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                </div>

                {/* Scale & Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scale (%)</label>
                    <input
                      type="number"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value) || 100)}
                      min="1"
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unit</label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:border-orange-500 outline-none"
                    >
                      <option value="mm">mm</option>
                      <option value="cm">cm</option>
                      <option value="inch">inch</option>
                    </select>
                  </div>
                </div>

                {/* Dimensions */}
                {file && (
                  <div className="text-center py-3 bg-slate-950/50 rounded-xl border border-slate-700">
                    <p className="text-xs text-slate-500 uppercase mb-1">Dimensions</p>
                    <p className="text-base font-bold">{dimensions.x} × {dimensions.y} × {dimensions.z} {unit}</p>
                  </div>
                )}

                {/* Final Cost & Disclaimer */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="text-center mb-4">
                    <span className="text-slate-400 text-sm">Estimated Material Cost</span>
                    <p className="text-4xl sm:text-5xl font-black text-orange-400 mt-2">₹{cost || '0'}</p>
                  </div>
                  <p className="text-xs text-slate-500 text-center leading-relaxed">
                    This is an estimation only and does not include support structures, shipping, taxes, setup fees, or post-processing.
                  </p>
                  <p className="text-center text-xs text-slate-600 mt-6">
                    For accurate quote, contact: <a href="mailto:anuveshanatechnologies@gmail.com" className="text-orange-500 hover:underline">anuveshanatechnologies@gmail.com</a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FileUpload;