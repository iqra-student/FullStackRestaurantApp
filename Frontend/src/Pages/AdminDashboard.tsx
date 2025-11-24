import { useState, useEffect } from 'react';
import { Package, ShoppingBag, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';

const API_BASE = 'http://localhost:5277/api';

interface DashboardStats {
  totalProducts: number;
  totalIngredients: number;
  totalCategories: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalIngredients: 0,
    totalCategories: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch products count
      const productsRes = await fetch(`${API_BASE}/AdminProduct`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!productsRes.ok) {
        if (productsRes.status === 401) {
          alert('Session expired. Please login again.');
          navigate('/adminlogin');
          return;
        }
        throw new Error('Failed to fetch products');
      }
      const products = await productsRes.json();

      // Fetch ingredients count
      const ingredientsRes = await fetch(`${API_BASE}/AdminIngredient`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const ingredients = await ingredientsRes.json();

      // Fetch categories count
      const categoriesRes = await fetch(`${API_BASE}/AdminProduct/categories`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const categories = await categoriesRes.json();

      setStats({
        totalProducts: products.length,
        totalIngredients: ingredients.length,
        totalCategories: categories.length
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Products Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
              </div>
              <Package className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          {/* Total Ingredients Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Ingredients</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalIngredients}</p>
              </div>
              <ShoppingBag className="h-12 w-12 text-green-500" />
            </div>
          </div>

          {/* Categories Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Categories</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCategories}</p>
              </div>
              <Layers className="h-12 w-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/products')}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-6 text-left transition"
            >
              <Package className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Manage Products</h3>
              <p className="text-sm text-gray-600 mt-1">Add, edit or delete products</p>
            </button>

            <button
              onClick={() => navigate('/admin/ingredients')}
              className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-6 text-left transition"
            >
              <ShoppingBag className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Manage Ingredients</h3>
              <p className="text-sm text-gray-600 mt-1">Add, edit or delete ingredients</p>
            </button>

            <button
              onClick={() => navigate('/admin/categories')}
              className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-6 text-left transition"
            >
              <Layers className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Manage Categories</h3>
              <p className="text-sm text-gray-600 mt-1">Add, edit or delete categories</p>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;