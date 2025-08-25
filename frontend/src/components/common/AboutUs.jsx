import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Target, Cuboid, Bot, BrainCircuit } from 'lucide-react';

// --- Mock Data (images removed) ---
const teamMembers = [
  { name: 'Rohan K.', role: 'Founder & Lead Engineer', bio: 'With a decade of experience in mechanical engineering, Rohan founded Anuveshana to bring industrial-grade prototyping to everyone.' },
  { name: 'Anjali M.', role: 'Head of Design & Prototyping', bio: 'Anjali is a product design expert who helps clients optimize their models for perfect prints and functionality.' },
  { name: 'Dr. Priya S.', role: 'Materials Specialist', bio: 'Holding a Ph.D. in material science, Priya ensures we use the best possible materials for every unique application.' },
];

const technologies = [
  { icon: <Cuboid size={32} />, name: 'FDM (Fused Deposition Modeling)', description: 'Perfect for rapid prototyping, jigs, and fixtures using a wide range of thermoplastic filaments.' },
  { icon: <Bot size={32} />, name: 'SLA (Stereolithography)', description: 'Delivers incredible detail and smooth surface finishes using photopolymer resins, ideal for visual models and jewelry.' },
  { icon: <BrainCircuit size={32} />, name: 'SLS (Selective Laser Sintering)', description: 'Creates strong, functional parts from nylon powder, suitable for complex geometries and end-use components.' },
];

function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[50vh] bg-gray-800">
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold"
          >
            About Anuveshana Technologies
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-lg md:text-xl max-w-3xl"
          >
            Pioneering the future of manufacturing with precision, passion, and innovation.
          </motion.p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center text-[#ff6200] mb-4">
              <Target size={24} className="mr-3" />
              <h3 className="text-xl font-semibold">Our Mission</h3>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Democratizing Advanced Manufacturing</h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to empower innovators—from individual creators to large enterprises—by providing accessible, high-precision 3D printing and manufacturing services. We bridge the gap between digital design and physical reality, helping bring groundbreaking ideas to life faster and more efficiently than ever before.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center bg-gray-100 rounded-lg shadow-xl text-gray-500 min-h-[300px] p-4"
          >
            <p className="italic text-center">Engineers collaborating over a 3D model</p>
          </motion.div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center text-[#ff6200] mb-4">
            <Users size={24} className="mr-3" />
            <h3 className="text-xl font-semibold">Our Team</h3>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">The Experts Behind the Prints</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="flex items-center justify-center w-32 h-32 rounded-full mx-auto mb-4 bg-gray-200 text-gray-600 shadow-lg p-2">
                  <span className="text-sm italic text-center">{member.name}</span>
                </div>
                <h4 className="text-xl font-bold">{member.name}</h4>
                <p className="text-[#ff6200] font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Technology Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Our Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {technologies.map((tech, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-gray-200 p-8 rounded-lg"
              >
                <div className="text-[#ff6200] inline-block bg-orange-100 p-3 rounded-full mb-4">
                  {tech.icon}
                </div>
                <h4 className="text-xl font-bold mb-2">{tech.name}</h4>
                <p className="text-gray-600">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

       {/* Call to Action Section */}
      <section className="py-20 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Have a Project in Mind?</h2>
          <p className="text-lg text-gray-300 mt-4 mb-8 max-w-2xl mx-auto">
            Let's turn your concept into a reality. Get a free, no-obligation quote today.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/contact"
              className="inline-block bg-[#ff6200] hover:bg-[#e55a00] text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Your Project
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;