import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';

// --- Mock Blog Data (images removed) ---
const blogPosts = [
  {
    id: 1,
    title: 'Choosing the Right Material for Your 3D Print',
    excerpt: 'From flexible TPU to rigid carbon fiber, the material you choose is crucial. We break down the pros and cons of the most popular FDM, SLA, and SLS materials.',
    category: 'Materials',
    author: 'Rohan K.',
    date: 'August 25, 2025',
  },
  {
    id: 2,
    title: 'A Beginner\'s Guide to Rapid Prototyping',
    excerpt: 'Turn your ideas into reality faster than ever. This guide explains the rapid prototyping workflow and how it can accelerate your product development cycle.',
    category: 'Prototyping',
    author: 'Anjali M.',
    date: 'August 18, 2025',
  },
  {
    id: 3,
    title: 'How 3D Printing is Revolutionizing the Aerospace Industry',
    excerpt: 'Discover how additive manufacturing is creating lighter, stronger, and more complex parts for aerospace applications, from drones to satellite components.',
    category: 'Industry News',
    author: 'Dr. Priya S.',
    date: 'August 05, 2025',
  },
];

function BlogPage() {
  return (
    <main>
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold">From the Blog</h1>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Insights, tutorials, and news from the world of 3D printing and manufacturing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden group transition-shadow duration-300 flex flex-col">
                <Link to={`/blog/${post.id}`} className="block">
                  {/* Image replaced with Alt Text Placeholder */}
                  <div className="flex items-center justify-center h-56 bg-gray-100 text-gray-500 p-4">
                    <p className="italic text-center">{post.title}</p>
                  </div>
                </Link>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <span className="inline-block bg-orange-100 text-[#ff6200] text-sm font-semibold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 flex-grow">
                    <Link to={`/blog/${post.id}`} className="hover:text-[#ff6200] transition-colors duration-300">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-6">{post.excerpt}</p>
                  <div className="mt-auto border-t border-gray-200 pt-4 flex items-center text-sm text-gray-500">
                    <div className="flex items-center mr-6">
                      <User size={16} className="mr-2" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default BlogPage;