import { useState, useEffect } from 'react';
import { 
  fetchProducts, createProduct, updateProduct, deleteProduct
} from '../api';
import { 
  Plus, Trash2, Edit2, ShoppingBasket, Package, Tag, Scale, FlaskConical
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [productForm, setProductForm] = useState({ 
    name: '', 
    brand: '', 
    price: '', 
    is_available: true,
    size: '',
    size_unit: 'g'
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data } = await fetchProducts(user._id);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productForm);
      } else {
        await createProduct(productForm);
      }
      setProductForm({ 
        name: '', 
        brand: '', 
        price: '', 
        is_available: true,
        size: '',
        size_unit: 'g'
      });
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      alert('Failed to save product: ' + (err.response?.data?.message || 'Check all fields'));
    }
  };

  if (loading) return <div className="text-center py-20 text-xl font-bold text-gray-600">Loading Inventory...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Shop Inventory</h1>
          <p className="text-gray-500 mt-1">Manage products for your store in <span className="font-bold text-primary-600 capitalize">{user.area}</span></p>
        </div>
        <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg font-bold flex items-center">
          <Package className="w-5 h-5 mr-2" />
          {products.length} Products
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add/Edit Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-8">
            <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
              {editingProduct ? <Edit2 className="w-5 h-5 mr-2 text-blue-500" /> : <Plus className="w-5 h-5 mr-2 text-primary-600" />}
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Product Name</label>
                <input 
                  placeholder="e.g. Fresh Milk" 
                  className="w-full p-3 border-2 border-gray-50 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-500 transition outline-none" 
                  required 
                  value={productForm.name} 
                  onChange={e => setProductForm({...productForm, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Brand</label>
                <input 
                  placeholder="e.g. Nestle" 
                  className="w-full p-3 border-2 border-gray-50 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-500 transition outline-none" 
                  required 
                  value={productForm.brand} 
                  onChange={e => setProductForm({...productForm, brand: e.target.value})} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Size</label>
                  <input 
                    placeholder="e.g. 500" 
                    type="number"
                    className="w-full p-3 border-2 border-gray-50 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-500 transition outline-none" 
                    required 
                    value={productForm.size} 
                    onChange={e => setProductForm({...productForm, size: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Unit</label>
                  <select 
                    className="w-full p-3 border-2 border-gray-50 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-500 transition outline-none"
                    value={productForm.size_unit}
                    onChange={e => setProductForm({...productForm, size_unit: e.target.value})}
                  >
                    <optgroup label="Solid">
                      <option value="g">Grams (g)</option>
                      <option value="kg">Kilograms (kg)</option>
                    </optgroup>
                    <optgroup label="Liquid">
                      <option value="ml">Milliliters (ml)</option>
                      <option value="l">Liters (l)</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Price ($)</label>
                <input 
                  placeholder="0.00" 
                  type="number" 
                  step="0.01" 
                  className="w-full p-3 border-2 border-gray-50 rounded-xl bg-gray-50 focus:bg-white focus:border-primary-500 transition outline-none" 
                  required 
                  value={productForm.price} 
                  onChange={e => setProductForm({...productForm, price: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">In Stock?</label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setProductForm({...productForm, is_available: true})}
                    className={`flex-1 py-2 rounded-lg font-bold transition ${
                      productForm.is_available ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductForm({...productForm, is_available: false})}
                    className={`flex-1 py-2 rounded-lg font-bold transition ${
                      !productForm.is_available ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 font-bold shadow-md transition">
                  {editingProduct ? 'Update Item' : 'Add to Inventory'}
                </button>
                {editingProduct && (
                  <button 
                    type="button"
                    onClick={() => {setEditingProduct(null); setProductForm({name:'', brand:'', price:'', is_available: true, size: '', size_unit: 'g'})}} 
                    className="bg-gray-100 text-gray-600 p-3 rounded-xl hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Product List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">Product</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center">Size</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center">Price</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center">In Stock</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-gray-400 font-medium">
                        <ShoppingBasket className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        No products added yet.
                      </td>
                    </tr>
                  ) : (
                    products.map(p => (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mr-3">
                              <Tag className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">{p.name}</p>
                              <p className="text-xs text-gray-500 font-medium uppercase">{p.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center font-medium text-gray-600">
                          <div className="flex items-center justify-center">
                            {p.size_unit === 'ml' || p.size_unit === 'l' ? <FlaskConical className="w-3 h-3 mr-1" /> : <Scale className="w-3 h-3 mr-1" />}
                            {p.size}{p.size_unit}
                          </div>
                        </td>
                        <td className="p-4 text-center font-bold text-gray-900">${parseFloat(p.price).toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            p.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {p.is_available ? 'YES' : 'NO'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => {
                                setEditingProduct(p); 
                                setProductForm({
                                  name: p.name, 
                                  brand: p.brand, 
                                  price: p.price, 
                                  is_available: p.is_available,
                                  size: p.size,
                                  size_unit: p.size_unit
                                });
                              }} 
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={async () => {if(confirm('Remove this item?')){await deleteProduct(p.id); loadProducts();}}} 
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
