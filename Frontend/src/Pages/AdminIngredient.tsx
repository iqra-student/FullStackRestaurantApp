import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, AlertTriangle, Package, Upload, X, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';

// Types
interface Ingredient {
  ingredientId: number;
  name: string;
  description: string;
}

interface UsageCheckResult {
  isInUse: boolean;
  productCount: number;
  products: Array<{
    productId: number;
    productName: string;
  }>;
}

interface BulkCreateResult {
  totalProcessed: number;
  successCount: number;
  skippedCount: number;
  createdIngredients: Ingredient[];
  skippedIngredients: Array<{
    name: string;
    reason: string;
  }>;
}

const API_BASE = 'https://localhost:7133/api';

const AdminIngredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  
  // Modal states
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkResultModal, setShowBulkResultModal] = useState(false);
  
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [deletingIngredientId, setDeletingIngredientId] = useState<number | null>(null);
  const [usageData, setUsageData] = useState<UsageCheckResult | null>(null);
  const [bulkResult, setBulkResult] = useState<BulkCreateResult | null>(null);

  // Form states
  const [ingredientForm, setIngredientForm] = useState({
    name: '',
    description: ''
  });

  const [bulkInput, setBulkInput] = useState('');

  // Fetch all ingredients
  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/AdminIngredient`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please login again.');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setIngredients(data);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      setError('Failed to fetch ingredients');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // Check ingredient usage
  const checkIngredientUsage = async (id: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/AdminIngredient/check-usage/${id}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsageData(data);
      setShowUsageModal(true);
    } catch (error) {
      console.error('Error checking usage:', error);
      setError('Failed to check ingredient usage');
    }
    setLoading(false);
  };

  // Create or Update ingredient
  const handleIngredientSubmit = async () => {
    if (!ingredientForm.name.trim()) {
      setError('Ingredient name is required');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const url = editingIngredient 
        ? `${API_BASE}/AdminIngredient/${editingIngredient.ingredientId}`
        : `${API_BASE}/AdminIngredient`;
      
      const method = editingIngredient ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: ingredientForm.name.trim(),
          description: ingredientForm.description.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      await fetchIngredients();
      setShowIngredientModal(false);
      resetIngredientForm();
    } catch (error: any) {
      console.error('Error saving ingredient:', error);
      setError(error.message || 'Failed to save ingredient. It may already exist.');
    }
    setLoading(false);
  };

  // Delete ingredient
  const handleDeleteIngredient = async () => {
    if (!deletingIngredientId) return;

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const usageResponse = await fetch(`${API_BASE}/AdminIngredient/check-usage/${deletingIngredientId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (usageResponse.ok) {
        const usageData = await usageResponse.json();
        if (usageData.isInUse) {
          setError(`Cannot delete: This ingredient is used in ${usageData.productCount} product(s)`);
          setShowDeleteConfirm(false);
          setDeletingIngredientId(null);
          setLoading(false);
          return;
        }
      }

      const response = await fetch(`${API_BASE}/AdminIngredient/${deletingIngredientId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete ingredient');
      }

      await fetchIngredients();
      setShowDeleteConfirm(false);
      setDeletingIngredientId(null);
    } catch (error: any) {
      console.error('Error deleting ingredient:', error);
      setError(error.message || 'Failed to delete ingredient');
    }
    setLoading(false);
  };

  // Bulk create ingredients
  const handleBulkCreate = async () => {
    if (!bulkInput.trim()) {
      setError('Please enter ingredients data');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const lines = bulkInput.trim().split('\n').filter(line => line.trim());
      const ingredientsToCreate = lines.map(line => {
        const parts = line.split('|').map(p => p.trim());
        return {
          name: parts[0] || '',
          description: parts[1] || ''
        };
      }).filter(ing => ing.name);

      if (ingredientsToCreate.length === 0) {
        setError('No valid ingredients found. Use format: Name|Description (one per line)');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/AdminIngredient/bulk-create`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ingredients: ingredientsToCreate
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setBulkResult(result);
      setShowBulkModal(false);
      setShowBulkResultModal(true);
      setBulkInput('');
      await fetchIngredients();
    } catch (error: any) {
      console.error('Error bulk creating ingredients:', error);
      setError(error.message || 'Failed to create ingredients in bulk');
    }
    setLoading(false);
  };

  // Edit ingredient
  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIngredientForm({
      name: ingredient.name,
      description: ingredient.description || ''
    });
    setShowIngredientModal(true);
  };

  // Reset form
  const resetIngredientForm = () => {
    setIngredientForm({
      name: '',
      description: ''
    });
    setEditingIngredient(null);
    setError('');
  };

  // Confirm delete
  const confirmDelete = (id: number) => {
    setDeletingIngredientId(id);
    setShowDeleteConfirm(true);
  };

  // Filter ingredients
  const filteredIngredients = ingredients.filter(ing => 
    ing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ing.description && ing.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
    <AdminLayout>
   
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Ingredients Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              resetIngredientForm();
              setShowBulkModal(true);
            }}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </button>
          <button
            onClick={() => {
              resetIngredientForm();
              setShowIngredientModal(true);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Ingredient
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => setError('')}
              className="text-sm text-red-600 hover:text-red-800 mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading && ingredients.length === 0 ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading ingredients...</p>
          </div>
        ) : filteredIngredients.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No ingredients found</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIngredients.map((ingredient) => (
                <tr key={ingredient.ingredientId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{ingredient.ingredientId}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{ingredient.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{ingredient.description || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => checkIngredientUsage(ingredient.ingredientId)}
                        className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition"
                        title="Check Usage"
                      >
                        Usage
                      </button>
                      <button
                        onClick={() => handleEditIngredient(ingredient)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => confirmDelete(ingredient.ingredientId)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Ingredient Modal */}
      {showIngredientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ingredientForm.name}
                    onChange={(e) => setIngredientForm({...ingredientForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Tomato"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={ingredientForm.description}
                    onChange={(e) => setIngredientForm({...ingredientForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Optional description..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowIngredientModal(false);
                    resetIngredientForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleIngredientSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                <h2 className="text-xl font-bold">Confirm Delete</h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this ingredient? This action cannot be undone.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingIngredientId(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteIngredient}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Check Modal */}
      {showUsageModal && usageData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Ingredient Usage</h2>
                <button onClick={() => setShowUsageModal(false)}>
                  <X className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              {usageData.isInUse ? (
                <div>
                  <div className="flex items-center mb-4 text-orange-600">
                    <Package className="h-5 w-5 mr-2" />
                    <p className="font-medium">
                      Used in {usageData.productCount} product{usageData.productCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {usageData.products.map((product) => (
                      <div key={product.productId} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">{product.productName}</p>
                        <p className="text-sm text-gray-500">ID: {product.productId}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-600">This ingredient is not currently used in any products.</p>
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={() => setShowUsageModal(false)}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Bulk Upload Ingredients</h2>
              
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Format:</strong> Enter one ingredient per line using: <code>Name|Description</code>
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Example:<br/>
                  Tomato|Fresh red tomatoes<br/>
                  Cheese|Mozzarella cheese<br/>
                  Basil|Fresh basil leaves
                </p>
              </div>

              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                placeholder="Tomato|Fresh red tomatoes&#10;Cheese|Mozzarella cheese&#10;Basil|Fresh basil leaves"
              />

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowBulkModal(false);
                    setBulkInput('');
                    setError('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkCreate}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400"
                >
                  {loading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Result Modal */}
      {showBulkResultModal && bulkResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Bulk Upload Results</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-blue-600">Total Processed</p>
                  <p className="text-2xl font-bold text-blue-900">{bulkResult.totalProcessed}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-green-600">Created</p>
                  <p className="text-2xl font-bold text-green-900">{bulkResult.successCount}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg text-center">
                  <p className="text-sm text-orange-600">Skipped</p>
                  <p className="text-2xl font-bold text-orange-900">{bulkResult.skippedCount}</p>
                </div>
              </div>

              {bulkResult.createdIngredients.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Successfully Created ({bulkResult.createdIngredients.length})
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {bulkResult.createdIngredients.map((ing) => (
                      <div key={ing.ingredientId} className="p-2 bg-green-50 rounded">
                        <p className="font-medium text-sm">{ing.name}</p>
                        {ing.description && <p className="text-xs text-gray-600">{ing.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {bulkResult.skippedIngredients.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-orange-800 mb-2 flex items-center">
                    <XCircle className="h-5 w-5 mr-2" />
                    Skipped ({bulkResult.skippedIngredients.length})
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {bulkResult.skippedIngredients.map((ing, idx) => (
                      <div key={idx} className="p-2 bg-orange-50 rounded">
                        <p className="font-medium text-sm">{ing.name}</p>
                        <p className="text-xs text-orange-700">{ing.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={() => setShowBulkResultModal(false)}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    
    </AdminLayout>
    </>
  );
};

export default AdminIngredients;