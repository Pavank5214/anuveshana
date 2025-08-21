import React, { useRef, useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollByAmount = 300;

 const [newArrivals , setNewArrivals] = useState([]);

 useEffect(()=>{
    const fetchNewArrivals= async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
        setNewArrivals(response.data);
      } catch (error) {
        console.error(error)
      }
    }
    fetchNewArrivals();
 },[])

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -scrollByAmount, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: scrollByAmount, behavior: 'smooth' });
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
  
    let isDown = false;
    let startX;
    let scrollLeft;

    
    const handleMouseDown = (e) => {
        if (e.target.closest('button')) return; // ⛔ prevent drag start from buttons
        isDown = true;
        container.classList.add('cursor-grabbing');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      };
      
    const handleMouseLeave = () => {
      isDown = false;
      container.classList.remove('cursor-grabbing');
    };
  
    const handleMouseUp = () => {
      isDown = false;
      container.classList.remove('cursor-grabbing');
    };
  
    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 5; // scroll speed
      container.scrollLeft = scrollLeft - walk;
    };
  
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('scroll', updateScrollButtons);
    updateScrollButtons(); // Initial check
  
    return () => {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('scroll', updateScrollButtons); // ✅
      };
      
  }, [newArrivals]);
  

  return (
    <section className="py-10">
      <div className="container mx-auto text-center mb-15 relative px-4">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover the latest 3D parts and robotic projects freshly added to our collection.
        </p>

        {/* Arrow buttons */}
        <div className="absolute right-[10px] bottom-[-50px] sm:bottom-[-40px] md:bottom-[-50px] flex space-x-2">

          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`p-2 rounded border bg-white text-black shadow ${
              !canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`p-2 rounded border bg-white text-black shadow ${
              !canScrollRight ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Scrollable product list */}
      <div
       ref={scrollRef}
       className="flex overflow-x-auto space-x-4 px-4 scroll-smooth scrollbar-hide cursor-grab"
     >
     
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className=" min-w-[80%]  sm:min-w-[45%] md:min-w-[30%] lg:min-w-[22%] flex-shrink-0 relative rounded-lg shadow-md overflow-hidden transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.altText || product.name}
              className="w-full h-85 object-cover"
              draggable={false}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3">
              <Link to={`/products/${product._id}`} className="block">
                <h4 className="font-semibold truncate">{product.name}</h4>
                <p className="text-sm">${product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
