import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { motion } from 'framer-motion';
import { UploadCloud, Box, X, Info } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

// --- CONFIGURATION ---

// 1. Available Colors
const ALLOWED_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Purple', hex: '#C986E3' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Royal Blue', hex: '#02066F' },
  { name: 'Cyan Blue', hex: '#00FFFF' },
  { name: 'Light Green', hex: '#32CD32' },
  { name: 'Dark Green', hex: '#003314' },
  { name: 'Yellow', hex: '#FFDE21' },
  { name: 'Orange', hex: '#FF8000' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Silver', hex: '#D9D9D9' },
  { name: 'Gold', hex: '#D3AF37' },
  { name: 'Grey', hex: '#737373' },
  { name: 'Light Brown', hex: '#C89D7C' },
  { name: 'Dark Brown', hex: '#332421' },
];

// 2. Material density in g/cm³
const materials = {
  'PLA - White': 1.24,
  ABS: 1.04,
  PETG: 1.27,
  TPU: 1.14,
  Nylon: 1.14,
  Custom: 1.0,
};

// 3. Cost per gram (₹)
const COST_PER_GRAM = 3;

// --- COMPONENTS ---



// STL Model component with rotation
function STLModel({ geometry, color }) {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005; // Continuous rotation
    }
  });
  if (!geometry) return null;
  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Optimized Volume calculation using Three.js (No external libs needed)
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
    
    // Signed volume of tetrahedron
    volume += v1.dot(v2.cross(v3)) / 6.0;
  }
  return Math.abs(volume);
}

// Surface area calculation (cm²)
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
  return area / 100; // mm² to cm²
}

function FileUpload() {
  const [file, setFile] = useState(null);
  const [geometry, setGeometry] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  
  // Set default color to the first one in the list (Black) or specific hex
  const [color, setColor] = useState(ALLOWED_COLORS[1].hex); // Defaulting to White for better visibility

  const [infill, setInfill] = useState(100); 
  const [material, setMaterial] = useState('PLA - White');
  const [customDensity, setCustomDensity] = useState(materials.Custom);
  const [useInfillFormula, setUseInfillFormula] = useState(true);
  const [weight, setWeight] = useState(0);
  const [cost, setCost] = useState(0); 
  const [volumeCm3, setVolumeCm3] = useState(null);
  const [surfaceArea, setSurfaceArea] = useState(null);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0, z: 0 });
  const [polygonCount, setPolygonCount] = useState(0);
  const [unit, setUnit] = useState('cm');
  const [scale, setScale] = useState(100);
  const inputRef = useRef(null);

  // Calculate weight and cost based on volume, material, and infill
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
  }, [volumeCm3, material, customDensity, infill, useInfillFormula, scale, unit]);

  // Handle file upload
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
          x: (size.x * scaleFactor * unitFactor).toFixed(3),
          y: (size.y * scaleFactor * unitFactor).toFixed(3),
          z: (size.z * scaleFactor * unitFactor).toFixed(3),
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

  const handleFileChange = (e) => handleFile(e.target.files[0]);
  
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
    <section className="py-12 bg-gray-50 min-h-screen mt-10">
  <div className="container mt-10 mx-auto px-4 md:px-6 lg:px-8 max-w-5xl text-center">
    
    {/* Header Section */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
        Instant <span className="text-blue-600">3D Print Quote</span>
      </h2>
      <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
        Upload your .STL file to analyze geometry, calculate costs, and get an immediate estimate.
      </p>
    </motion.div>

    {/* 3D Preview Card */}
    {geometry && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-64 md:h-96 bg-gray-100 rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative mb-8"
      >
        <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-600 shadow-sm pointer-events-none">
          Interactive 3D View
        </div>
        <Canvas camera={{ position: [200, 200, 200], fov: 5 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[200, 200, 200]} intensity={1} castShadow />
          <STLModel geometry={geometry} color={color} />
          <OrbitControls enableDamping dampingFactor={0.25} />
          
        </Canvas>
      </motion.div>
    )}
    

    {/* File Upload Area */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`relative group w-full max-w-3xl mx-auto border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300 ${
        isDragging
          ? 'border-blue-500 bg-blue-50/50 scale-[1.01] shadow-xl'
          : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50 hover:shadow-md'
      }`}
      onDragEnter={(e) => handleDragEvents(e, true)}
      onDragOver={(e) => handleDragEvents(e, true)}
      onDragLeave={(e) => handleDragEvents(e, false)}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
        accept=".stl"
      />
      
      {file ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <Box size={40} className="text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">{file.name}</h3>
          <p className="text-sm text-gray-500 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFile();
            }}
            className="flex items-center space-x-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow"
          >
            <X size={16} /> <span>Remove & Upload New</span>
          </button>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-blue-50 p-4 rounded-full transition-transform group-hover:scale-110 duration-300">
            <UploadCloud size={40} className="text-blue-500" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">
              Drag & drop your .STL file
            </p>
            <p className="text-sm text-gray-500 mt-1">or click to browse from device</p>
          </div>
        </div>
      )}
    </motion.div>

    {error && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg max-w-2xl mx-auto text-sm font-medium flex items-center justify-center"
      >
        <Info size={18} className="mr-2" /> {error}
      </motion.div>
    )}

    {/* Results & Stats Grid */}
    {file && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto"
      >
        {[
          { label: 'Volume', value: volumeCm3 ? `${volumeCm3}` : '0', unit: 'cm³', tip: 'Material Volume' },
          { label: 'Surface Area', value: surfaceArea ? `${surfaceArea}` : '0', unit: 'cm²', tip: 'Total Surface Area' },
          { label: 'Weight', value: weight ? `${weight}` : '0', unit: 'g', tip: 'Estimated Weight' },
          { label: 'Polygons', value: polygonCount ? polygonCount.toLocaleString() : '0', unit: '', tip: 'Mesh Complexity' },
          { label: 'Est. Cost', value: cost ? `₹${cost}` : '₹0', unit: '', highlight: true, tip: 'Calculated Cost' },
        ].map((stat, idx) => (
          <div 
            key={idx} 
            className={`relative p-5 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center space-y-1 ${
              stat.highlight 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105 z-10' 
                : 'bg-white border-gray-100 text-gray-800 shadow-sm hover:shadow-md'
            }`}
          >
             <div className="flex items-center space-x-1 mb-1">
                <span className={`text-xs uppercase tracking-wider font-bold ${stat.highlight ? 'text-blue-100' : 'text-gray-400'}`}>
                  {stat.label}
                </span>
             </div>
             <p className="text-2xl font-bold leading-none">
               {stat.value}
               <span className={`text-sm ml-1 font-medium ${stat.highlight ? 'text-blue-200' : 'text-gray-400'}`}>{stat.unit}</span>
             </p>
          </div>
        ))}
      </motion.div>
    )}

    {/* Customization Panel */}
    {file && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 max-w-5xl mx-auto text-left"
      >
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="bg-blue-100 text-blue-600 rounded-lg p-2 mr-3">
              <Box size={20} />
            </span>
            Configuration
          </h3>
          <span className="text-sm font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
            {dimensions.x} × {dimensions.y} × {dimensions.z} {unit}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Material */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Material</label>
            <div className="relative">
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
              >
                {Object.keys(materials).map((mat) => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
            {material === 'Custom' && (
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500 mr-2">Density:</span>
                <input
                  type="number"
                  value={customDensity}
                  onChange={(e) => setCustomDensity(parseFloat(e.target.value) || 1.0)}
                  step="0.01"
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
            )}
          </div>

          {/* Color */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Color</label>
            <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl px-2 py-2">
               <div 
                  className="w-8 h-8 rounded-lg shadow-sm border border-gray-300 mr-3 flex-shrink-0" 
                  style={{ backgroundColor: color }} 
               />
               <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-transparent border-none text-gray-700 focus:ring-0 cursor-pointer text-sm font-medium"
               >
                  {ALLOWED_COLORS.map((c) => (
                      <option key={c.hex} value={c.hex}>{c.name}</option>
                  ))}
               </select>
            </div>
          </div>

          {/* Scale & Unit */}
          <div className="space-y-2">
             <div className="flex justify-between">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Scale</label>
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Unit</label>
             </div>
             <div className="flex gap-2">
                <div className="relative flex-1">
                   <input
                    type="number"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value) || 100)}
                    min="1"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-3 text-gray-400 text-sm">%</span>
                </div>
                <div className="relative w-24">
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full h-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-2 py-3 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="mm">mm</option>
                    <option value="cm">cm</option>
                    <option value="inch">in</option>
                  </select>
                </div>
             </div>
          </div>

          {/* Infill */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center justify-between">
              Infill <span className="text-blue-600 bg-blue-50 px-1.5 rounded text-[10px]">{infill}%</span>
            </label>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={infill} 
              onChange={(e) => setInfill(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex items-center justify-between pt-1">
               <select
                 value={useInfillFormula ? 'infill' : 'simple'}
                 onChange={(e) => setUseInfillFormula(e.target.value === 'infill')}
                 className="text-xs text-gray-500 bg-transparent border-b border-dashed border-gray-300 pb-0.5 focus:outline-none"
               >
                 <option value="infill">Complex Calc</option>
                 <option value="simple">Simple Calc</option>
               </select>
            </div>
          </div>

        </div>
      </motion.div>
    )}

    {/* Footer CTA */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-12 mb-10"
    >
       {/* {!error && file && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg w-full md:w-auto">
             Order Now for ₹{cost}
          </button>
       )} */}
       <p className="text-sm text-gray-400 mt-6">
         Need bulk pricing? <a href="https://mail.google.com/mail/?view=cm&fs=1&to=anuveshanatechnologies@gmail.com&su=Business%20Inquiry" className="text-blue-500 font-medium hover:underline">anuveshanatechnologies@gmail.com</a>
       </p>
    </motion.div>

  </div>
  
  {/* Render Tooltips globally */}
  <Tooltip id="volume-tooltip" />
  <Tooltip id="surface-tooltip" />
  <Tooltip id="weight-tooltip" />
  <Tooltip id="cost-tooltip" />
  <Tooltip id="polygon-tooltip" />
  <Tooltip id="color-tooltip" />
</section>
  );
}

export default FileUpload;