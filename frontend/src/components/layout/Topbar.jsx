import {TbBrandMeta} from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const Topbar = () => {
  return (
    <div className="bg-[#ea2e0e] text-white">
        <div className="container mx-auto flex justify-between items-center py-3 px-4">
            <div className="hidden md:flex items-center space-x-4">
                <a href="#" className="hover:text-gray-300">
                    <TbBrandMeta className="h-5 W-5"/>
                </a>
                <a href="#" className="hover:text-gray-300">
                    <IoLogoInstagram className="h-5 W-5"/>
                </a>
                <a href="#" className="hover:text-gray-300">
                    <RiTwitterXLine className="h-4 W-4"/>
                </a>
            </div>
            <div className="text-sm text-center flex-grow">
                <span>We ship worldWide - Fast and reliable shipping!</span>
            </div>
            <div className="text-sm hidden md:block">
                <a href="tel:+919380400291" className="hover:text-grey-300">
                    +91 9380400291
                </a>
            </div>
        </div>
    </div>
  )
}

export default Topbar