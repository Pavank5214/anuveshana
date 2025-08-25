import { GaugeCircle, DraftingCompass, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    id: 1,
    icon: <DraftingCompass className="w-8 h-8 text-white" />,
    title: "Unmatched Precision",
    desc: "Industrial-grade quality for functional parts and prototypes.",
    gradient: "from-orange-500 to-amber-400",
  },
  {
    id: 2,
    icon: <GaugeCircle className="w-8 h-8 text-white" />,
    title: "Rapid Turnaround",
    desc: "From digital file to physical part delivered in just days.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    id: 3,
    icon: <Users className="w-8 h-8 text-white" />,
    title: "Expert Consultation",
    desc: "Our engineers help you choose the right material and process.",
    gradient: "from-slate-600 to-gray-500",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
          >
            {/* Icon */}
            <div
              className={`bg-gradient-to-br ${feature.gradient} p-5 rounded-full mb-6 shadow-md`}
            >
              {feature.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm text-center">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;