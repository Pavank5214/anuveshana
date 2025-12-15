import React, { useEffect,useState } from 'react'
import Hero from   "../components/layout/Hero"
import GenderCollectionSection from '../components/products/GenderCollectionSection'
import NewArrivals from '../components/products/NewArrivals'
import ProductDetails from '../components/products/ProductDetails'
import ProductGrid from '../components/products/ProductGrid'
import FeaturedCollection from '../components/products/FeaturedCollection'
import FeaturesSection from '../components/products/FeaturesSection'
import {useDispatch , useSelector} from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import axios from "axios";
import Features from "../components/common/Features"


const Home = () => {
  const dispatch = useDispatch();
  const {products , loading , error} = useSelector((state)=> state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(()=>{
    // Fetch products for a speecific collection
    dispatch(fetchProductsByFilters({
      gender : "Women",
      category: "Bottom Wear",
      limit : 8,
    }))
  
  //Fetch best seller product
  const fetchBestSeller = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
      setBestSellerProduct(response.data)
    } catch (error) {
      console.error(error);
    }
  }
  fetchBestSeller()
}, [dispatch]);
  return (
    <div className='pt-26'>
      <Hero/>
    {/* <GenderCollectionSection/> */}
    {/* <NewArrivals/> */}
    <Features />
    {/* Best Sellers */}
    {/* <h2 className="text-3xl text-center font-bold mb-4">Best Seller </h2>
      {bestSellerProduct ? (<ProductDetails productId={bestSellerProduct._id}/>) : 
      (<p className='text-center'>Loading best seller product ...</p>)} */}
     
    
    {/* <div className="container mx-auto">
      <h2 className="text-3xl text-center font-bold mb-4">
        Top Wears for Womwen
      </h2>
      <ProductGrid products={products} loading={loading} error={error}/>
    </div> */}
    <FeaturedCollection/>
    <FeaturesSection/>
    </div>
  )
}

export default Home