import { motion } from 'framer-motion';
import { Layers, Printer, Cpu, UploadCloud, ScanSearch, PackageCheck, Car, HeartPulse, Gem, Rocket } from 'lucide-react';

// Data for our sections to keep the JSX clean
const services = [
  { icon: <Layers size={40} />, title: "Rapid Prototyping", description: "Go from concept to physical model in record time. Perfect for validating designs, form-fit testing, and investor presentations." },
  { icon: <Printer size={40} />, title: "Precision 3D Printing", description: "Utilizing advanced SLA, SLS, and FDM technologies for intricate designs, functional parts, and durable end-use components." },
  { icon: <Cpu size={40} />, title: "Custom Manufacturing", description: "On-demand, tailored solutions for jigs, fixtures, custom enclosures, and low-volume production runs with a focus on quality." }
];

const processSteps = [
  { number: "1", icon: <UploadCloud size={32} />, title: "Upload & Quote", description: "Submit your 3D model through our contact form. We'll analyze it and provide a detailed quote." },
  { number: "2", icon: <ScanSearch size={32} />, title: "Print & Quality Check", description: "Once approved, we begin printing with our state-of-the-art machines and perform a rigorous quality check." },
  { number: "3", icon: <PackageCheck size={32} />, title: "Ship & Deliver", description: "Your finished parts are securely packaged and shipped directly to your location, anywhere in India." }
];

const industries = [
  { icon: <Car size={36} />, title: "Automotive", description: "Functional prototypes, custom tooling, and durable end-use parts." },
  { icon: <HeartPulse size={36} />, title: "Healthcare", description: "High-precision surgical guides and patient-specific anatomical models." },
  { icon: <Gem size={36} />, title: "Jewelry", description: "Intricate, high-resolution master patterns for casting complex designs." },
  { icon: <Rocket size={36} />, title: "Aerospace", description: "Lightweight yet strong components and custom tooling." }
];

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

function Features() {
  return (
    <>
      {/* Our Core Services Section */}
      <section id="services" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Our Core Services</h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {services.map((service, index) => (
              <motion.div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300" variants={itemVariants}>
                <div className="text-[#ff6200] inline-block mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Process Section */}
      <section id="process" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Our Process</h2>
          <p className="text-lg text-gray-600 mt-4 mb-12 max-w-2xl mx-auto">We've streamlined our process to be as simple and efficient as possible for you.</p>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Dashed line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2 mt-[-5rem]">
              <svg width="100%" height="2"><line x1="0" y1="1" x2="100%" y2="1" stroke="#ddd" strokeWidth="2" strokeDasharray="10 10"/></svg>
            </div>
            {processSteps.map((step, index) => (
              <motion.div key={index} className="relative z-10" variants={itemVariants}>
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-[#ff6200] text-white rounded-full text-2xl font-bold shadow-lg">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Industries We Serve Section */}
      <section id="industries" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Industries We Serve</h2>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {industries.map((industry, index) => (
              <motion.div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300" variants={itemVariants}>
                <div className="text-[#ff6200] inline-block mb-4">{industry.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{industry.title}</h3>
                <p className="text-gray-600 text-sm">{industry.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default Features;