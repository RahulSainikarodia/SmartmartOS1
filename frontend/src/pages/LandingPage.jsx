import { Link } from 'react-router-dom';
import { ShoppingBasket, ShieldCheck, MapPin, ClipboardList, Store, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
              <div className="max-w-lg">
                <span className="inline-block py-1 px-3 mb-4 text-xs font-bold bg-primary-50 text-primary-600 rounded-full uppercase">
                  Digital Grocery Management
                </span>
                <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                  SmartMart <span className="text-primary-600">OS</span>
                </h1>
                <p className="text-xl text-gray-500 mb-10 leading-relaxed">
                  The modern digital operating system for local grocery stores. Check inventory availability in your area instantly, without leaving home.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/register"
                    className="inline-block px-8 py-4 text-white font-bold bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-200 transition duration-200"
                  >
                    Get Started Now
                  </Link>
                  <Link
                    to="/login"
                    className="inline-block px-8 py-4 text-gray-900 font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition duration-200"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <div className="relative max-w-md mx-auto lg:mr-0">
                <div className="absolute top-0 left-0 w-full h-full bg-primary-600 rounded-3xl transform rotate-3 -z-10 opacity-10"></div>
                <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-primary-100 p-3 rounded-xl">
                      <ShoppingBasket className="w-8 h-8 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Live Inventory</h3>
                      <p className="text-sm text-gray-500">Real-time stock updates</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>
                    <div className="h-4 bg-gray-100 rounded-full w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Why use SmartMart OS?</h2>
            <p className="text-gray-500 text-lg">Solving real-world problems for local shoppers and shop owners.</p>
          </div>
          <div className="flex flex-wrap -mx-4">
            <FeatureCard 
              icon={<MapPin className="w-6 h-6 text-white" />}
              color="bg-blue-500"
              title="Area Matching"
              description="Find and connect with shop owners directly in your local area or city."
            />
            <FeatureCard 
              icon={<ClipboardList className="w-6 h-6 text-white" />}
              color="bg-primary-500"
              title="Smart Check"
              description="Type your grocery list and instantly see what's available in your chosen store."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-white" />}
              color="bg-green-500"
              title="Verified Stock"
              description="No more wasted trips. Know exactly what's in stock before you leave your house."
            />
            <FeatureCard 
              icon={<Store className="w-6 h-6 text-white" />}
              color="bg-purple-500"
              title="For Shop Owners"
              description="Manage your inventory with ease. Toggle stock availability with one click."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
              <Zap className="w-12 h-12 text-yellow-500 mb-6" />
              <h2 className="text-4xl font-black text-gray-900 mb-6">Experience the future of local shopping</h2>
              <ul className="space-y-6">
                <StepItem number="1" text="Register as a Customer or Shop Owner." />
                <StepItem number="2" text="Customers select a shop in their local area." />
                <StepItem number="3" text="Type your list and get instant availability results." />
              </ul>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <div className="bg-gray-900 p-12 rounded-3xl text-white">
                <blockquote className="text-2xl font-medium mb-8">
                  "SmartMart OS has completely changed how I manage my small grocery store. My customers love being able to check stock before coming in!"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-full"></div>
                  <div>
                    <p className="font-bold text-white">Rahul Saini</p>
                    <p className="text-gray-400 text-sm">Shop Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-8">Ready to modernize your shopping?</h2>
          <Link
            to="/register"
            className="inline-block px-10 py-5 text-primary-600 font-black bg-white hover:bg-gray-100 rounded-2xl transition duration-200 shadow-xl"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, color, title, description }) => (
  <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 h-full">
      <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  </div>
);

const StepItem = ({ number, text }) => (
  <li className="flex items-start space-x-4">
    <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
      {number}
    </span>
    <p className="text-lg text-gray-600 font-medium">{text}</p>
  </li>
);

export default LandingPage;
