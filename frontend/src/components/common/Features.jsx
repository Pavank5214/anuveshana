import { motion } from 'framer-motion';
import { Layers, Printer, Cpu, UploadCloud, ScanSearch, PackageCheck, Car, HeartPulse, Gem, Rocket, ArrowRight } from 'lucide-react';

// Data
const services = [
  { icon: <Layers size={32} />, title: "Rapid Prototyping", description: "Go from concept to physical model in record time. Perfect for validating designs, form-fit testing, and investor presentations." },
  { icon: <Printer size={32} />, title: "Precision 3D Printing", description: "Utilizing advanced SLA, SLS, and FDM technologies for intricate designs, functional parts, and durable end-use components." },
  { icon: <Cpu size={32} />, title: "Custom Manufacturing", description: "On-demand, tailored solutions for jigs, fixtures, custom enclosures, and low-volume production runs with a focus on quality." }
];

const processSteps = [
  { number: "01", icon: <UploadCloud size={28} />, title: "Upload & Quote", description: "Submit your 3D model through our secure portal. We analyze geometry and provide a detailed quote." },
  { number: "02", icon: <ScanSearch size={28} />, title: "Print & Verify", description: "Once approved, production begins on industrial machines followed by rigorous dimensional inspection." },
  { number: "03", icon: <PackageCheck size={28} />, title: "Ship & Deliver", description: "Your finished parts are securely packaged and shipped via express logistics directly to your location." }
];

const industries = [
  { icon: <Car size={32} />, title: "Automotive", description: "Functional prototypes, custom tooling, and durable end-use parts." },
  { icon: <HeartPulse size={32} />, title: "Healthcare", description: "High-precision surgical guides and patient-specific anatomical models." },
  { icon: <Gem size={32} />, title: "Jewelry", description: "Intricate, high-resolution master patterns for casting complex designs." },
  { icon: <Rocket size={32} />, title: "Aerospace", description: "Lightweight yet strong components and custom tooling." }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

function Features() {
  return (
    <div className="bg-[#0B0F19] text-white overflow-hidden relative selection:bg-orange-500/30">
      
      {/* --- Global Background Elements --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[128px]" />
      </div>

      {/* --- Core Services Section --- */}
      <section id="services" className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Our Core <span className="text-orange-500">Services</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Comprehensive additive manufacturing solutions tailored to your needs.</p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {services.map((service, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="group p-8 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10"
              >
                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-black/20">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition-colors">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- Our Process Section --- */}
      <section id="process" className="py-24 relative z-10 bg-slate-900/20 border-y border-slate-800/50">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">How It Works</h2>
            <p className="text-slate-400">From digital file to physical part in three simple steps.</p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-slate-700 to-transparent z-0" />

            {processSteps.map((step, index) => (
              <motion.div key={index} className="relative z-10 flex flex-col items-center" variants={itemVariants}>
                <div className="relative mb-6">
                    {/* Number Badge */}
                    <span className="absolute -top-3 -right-3 bg-slate-900 border border-slate-700 text-xs font-bold px-2 py-1 rounded-full text-slate-300">
                        {step.number}
                    </span>
                    <div className="flex items-center justify-center w-24 h-24 bg-slate-800 border-4 border-[#0B0F19] rounded-full text-orange-500 shadow-xl">
                        {step.icon}
                    </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* --- Industries We Serve Section --- */}
      <section id="industries" className="py-24 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-16">Industries We <span className="text-orange-500">Empower</span></h2>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {industries.map((industry, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="group bg-slate-900/40 border border-slate-800 p-8 rounded-3xl hover:bg-slate-800/60 hover:border-orange-500/30 transition-all duration-300"
              >
                <div className="text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                    {industry.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{industry.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed group-hover:text-slate-400 transition-colors">
                    {industry.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Features;