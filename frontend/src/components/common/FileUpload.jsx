import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { motion } from 'framer-motion';
import { UploadCloud, Box, X } from 'lucide-react';
import UnderDevelopmentNotice from "./UnderDevelopmentNotice"

// Material densities in g/cm³
const materials = { PLA: 1.24, ABS: 1.04, PETG: 1.27 };

// Loader
function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(0)} % loaded</Html>;
}

// Component to render STL model with rotation
function STLModel({ geometry, color }) {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.01; // continuous rotation
  });
  if (!geometry) return null;
  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Signed tetrahedron method for volume
const calculateSTLWeight = (
  file,
  infill = 20,
  density = 1.04,
  callback,
  shellFactor = 0.15
) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const loader = new STLLoader();
    const geometry = loader.parse(e.target.result);

    // Auto-scale if dimensions < 10 (likely meters)
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const maxDim = Math.max(box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z);
    if (maxDim < 10) geometry.scale(1000, 1000, 1000);

    geometry.center();

    // Volume in mm³
    const pos = geometry.attributes.position;
    const faces = pos.count / 3;
    let sum = 0;
    const p1 = new THREE.Vector3(), p2 = new THREE.Vector3(), p3 = new THREE.Vector3();
    for (let i = 0; i < faces; i++) {
      p1.fromBufferAttribute(pos, i * 3 + 0);
      p2.fromBufferAttribute(pos, i * 3 + 1);
      p3.fromBufferAttribute(pos, i * 3 + 2);
      sum += p1.dot(p2.clone().cross(p3)) / 6.0;
    }
    const volumeMm3 = Math.abs(sum);
    console.log('Volume (mm³):', volumeMm3);

    // Convert to cm³
    const volumeCm3 = volumeMm3 / 1000;

    // Calculate weight
    const infillFraction = infill / 100;
    const effectiveFraction = shellFactor + (1 - shellFactor) * infillFraction;
    const weight = volumeCm3 * density * effectiveFraction;

    callback(weight.toFixed(2), geometry);
  };

  reader.readAsArrayBuffer(file);
};



function FileUpload() {
  const [file, setFile] = useState(null);
  const [geometry, setGeometry] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [color, setColor] = useState('#ff6347');
  const [infill, setInfill] = useState(20);
  const [material, setMaterial] = useState('PLA');
  const [weight, setWeight] = useState(0);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0, z: 0 });
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (ext !== 'stl') {
      setError('Invalid file type. Please upload a .stl file.');
      setFile(null);
      setGeometry(null);
      setWeight(0);
      setDimensions({ x: 0, y: 0, z: 0 });
      return;
    }

    setFile(selectedFile);
    setError('');

    calculateSTLWeight(selectedFile, infill, materials[material], (w, geom) => {
      setWeight(w);
      setGeometry(geom);

      // compute bounding box for dimensions
      geom.computeBoundingBox();
      const box = geom.boundingBox;
      setDimensions({
        x: (box.max.x - box.min.x).toFixed(2),
        y: (box.max.y - box.min.y).toFixed(2),
        z: (box.max.z - box.min.z).toFixed(2)
      });
    });
  };

  const handleFileChange = (e) => handleFile(e.target.files[0]);
  const handleDragEvents = (e, dragging) => { e.preventDefault(); e.stopPropagation(); setIsDragging(dragging); };
  const handleDrop = (e) => { handleDragEvents(e,false); handleFile(e.dataTransfer.files[0]); };
  const handleRemoveFile = () => { setFile(null); setGeometry(null); setWeight(0); setDimensions({ x:0,y:0,z:0 }); setError(''); };
  const openFileDialog = () => inputRef.current.click();

  useEffect(() => {
    if (file) calculateSTLWeight(file, infill, materials[material], (w, geom)=>{ setWeight(w); setGeometry(geom); });
  }, [infill, material]);

  return (
    
    <section className="py-20 bg-white mt-20" >
      
      <div className="container mx-auto px-4 text-center">
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Upload Your STL File</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Drag & drop your .STL file or click to select. Preview it and choose material options.
        </p>
        <UnderDevelopmentNotice/>

        {/* File Upload Box */}
        <div
          className={`relative w-full max-w-2xl mx-auto border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={(e)=>handleDragEvents(e,true)}
          onDragOver={(e)=>handleDragEvents(e,true)}
          onDragLeave={(e)=>handleDragEvents(e,false)}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input type="file" ref={inputRef} className="hidden" onChange={handleFileChange} accept=".stl" />
          {file ? (
            <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} className="flex flex-col items-center justify-center text-left">
              <Box size={48} className="text-green-500 mb-4" />
              <p className="font-semibold text-gray-800">File Selected:</p>
              <p className="text-gray-600 break-all">{file.name}</p>
              <button onClick={(e)=>{ e.stopPropagation(); handleRemoveFile(); }} className="mt-4 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-4 rounded-full">
                <X size={16} className="mr-1" /> Remove File
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <UploadCloud size={48} className="mb-4" />
              <p className="font-semibold">Drag & drop your STL file here</p>
              <p className="text-sm mt-2">or click to browse</p>
            </div>
          )}
        </div>

        {error && <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="mt-4 text-red-500 font-semibold">{error}</motion.p>}

        {/* Material & Options */}
        {file && (
          <div className="mt-8 space-y-4">
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <label className="flex items-center space-x-2">
                <span className="text-gray-700 font-semibold">Material:</span>
                <select value={material} onChange={(e)=>setMaterial(e.target.value)} className="border rounded px-2 py-1">
                  {Object.keys(materials).map((mat) => <option key={mat} value={mat}>{mat}</option>)}
                </select>
              </label>

              <label className="flex items-center space-x-2">
                <span className="text-gray-700 font-semibold">Color:</span>
                <input type="color" value={color} onChange={(e)=>setColor(e.target.value)} className="w-12 h-8 border rounded" />
              </label>

              <label className="flex items-center space-x-2">
                <span className="text-gray-700 font-semibold">Infill %:</span>
                <input type="number" value={infill} min={1} max={100} onChange={(e)=>setInfill(Number(e.target.value))} className="border rounded px-2 py-1 w-20" />
              </label>
            </div>

            <p className="text-gray-700 font-semibold">Approx. Weight: {weight} g</p>
            <p className="text-gray-700 font-semibold">Dimensions (X × Y × Z): {dimensions.x} × {dimensions.y} × {dimensions.z} mm</p>
          </div>
        )}

        {/* 3D Preview */}
        {geometry && (
          <div className="mt-8 w-full h-96 border rounded-lg overflow-hidden">
            <Canvas camera={{ position:[200,200,200], fov:45 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[200,200,200]} intensity={1} />
              <STLModel geometry={geometry} color={color} />
              <OrbitControls />
              <Loader />
            </Canvas>
          </div>
        )}
      </div>
    </section>
  );
}

export default FileUpload;
