import { useState, useEffect } from 'react';
import { fetchProducts, fetchOwnersByArea } from '../api';
import { useAuth } from '../context/AuthContext';
import { ShoppingBasket, CheckCircle, ClipboardList, AlertCircle, Store, MapPin, Search, Trash2, Plus } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Shop = () => {
  const { user } = useAuth();
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Structured input state
  const [checkList, setCheckList] = useState([{ name: '', brand: '', size: '' }]);
  const [inventoryStatus, setInventoryStatus] = useState([]);

  // Redirect admin away from shop
  if (user && user.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  useEffect(() => {
    if (user && user.area) {
      loadOwners();
    }
  }, [user]);

  const loadOwners = async () => {
    try {
      const { data } = await fetchOwnersByArea(user.area);
      setOwners(data);
    } catch (err) {
      console.error('Failed to load shop owners');
    }
  };

  const handleOwnerChange = async (ownerId) => {
    setSelectedOwner(ownerId);
    setInventoryStatus([]);
    if (ownerId) {
      setLoading(true);
      try {
        const { data } = await fetchProducts(ownerId);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    } else {
      setProducts([]);
    }
  };

  const addRow = () => {
    setCheckList([...checkList, { name: '', brand: '', size: '' }]);
  };

  const removeRow = (index) => {
    const newList = checkList.filter((_, i) => i !== index);
    setCheckList(newList.length ? newList : [{ name: '', brand: '', size: '' }]);
  };

  const updateRow = (index, field, value) => {
    const newList = [...checkList];
    newList[index][field] = value;
    setCheckList(newList);
  };

  const checkInventory = () => {
    if (!selectedOwner) {
      alert('Please select a shop owner first.');
      return;
    }

    const results = checkList.map(item => {
      const inputName = item.name.trim().toLowerCase();
      const inputBrand = item.brand.trim().toLowerCase();
      const inputSize = item.size.trim().toLowerCase();

      if (!inputName) return null;

      // Strict multi-criteria matching
      const matchedProducts = products.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(inputName) || inputName.includes(p.name.toLowerCase());
        
        let brandMatch = true;
        if (inputBrand) {
          brandMatch = p.brand.toLowerCase().includes(inputBrand) || inputBrand.includes(p.brand.toLowerCase());
        }

        let sizeMatch = true;
        if (inputSize) {
          const productSize = `${p.size}${p.size_unit}`.toLowerCase();
          sizeMatch = productSize.includes(inputSize) || inputSize.includes(productSize);
        }

        return nameMatch && brandMatch && sizeMatch;
      });

      if (matchedProducts.length === 0) {
        return { 
          input: item,
          exists: false, 
          match: null 
        };
      } else {
        const bestMatch = matchedProducts.find(p => p.name.toLowerCase() === inputName) || matchedProducts[0];
        return { 
          input: item,
          exists: true, 
          is_available: bestMatch.is_available,
          match: bestMatch
        };
      }
    }).filter(r => r !== null);

    setInventoryStatus(results);
  };

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header with Shop Selection */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-200">
            <ShoppingBasket className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              SmartMart <span className="text-primary-600">OS</span>
            </h1>
            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
              <MapPin className="w-3 h-3 mr-1" />
              {user.area}
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-xs relative">
          <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select 
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 focus:bg-white transition outline-none font-bold text-sm text-gray-700 appearance-none"
            value={selectedOwner}
            onChange={(e) => handleOwnerChange(e.target.value)}
          >
            <option value="">Select a Store...</option>
            {owners.map(owner => (
              <option key={owner.id} value={owner.id}>{owner.name}'s Store</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Structured List Input */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center text-gray-800">
              <ClipboardList className="w-5 h-5 mr-2 text-primary-600" />
              Check Inventory
            </h2>
            <button 
              onClick={addRow}
              className="flex items-center text-primary-600 font-bold hover:text-primary-700 transition text-sm"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Item
            </button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {checkList.map((item, index) => (
              <div key={index} className="flex flex-wrap md:flex-nowrap gap-3 items-end p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Product Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Milk"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-primary-500 outline-none transition"
                    value={item.name}
                    onChange={(e) => updateRow(index, 'name', e.target.value)}
                  />
                </div>
                <div className="w-full md:w-32">
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Brand</label>
                  <input 
                    type="text" 
                    placeholder="Optional"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-primary-500 outline-none transition"
                    value={item.brand}
                    onChange={(e) => updateRow(index, 'brand', e.target.value)}
                  />
                </div>
                <div className="w-full md:w-24">
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Size</label>
                  <input 
                    type="text" 
                    placeholder="Optional"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-primary-500 outline-none transition"
                    value={item.size}
                    onChange={(e) => updateRow(index, 'size', e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => removeRow(index)}
                  className="p-2.5 text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={checkInventory}
            disabled={!selectedOwner || loading}
            className="w-full mt-8 bg-primary-600 text-white px-6 py-4 rounded-xl font-black text-lg hover:bg-primary-700 transition flex items-center justify-center shadow-lg shadow-primary-100 disabled:opacity-50 uppercase tracking-widest"
          >
            <Search className="w-5 h-5 mr-2" />
            Check Availability
          </button>
        </div>

        {/* Detailed Results Section */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 min-h-[400px]">
          <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Store Availability Results
          </h2>
          
          {inventoryStatus.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 opacity-50">
              <ClipboardList className="w-16 h-16" />
              <p className="font-bold">Enter items and check availability</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inventoryStatus.map((status, i) => (
                <div 
                  key={i} 
                  className={`p-5 rounded-2xl border-2 transition shadow-sm ${
                    !status.exists || !status.is_available ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center font-black text-xl mb-1">
                        {!status.exists || !status.is_available ? <AlertCircle className="w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                        <span className="capitalize">{status.input.name}</span>
                      </div>
                      <div className="text-xs font-bold opacity-70 flex gap-2">
                        {status.input.brand && <span>Brand: {status.input.brand}</span>}
                        {status.input.size && <span>Size: {status.input.size}</span>}
                      </div>
                    </div>
                    <span className="text-xs font-black uppercase px-3 py-1.5 rounded-full bg-white/50 border border-current">
                      {!status.exists ? 'Not Found' : !status.is_available ? 'Out of Stock' : 'In Stock'}
                    </span>
                  </div>

                  {status.exists && (
                    <div className="mt-4 pt-4 border-t border-current/10 flex flex-wrap justify-between items-end gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-black opacity-90">{status.match.name}</p>
                        <p className="text-xs font-bold opacity-60 uppercase tracking-wider">
                          {status.match.brand} • {status.match.size}{status.match.size_unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black opacity-40 uppercase">Price</p>
                        <p className="text-2xl font-black">${parseFloat(status.match.price).toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
