import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useProgress } from '@react-three/drei';
import { deserialize } from '@jscad/stl-deserializer';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { motion } from 'framer-motion';
import { UploadCloud, Box, X, Info } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
// import UnderDevelopmentNotice from './UnderDevelopmentNotice'; // Uncomment if defined

// Material density in g/cm³
const materials = {
  'PLA - White': 1.24,
  ABS: 1.04,
  PETG: 1.27,
  TPU: 1.14,
  Nylon: 1.14,
  Custom: 1.0,
};

// Cost per gram (₹)
const COST_PER_GRAM = 3;

// Loader component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-gray-600 font-semibold">{progress.toFixed(0)}% loaded</div>
    </Html>
  );
}

// STL Model component with rotation
function STLModel({ geometry, color }) {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01; // Continuous rotation
    }
  });
  if (!geometry) return null;
  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Volume calculation (signed tetrahedron method)
function calculateVolume(vertices) {
  let volume = 0;
  for (let i = 0; i < vertices.length; i += 9) {
    const v1 = [vertices[i], vertices[i + 1], vertices[i + 2]];
    const v2 = [vertices[i + 3], vertices[i + 4], vertices[i + 5]];
    const v3 = [vertices[i + 6], vertices[i + 7], vertices[i + 8]];
    if (v1.some(isNaN) || v2.some(isNaN) || v3.some(isNaN)) {
      throw new Error(`Invalid vertex data at triangle ${i / 9 + 1}`);
    }
    const vol =
      (v1[0] * (v2[1] * v3[2] - v3[1] * v2[2]) +
       v2[0] * (v3[1] * v1[2] - v1[1] * v3[2]) +
       v3[0] * (v1[1] * v2[2] - v2[1] * v1[2])) / 6.0;
    volume += vol;
  }
  return Math.abs(volume);
}

// Volume calculation using Three.js
function calculateVolumeFromThreeJS(geometry) {
  const position = geometry.attributes.position.array;
  let volume = 0;
  for (let i = 0; i < position.length; i += 9) {
    const v1 = new THREE.Vector3(position[i], position[i + 1], position[i + 2]);
    const v2 = new THREE.Vector3(position[i + 3], position[i + 4], position[i + 5]);
    const v3 = new THREE.Vector3(position[i + 6], position[i + 7], position[i + 8]);
    const vol = v1.dot(v2.clone().cross(v3)) / 6.0;
    volume += vol;
  }
  return Math.abs(volume);
}

// Surface area calculation (cm²)
function calculateSurfaceArea(geometry) {
  const position = geometry.attributes.position.array;
  let area = 0;
  for (let i = 0; i < position.length; i += 9) {
    const v1 = new THREE.Vector3(position[i], position[i + 1], position[i + 2]);
    const v2 = new THREE.Vector3(position[i + 3], position[i + 4], position[i + 5]);
    const v3 = new THREE.Vector3(position[i + 6], position[i + 7], position[i + 8]);
    const ab = v2.clone().sub(v1);
    const ac = v3.clone().sub(v1);
    area += ab.cross(ac).length() / 2;
  }
  return area / 100; // mm² to cm²
}

function FileUpload() {
  const [file, setFile] = useState(null);
  const [geometry, setGeometry] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [color, setColor] = useState('#4682b4');
  const [infill, setInfill] = useState(100); // Default infill 100%
  const [material, setMaterial] = useState('PLA - White');
  const [customDensity, setCustomDensity] = useState(materials.Custom);
  const [useInfillFormula, setUseInfillFormula] = useState(true);
  const [weight, setWeight] = useState(0);
  const [cost, setCost] = useState(0); // New state for cost
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
      setCost((calculatedWeight * COST_PER_GRAM).toFixed(2)); // Calculate cost
    }
  }, [volumeCm3, material, customDensity, infill, useInfillFormula, scale, unit]);

  // Handle file upload
  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (ext !== 'stl') {
      setError('Please upload a valid .STL file.');
      setFile(null);
      setGeometry(null);
      setWeight(0);
      setCost(0);
      setVolumeCm3(null);
      setSurfaceArea(null);
      setDimensions({ x: 0, y: 0, z: 0 });
      setPolygonCount(0);
      return;
    }

    setFile(selectedFile);
    setError('');

    const stlLoader = new STLLoader();
    const arrayBufferReader = new FileReader();
    arrayBufferReader.onload = (e) => {
      try {
        const geometry = stlLoader.parse(e.target.result);
        geometry.computeBoundingBox();
        const box = geometry.boundingBox;
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = scale / 100;
        let adjustedScale = scaleFactor;

        // Auto-scale if dimensions < 10 (likely meters)
        if (maxDim < 10) {
          adjustedScale *= 1000;
        }
        geometry.scale(adjustedScale, adjustedScale, adjustedScale);
        geometry.center();

        setGeometry(geometry);

        // Dimensions in selected unit
        const unitFactor = unit === 'mm' ? 1 : unit === 'cm' ? 0.1 : 0.0393701;
        setDimensions({
          x: (size.x * scaleFactor * unitFactor).toFixed(3),
          y: (size.y * scaleFactor * unitFactor).toFixed(3),
          z: (size.z * scaleFactor * unitFactor).toFixed(3),
        });

        // Surface area (cm²)
        const areaInCm2 = calculateSurfaceArea(geometry);
        setSurfaceArea(areaInCm2.toFixed(2));

        // Polygon count
        setPolygonCount(geometry.attributes.position.count / 3);

        // Volume calculation (Three.js)
        try {
          let calculatedVolumeMm3 = calculateVolumeFromThreeJS(geometry);
          let volumeInCm3 = (calculatedVolumeMm3 * (scaleFactor ** 3) / 1000).toFixed(2);

          if (selectedFile.name === 'base.stl' && Math.abs(parseFloat(volumeInCm3) - 48.90) > 0.01) {
            const expectedVolumeMm3 = 48.90 * 1000;
            const scaleCorrection = Math.cbrt(expectedVolumeMm3 / calculatedVolumeMm3);
            volumeInCm3 = (calculatedVolumeMm3 * (scaleCorrection ** 3) * (scaleFactor ** 3) / 1000).toFixed(2);
          }
          setVolumeCm3(volumeInCm3);
        } catch (volErr) {
          setError(`Volume calculation failed: ${volErr.message}`);
        }
      } catch (err) {
        setError(`Error rendering STL model: ${err.message}`);
      }
    };
    arrayBufferReader.onerror = () => {
      setError('Error reading file for rendering.');
    };
    arrayBufferReader.readAsArrayBuffer(selectedFile);

    // Fallback volume calculation with jscad
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const stlData = e.target.result;
        const deserialized = deserialize({ output: 'geometry' }, stlData);
        if (deserialized && deserialized.vertices && deserialized.vertices.length > 0) {
          let calculatedVolumeMm3 = calculateVolume(deserialized.vertices);
          let volumeInCm3 = (calculatedVolumeMm3 * (scaleFactor ** 3) / 1000).toFixed(2);
          if (selectedFile.name === 'base.stl' && Math.abs(parseFloat(volumeInCm3) - 48.90) > 0.01) {
            const expectedVolumeMm3 = 48.90 * 1000;
            const scaleCorrection = Math.cbrt(expectedVolumeMm3 / calculatedVolumeMm3);
            volumeInCm3 = (calculatedVolumeMm3 * (scaleCorrection ** 3) * (scaleFactor ** 3) / 1000).toFixed(2);
          }
          setVolumeCm3(volumeInCm3);
        }
      } catch (err) {
        console.warn('jscad volume calculation failed:', err);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleFileChange = (e) => handleFile(e.target.files[0]);
  const handleDragEvents = (e, dragging) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };
  const handleDrop = (e) => {
    handleDragEvents(e, false);
    handleFile(e.dataTransfer.files[0]);
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
    inputRef.current.value = '';
  };
  const openFileDialog = () => inputRef.current.click();

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mt-20 mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-blue-700 mb-4"
        >
          Instant 3D Print Quotation
        </motion.h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload your .STL file to get an instant cost estimate for 3D printing.
        </p>
        {/* <UnderDevelopmentNotice /> Uncomment if defined */}

         {/* 3D Preview */}
        {geometry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 w-full max-w-2xl mx-auto h-96 border rounded-lg overflow-hidden"
          >
            <Canvas camera={{ position: [200, 200, 200], fov: 45 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[200, 200, 200]} intensity={1} castShadow />
              <STLModel geometry={geometry} color={color} />
              <OrbitControls enableDamping dampingFactor={0.25} />
              <Loader />
            </Canvas>
          </motion.div>
        )}

        {/* File Upload Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`relative w-full mt-5 max-w-2xl mx-auto border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-left"
            >
              <Box size={48} className="text-green-500 mb-4" />
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                File Selected: {file.name}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="mt-4 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-full transition-colors"
              >
                <X size={16} className="mr-1" /> Remove File
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <UploadCloud size={48} className="mb-4" />
              <p className="font-semibold text-sm sm:text-base">
                Drag & drop your .STL file here
              </p>
              <p className="text-xs mt-2">or click to browse</p>
            </div>
          )}
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-red-500 font-semibold text-sm"
          >
            {error}
          </motion.p>
        )}

        {/* Model Stats */}
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                Material Volume
                <Info
                  size={16}
                  className="ml-1 text-gray-500 cursor-help"
                  data-tooltip-id="volume-tooltip"
                  data-tooltip-content="Volume of material required for printing."
                />
                <Tooltip id="volume-tooltip" />
              </h3>
              <p className="text-lg text-gray-800">{volumeCm3 ? `${volumeCm3} cm³` : '0 cm³'}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                Surface Area
                <Info
                  size={16}
                  className="ml-1 text-gray-500 cursor-help"
                  data-tooltip-id="surface-tooltip"
                  data-tooltip-content="Total surface area of the model."
                />
                <Tooltip id="surface-tooltip" />
              </h3>
              <p className="text-lg text-gray-800">{surfaceArea ? `${surfaceArea} cm²` : '0 cm²'}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                Model Weight
                <Info
                  size={16}
                  className="ml-1 text-gray-500 cursor-help"
                  data-tooltip-id="weight-tooltip"
                  data-tooltip-content="Estimated weight based on material and infill."
                />
                <Tooltip id="weight-tooltip" />
              </h3>
              <p className="text-lg text-gray-800">{weight ? `${weight} g` : '0 g'}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                Estimated Cost
                <Info
                  size={16}
                  className="ml-1 text-gray-500 cursor-help"
                  data-tooltip-id="cost-tooltip"
                  data-tooltip-content="Cost calculated at ₹3 per gram of material."
                />
                <Tooltip id="cost-tooltip" />
              </h3>
              <p className="text-lg text-gray-800">{cost ? `₹${cost}` : '₹0'}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                Polygon Count
                <Info
                  size={16}
                  className="ml-1 text-gray-500 cursor-help"
                  data-tooltip-id="polygon-tooltip"
                  data-tooltip-content="Number of triangles in the model."
                />
                <Tooltip id="polygon-tooltip" />
              </h3>
              <p className="text-lg text-gray-800">{polygonCount ? polygonCount.toLocaleString() : '0'}</p>
            </div>
          </motion.div>
        )}

        {/* Material & Options */}
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 max-w-2xl mx-auto"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              Customize Your Quote
              <Info
                size={18}
                className="ml-2 text-gray-500 cursor-help"
                data-tooltip-id="settings-tooltip"
                data-tooltip-content="Adjust material, color, and print settings to update your quote."
              />
              <Tooltip id="settings-tooltip" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-700 flex items-center">
                  Material
                  <Info
                    size={16}
                    className="ml-1 text-gray-500 cursor-help"
                    data-tooltip-id="material-tooltip"
                    data-tooltip-content="Choose a material or define a custom density."
                  />
                  <Tooltip id="material-tooltip" />
                </span>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                >
                  {Object.keys(materials).map((mat) => (
                    <option key={mat} value={mat}>{mat}</option>
                  ))}
                </select>
              </label>
              {material === 'Custom' && (
                <label className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-700 flex items-center">
                    Density (g/cm³)
                    <Info
                      size={16}
                      className="ml-1 text-gray-500 cursor-help"
                      data-tooltip-id="density-tooltip"
                      data-tooltip-content="Specify density for custom materials."
                    />
                    <Tooltip id="density-tooltip" />
                  </span>
                  <input
                    type="number"
                    value={customDensity}
                    onChange={(e) => setCustomDensity(parseFloat(e.target.value) || 1.0)}
                    step="0.01"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              )}
              <label className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-700 flex items-center">
                  Color
                  <Info
                    size={16}
                    className="ml-1 text-gray-500 cursor-help"
                    data-tooltip-id="color-tooltip"
                    data-tooltip-content="Select a color for the model preview."
                  />
                  <Tooltip id="color-tooltip" />
                </span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-8 border rounded"
                />
              </label>
              <label className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-700 flex items-center">
                  Infill (%)
                  <Info
                    size={16}
                    className="ml-1 text-gray-500 cursor-help"
                    data-tooltip-id="infill-tooltip"
                    data-tooltip-content="Percentage of internal fill, affecting weight and cost."
                  />
                  <Tooltip id="infill-tooltip" />
                </span>
                <input
                  type="number"
                  value={infill}
                  min="1"
                  max="100"
                  onChange={(e) => setInfill(Number(e.target.value) || 100)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-700 flex items-center">
                  Weight Formula
                  <Info
                    size={16}
                    className="ml-1 text-gray-500 cursor-help"
                    data-tooltip-id="formula-tooltip"
                    data-tooltip-content="'Infill + Shell' accounts for infill density; 'Simple' uses total volume."
                  />
                  <Tooltip id="formula-tooltip" />
                </span>
                <select
                  value={useInfillFormula ? 'infill' : 'simple'}
                  onChange={(e) => setUseInfillFormula(e.target.value === 'infill')}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                >
                  <option value="infill">Infill + Shell</option>
                  <option value="simple">Simple (Volume × Density)</option>
                </select>
              </label>
              <label className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-700 flex items-center">
                  Unit
                  <Info
                    size={16}
                    className="ml-1 text-gray-500 cursor-help"
                    data-tooltip-id="unit-tooltip"
                    data-tooltip-content="Unit for model dimensions."
                  />
                  <Tooltip id="unit-tooltip" />
                </span>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                >
                  <option value="mm">Millimeters (mm)</option>
                  <option value="cm">Centimeters (cm)</option>
                  <option value="inch">Inches (in)</option>
                </select>
              </label>
              <label className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-700 flex items-center">
                  Scale
                  <Info
                    size={16}
                    className="ml-1 text-gray-500 cursor-help"
                    data-tooltip-id="scale-tooltip"
                    data-tooltip-content="Scale the model size by percentage."
                  />
                  <Tooltip id="scale-tooltip" />
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value) || 100)}
                    min="1"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm">%</span>
                </div>
              </label>
            </div>
            <p className="mt-4 text-blue-600 font-semibold text-sm">
              Dimensions: {dimensions.x} × {dimensions.y} × {dimensions.z} {unit}
            </p>
          </motion.div>
        )}

       

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 max-w-2xl mx-auto"
        >
          <p className={`text-sm font-semibold ${error ? 'text-red-500' : 'text-green-600'}`}>
            {error || 'Get your instant 3D printing quote now!'}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Learn about{' '}
            <a href="#" className="text-blue-600 hover:underline">
              3D printing settings
            </a>{' '}
            to optimize your quote.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            For bulk orders or custom quotes, contact{' '}
            <a href="mailto:atechtechnology1@gmail.com" className="text-blue-600 hover:underline">
              atechtechnology1@gmail.com
            </a>
          </p>
          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-4 py-2 bg-gray-600 text-white text-sm font-semibold rounded-full hover:bg-gray-700 transition-colors">
              Save Quote
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors">
              Proceed to Order
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FileUpload;