import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Target, Cuboid, Bot, BrainCircuit } from "lucide-react";
import aboutus from "../../assets/aboutus.jpg";
import { useEffect, useState } from "react";

const AboutPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on page load

    // Simulate fetch delay (remove in real app)
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 py-16 md:py-24 animate-pulse">
        {/* Hero Skeleton */}
        <div className="max-w-3xl mx-auto px-4 mt-20 mb-16 space-y-6">
          <div className="h-12 w-3/4 bg-gray-300 rounded" />
          <div className="h-6 w-full bg-gray-300 rounded" />
        </div>

        {/* Mission Skeleton */}
        <div className="container mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center bg-white rounded-lg shadow-md mb-16">
          <div className="space-y-4">
            <div className="h-6 w-1/4 bg-gray-300 rounded" />
            <div className="h-10 w-3/4 bg-gray-300 rounded" />
            <div className="h-40 w-full bg-gray-300 rounded" />
          </div>
          <div className="h-72 w-full bg-gray-300 rounded-2xl" />
        </div>

        {/* Team Skeleton */}
        <div className="container mx-auto px-4 py-16 md:py-24 text-center mb-16 space-y-8">
          <div className="h-6 w-1/4 bg-gray-300 rounded mx-auto" />
          <div className="h-10 w-1/2 bg-gray-300 rounded mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {Array(3).fill(0).map((_, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto" />
                <div className="h-5 w-3/4 bg-gray-300 rounded mx-auto" />
                <div className="h-4 w-1/2 bg-gray-300 rounded mx-auto" />
                <div className="h-10 w-full bg-gray-300 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Technology Skeleton */}
        <div className="container mx-auto px-4 py-16 md:py-24 text-center mb-16 bg-white rounded-lg shadow-md space-y-8">
          <div className="h-10 w-1/3 bg-gray-300 rounded mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {Array(3).fill(0).map((_, idx) => (
              <div key={idx} className="border border-gray-200 p-8 rounded-lg space-y-4">
                <div className="h-8 w-8 bg-gray-300 rounded-full mx-auto" />
                <div className="h-5 w-3/4 bg-gray-300 rounded mx-auto" />
                <div className="h-10 w-full bg-gray-300 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Skeleton */}
        <div className="container mx-auto px-4 py-16 md:py-24 text-center bg-gray-800 rounded-lg shadow-md space-y-4">
          <div className="h-10 w-1/2 bg-gray-300 rounded mx-auto" />
          <div className="h-6 w-3/4 bg-gray-300 rounded mx-auto" />
          <div className="h-12 w-40 bg-gray-300 rounded mx-auto mt-4" />
        </div>
      </main>
    );
  }

  

const teamMembers = [
  { name: "Rohan K.", role: "Founder & Lead Engineer", bio: "With a decade of experience in mechanical engineering, Rohan founded Anuveshana to bring industrial-grade prototyping to everyone." },
  { name: "Anjali M.", role: "Head of Design & Prototyping", bio: "Anjali is a product design expert who helps clients optimize their models for perfect prints and functionality." },
  { name: "Dr. Priya S.", role: "Materials Specialist", bio: "Holding a Ph.D. in material science, Priya ensures we use the best possible materials for every unique application." },
];

const technologies = [
  { icon: <Cuboid size={32} />, name: "FDM (Fused Deposition Modeling)", description: "Perfect for rapid prototyping, jigs, and fixtures using a wide range of thermoplastic filaments." },
  { icon: <Bot size={32} />, name: "SLA (Stereolithography)", description: "Delivers incredible detail and smooth surface finishes using photopolymer resins, ideal for visual models and jewelry." },
  { icon: <BrainCircuit size={32} />, name: "SLS (Selective Laser Sintering)", description: "Creates strong, functional parts from nylon powder, suitable for complex geometries and end-use components." },
];



  return (
    <main className="min-h-screen bg-gray-100 py-16 md:py-24">
      {/* Hero Section */}
      <section className="relative  flex items-center justify-center text-center px-4 mt-20 mb-16">
        <div className="absolute inset-0 " />
        <motion.div
          className="relative max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            About Anuveshana Technologies
          </h1>
          <p className="text-lg md:text-xl">
            Pioneering the future of manufacturing with precision, passion, and innovation.
          </p>
        </motion.div>
      </section>

      {/* Our Mission Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center bg-white rounded-lg shadow-md mb-16">
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Democratizing Advanced Manufacturing
          </h2>
          <p className="text-gray-600 leading-relaxed">
  Our mission is to empower innovators—from individual creators to large enterprises—by providing accessible, high-precision 3D printing and manufacturing services. We bridge the gap between digital design and physical reality, helping bring groundbreaking ideas to life faster and more efficiently than ever before. 
  <br /><br />
  We believe that innovation should have no limits. By combining cutting-edge technologies with a deep understanding of materials and design, we enable our clients to prototype, test, and produce complex parts with unparalleled accuracy. Whether it’s a functional component for an industrial machine, a custom medical device, or a one-of-a-kind design object, our goal is to make advanced manufacturing approachable and reliable. 
  <br /><br />
  Beyond technology, we are committed to sustainability, quality, and collaboration. Our team works closely with clients at every stage, offering guidance on design optimization, material selection, and production efficiency. At Anuveshana Technologies, we don’t just manufacture parts—we help turn visions into tangible, impactful products that can transform industries and enrich lives.
</p>

        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          <motion.img
            src={aboutus}
            alt="About Us"
            className="rounded-2xl shadow-lg max-w-full h-auto object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </section>

      {/* Meet the Team Section */}
      {/* <section className="container mx-auto px-4 py-16 md:py-24 text-center mb-16">
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
      </section> */}

      {/* Our Technology Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center mb-16 bg-white rounded-lg shadow-md">
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
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center bg-gray-800 text-white rounded-lg shadow-md">
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
      </section>
    </main>
  );
}

export default AboutPage;
