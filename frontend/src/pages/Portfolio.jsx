import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Portfolio Data (images removed) ---
const portfolioItems = [
  { id: 1, category: 'automotive', title: 'Automotive Prototype', description: 'High-precision SLA prototype used for fit and function testing.' },
  { id: 2, category: 'healthcare', title: 'Medical Anatomical Model', description: 'Detailed anatomical model used for pre-surgical planning.' },
  { id: 3, category: 'jewelry', title: 'Jewelry Casting Pattern', description: 'Intricate ring pattern printed in castable wax resin.' },
  { id: 4, category: 'automotive', title: 'Custom Assembly Jig', description: 'A durable jig printed in PETG to speed up manual assembly.' },
  { id: 5, category: 'healthcare', title: 'Surgical Guide', description: 'Patient-specific guide for precise surgical outcomes.' },
  { id: 6, category: 'aerospace', title: 'Lightweight Drone Component', description: 'Complex part optimized for strength and low weight using SLS.' }
];

const filterButtons = [
  { name: 'All', filter: 'all' },
  { name: 'Automotive', filter: 'automotive' },
  { name: 'Healthcare', filter: 'healthcare' },
  { name: 'Jewelry', filter: 'jewelry' },
  { name: 'Aerospace', filter: 'aerospace' },
];

function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredItems, setFilteredItems] = useState(portfolioItems);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredItems(portfolioItems);
    } else {
      setFilteredItems(portfolioItems.filter(item => item.category === activeFilter));
    }
  }, [activeFilter]);

  return (
    <main>
      <section id="gallery" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Work Showcase</h1>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Examples of our high-quality 3D printed parts for various industries.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {filterButtons.map(({ name, filter }) => (
              <button
                key={name}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${
                  activeFilter === filter
                    ? 'bg-[#ff6200] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredItems.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden group transition-shadow duration-300"
                >
                  {/* Image replaced with Alt Text */}
                  <div className="flex items-center justify-center h-60 bg-gray-100 text-gray-500 p-4">
                    <p className="italic text-center">{item.title}</p>
                  </div>
                  
                  <div className="p-6 text-left">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default Portfolio;