import React, { useEffect } from "react";
import MyOrdersPage from "../../pages/MyOrdersPage";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { LogOut, Mail, User as UserIcon, Calendar, ShoppingCart, ShieldCheck } from "lucide-react";

// Reusable Card component for consistent styling in the light theme
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white/70 backdrop-blur-xl border border-gray-200/80 rounded-2xl shadow-lg shadow-gray-300/20 transition-all duration-300 hover:shadow-xl hover:shadow-gray-300/30 ${className}`}
  >
    {children}
  </div>
);

// Reusable Detail Row for the Account Info card
const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center justify-between py-3">
        <p className="flex items-center text-sm text-gray-500">
            <Icon size={16} className="mr-3" />
            {label}
        </p>
        <p className="font-medium text-gray-700 text-right">{value}</p>
    </div>
);

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      {/* Subtle Watercolor Background Effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-1/4 h-96 w-96 bg-[radial-gradient(circle_at_center,_#67e8f920_0,_#f9fafb_60%)] opacity-70 blur-3xl"></div>
        <div className="absolute bottom-0 -right-1/4 h-80 w-80 bg-[radial-gradient(circle_at_center,_#6ee7b720_0,_#f9fafb_60%)] opacity-70 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto">
        <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Profile & Account Details */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            
            {/* Main Profile Card */}
            <Card className="p-6 text-center flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center ring-4 ring-emerald-500/20 mb-4">
                <span className="text-4xl font-bold text-emerald-600">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
              <p className="text-sm text-gray-500 flex items-center justify-center mt-1">
                <Mail size={14} className="mr-2" />
                {user?.email}
              </p>
              <button
                onClick={handleLogout}
                className="mt-6 flex w-full items-center justify-center bg-red-500/5 hover:bg-red-500/10 border border-red-200 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </button>
            </Card>

            {/* Account Details Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <ShieldCheck size={20} className="mr-3 text-emerald-500" />
                Account Info
              </h2>
              <div className="divide-y divide-gray-200/70">
                <DetailRow icon={UserIcon} label="Full Name" value={user?.name} />
                <DetailRow icon={Mail} label="Email" value={user?.email} />
                <DetailRow
                  icon={Calendar}
                  label="Member Since"
                  value={
                    user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                      : "N/A"
                  }
                />
              </div>
            </Card>
          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <ShoppingCart size={20} className="mr-3 text-emerald-500" />
                Order History
              </h2>
              <div className="overflow-hidden rounded-lg border border-gray-200/80">
                 <MyOrdersPage />
              </div>
            </Card>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Profile;