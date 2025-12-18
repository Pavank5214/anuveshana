import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Target, Cuboid, Bot, BrainCircuit, Zap, Award, Users, ArrowRight, 
  Layers, Settings, Truck, Rocket, Stethoscope, Briefcase, Cpu 
} from "lucide-react";
import aboutus from "../../assets/aboutus.jpg"; 
import { useEffect, useState } from "react";

const AboutPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Dark Mode Skeleton Loader ---
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0F19] py-24 px-4 flex flex-col items-center overflow-hidden relative">
        <div className="absolute inset-0 z-0">
             <div className="absolute top-0 left-1/4 w-96 h-96 bg-slate-800/20 rounded-full blur-[100px] animate-pulse" />
        </div>
        <div className="max-w-4xl w-full z-10 space-y-8 text-center mt-12">
          <div className="h-4 w-32 mx-auto bg-slate-800 rounded-full animate-pulse" />
          <div className="h-16 w-3/4 mx-auto bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-4 w-1/2 mx-auto bg-slate-800 rounded-lg animate-pulse" />
        </div>
      </main>
    );
  }

  const stats = [
    { label: "Projects Completed", value: "500+" },
    { label: "Happy Clients", value: "120+" },
    { label: "Print Hours", value: "5000+" },
    { label: "Expert Engineers", value: "10+" },
  ];

  const technologies = [
    { 
      icon: <Cuboid size={32} />, 
      name: "FDM Technology", 
      description: "Fused Deposition Modeling is our workhorse for rapid prototyping. It uses thermoplastic filaments to build durable, functional parts ideal for fit-testing and jigs." 
    },
    { 
      icon: <Bot size={32} />, 
      name: "SLA Precision", 
      description: "Stereolithography utilizes a laser to cure liquid resin into hardened plastic. This results in an incredibly smooth surface finish and high detail, perfect for miniatures and dental molds." 
    },
    { 
      icon: <BrainCircuit size={32} />, 
      name: "SLS Engineering", 
      description: "Selective Laser Sintering fuses nylon powder to create strong, functional end-use parts with complex geometries and no need for support structures." 
    },
  ];

  const processSteps = [
    { icon: <Layers size={24} />, title: "1. Upload & Analyze", desc: "We review your CAD files for printability." },
    { icon: <Settings size={24} />, title: "2. Slice & Optimize", desc: "Engineers configure the optimal print settings." },
    { icon: <Zap size={24} />, title: "3. Manufacturing", desc: "High-precision printing using industrial machines." },
    { icon: <Truck size={24} />, title: "4. Finish & Deliver", desc: "Post-processing, quality check, and shipping." },
  ];

  const industries = [
    { icon: <Rocket size={24} />, name: "Aerospace" },
    { icon: <Stethoscope size={24} />, name: "Medical" },
    { icon: <Cpu size={24} />, name: "Electronics" },
    { icon: <Briefcase size={24} />, name: "Product Design" },
  ];

  return (
    <main className="bg-[#0B0F19] text-white min-h-screen relative overflow-x-hidden selection:bg-orange-500/30">
      
      {/* --- Background Elements --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[128px]" />
      </div>

      {/* --- Hero Section --- */}
      <section className="relative z-10 pt-32 pb-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 backdrop-blur-md text-slate-300 text-xs font-bold tracking-widest uppercase mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Innovating Since 2024</span>
          </div>
           */}
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-tight">
            We Engineer the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Physical World.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Anuveshana Technologies bridges the gap between digital design and physical reality. 
            We provide industrial-grade 3D printing solutions that empower creators to build faster, test harder, and scale sooner.
          </p>
        </motion.div>
      </section>

      {/* --- Stats Strip --- */}
      {/* <section className="border-y border-slate-800/50 bg-slate-900/30 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-800/50">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="py-10 text-center"
              >
                <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-orange-500 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* --- Mission Section (Wide) --- */}
      <section className="container mx-auto px-4 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 text-orange-500 mb-6">
              <Target size={24} />
              <h3 className="text-sm font-bold uppercase tracking-widest">Our Mission</h3>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Democratizing <br />
              <span className="text-slate-500">Advanced Manufacturing</span>
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
              <p>
                We believe innovation shouldn't be limited by access to machinery. 
                Whether you are an individual creator, a startup, or an enterprise, 
                our mission is to provide accessible, high-precision manufacturing services.
              </p>
              <p>
                By combining cutting-edge FDM, SLA, and SLS technologies with a 
                deep understanding of materials, we turn complex CAD files into 
                durable, functional physical objects.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-orange-500/20 blur-[80px] rounded-full" />
            <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl shadow-black/50 group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <motion.img
                src={aboutus}
                alt="3D Printing Process"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-8 left-8 z-20">
                 <p className="text-white font-bold text-2xl">Precision Engineering</p>
                 <div className="h-1 w-20 bg-orange-500 mt-2 rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Our Process (New Content) --- */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Work</h2>
          <p className="text-slate-400">Streamlined workflow from concept to physical part.</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative p-6 bg-slate-900/40 border border-slate-800 rounded-2xl group hover:bg-slate-800/40 transition-colors"
            >
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
              <p className="text-sm text-slate-400">{step.desc}</p>
              
              {/* Connector Line (Desktop Only) */}
              {index !== processSteps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-3 z-10 text-slate-700">
                  <ArrowRight size={24} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Technology Grid --- */}
      <section className="container mx-auto px-4 py-24 relative z-10 bg-slate-900/20 my-10 rounded-[3rem]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Technology Stack</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We utilize a diverse fleet of machines to ensure the right technology for your specific material and durability requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group relative p-8 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-3xl hover:border-orange-500/50 transition-all duration-300 shadow-xl"
            >
              <div className="w-16 h-16 mb-6 rounded-2xl bg-slate-900 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-black/30">
                {tech.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-orange-400 transition-colors">
                {tech.name}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {tech.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Industries We Serve (New Content) --- */}
      <section className="container mx-auto px-4 py-16 relative z-10 text-center">
        <h3 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-8">Industries We Empower</h3>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {industries.map((ind, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 px-6 py-4 bg-slate-800/50 rounded-full border border-slate-700 text-slate-300 hover:border-orange-500/50 hover:text-white transition-all"
            >
              <span className="text-orange-500">{ind.icon}</span>
              <span className="font-semibold">{ind.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="container mx-auto px-4 pb-24 pt-12 relative z-10">
        <motion.div 
          whileHover={{ scale: 1.005 }}
          className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-orange-600 to-orange-800 text-center py-20 px-6 shadow-2xl shadow-orange-900/40"
        >
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                    Ready to build?
                </h2>
                <p className="text-orange-100 text-lg mb-10">
                    From simple prototypes to complex assemblies, we are ready to handle your production needs with speed and precision.
                </p>
                <Link to="/contact">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-orange-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2 mx-auto hover:bg-orange-50 transition-colors"
                    >
                        <span>Start Your Project</span>
                        <ArrowRight size={20} />
                    </motion.button>
                </Link>
            </div>
        </motion.div>
      </section>

    </main>
  );
};

export default AboutPage;