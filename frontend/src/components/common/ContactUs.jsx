import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Sending...');

    try {
      const response = await fetch('https://formspree.io/f/your_form_id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Thank you! Your message has been sent successfully.');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      setStatus('Oops! There was a problem submitting your form. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <MapPin size={20} />, text: "APMC Yard, Vijayapura, Karnataka, 586101" },
    { icon: <Phone size={20} />, text: "+91 89518 52210", href: "tel:+918951852210" },
    { icon: <Mail size={20} />, text: "contact@anuveshana.tech", href: "mailto:contact@anuveshana.tech" },
    { icon: <Clock size={20} />, text: "Mon - Sat, 9:00 AM - 6:00 PM" },
  ];

  return (
    <main>
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold">Get In Touch</h1>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Have a question or a project in mind? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            {/* Contact Info Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="text-[#ff6200] mt-1 mr-4 flex-shrink-0">{item.icon}</div>
                    {item.href ? (
                      <a href={item.href} className="text-gray-700 hover:text-[#ff6200] transition-colors">{item.text}</a>
                    ) : (
                      <p className="text-gray-700">{item.text}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact Form Column */}
            <motion.form
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                  <input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6200] focus:border-transparent transition" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Your Email</label>
                  <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6200] focus:border-transparent transition" required />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number (Optional)</label>
                  <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6200] focus:border-transparent transition" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Your Message</label>
                  <textarea id="message" rows="5" value={formData.message} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6200] focus:border-transparent transition" required></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#ff6200] hover:bg-[#e55a00] text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
                {status && (
                  <p className={`text-center font-semibold ${status.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                    {status}
                  </p>
                )}
              </div>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-[50vh]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3822.464197364132!2d75.7481139152885!3d16.82773418852366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc6555555555555%3A0x2614b8c9a6a89c9a!2sAPMC%20Yard%2C%20Vijayapura%2C%20Karnataka%20586101!5e0!3m2!1sen!2sin!4v1661421890123!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Anuveshana Technologies Location"
        ></iframe>
      </section>
    </main>
  );
}

export default ContactPage;