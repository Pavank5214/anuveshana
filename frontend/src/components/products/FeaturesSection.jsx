import { GaugeCircle, DraftingCompass, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    id: 1,
    icon: <DraftingCompass className="w-8 h-8 text-white" />,
    title: "Unmatched Precision",
    desc: "Industrial-grade quality for functional parts and prototypes, ensuring tolerances are met with microscopic accuracy.",
    gradient: "from-orange-500 to-amber-500",
    shadow: "shadow-orange-500/20"
  },
  {
    id: 2,
    icon: <GaugeCircle className="w-8 h-8 text-white" />,
    title: "Rapid Turnaround",
    desc: "From digital file to physical part delivered in just days. We optimize production lines to meet tight deadlines.",
    gradient: "from-blue-600 to-cyan-500",
    shadow: "shadow-blue-500/20"
  },
  {
    id: 3,
    icon: <Users className="w-8 h-8 text-white" />,
    title: "Expert Consultation",
    desc: "Our dedicated engineers help you select the optimal materials and manufacturing processes for your specific needs.",
    gradient: "from-slate-600 to-slate-500",
    shadow: "shadow-slate-500/20"
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 bg-[#0B0F19] relative overflow-hidden">
      
      {/* --- Global Background Elements --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* Subtle glow behind the section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group flex flex-col items-center bg-slate-900/50 backdrop-blur-md rounded-3xl p-8 border border-slate-800 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300"
            >
              {/* Icon Container with Glow */}
              <div
                className={`bg-gradient-to-br ${feature.gradient} p-5 rounded-2xl mb-8 shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3 text-center group-hover:text-orange-400 transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 text-sm text-center leading-relaxed max-w-xs">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;