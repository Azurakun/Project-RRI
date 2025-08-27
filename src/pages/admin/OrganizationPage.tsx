import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { PlusIcon, EditIcon, TrashIcon, UsersIcon, SaveIcon, XIcon } from 'lucide-react';
import { supabase, OrganizationMember, dbOperations } from '../../lib/supabase';
import { ImageUpload } from '../../components/ImageUpload/ImageUpload';

export const OrganizationPage = (): JSX.Element => {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<OrganizationMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    photo_url: '',
    bio: '',
    order_index: 0
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organization_members')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      
      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMember = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      position: '',
      department: '',
      email: '',
      phone: '',
      photo_url: '',
      bio: '',
      order_index: members.length + 1
    });
    setShowForm(true);
  };

  const handleEditMember = (member: OrganizationMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      department: member.department,
      email: member.email,
      phone: member.phone,
      photo_url: member.photo_url,
      bio: member.bio,
      order_index: member.order_index
    });
    setShowForm(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.position.trim()) {
      setError('Name and position are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editingMember) {
        await dbOperations.update('organization_members', editingMember.id, {
          ...formData,
          updated_at: new Date().toISOString()
        });
      } else {
        await dbOperations.insert('organization_members', {
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      await fetchMembers();
      setShowForm(false);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save member';
      setError(`Save failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    try {
      await dbOperations.delete('organization_members', id, true); // soft delete
      await fetchMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete member');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError(null); // Clear error when user starts typing
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order_index' ? parseInt(value) || 0 : value
    }));
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      photo_url: url
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Structure</h1>
          <p className="text-gray-600">Manage staff members and organizational hierarchy</p>
        </div>
        <button
          onClick={handleCreateMember}
          className="flex items-center gap-2 px-4 py-2 bg-[#0f4c81] text-white rounded-lg hover:bg-[#0375e5] transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && members.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-[#0375e5] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Loading members...</p>
          </div>
        ) : (
          members.map((member) => (
            <Card key={member.id} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.photo_url || 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#0f4c81] text-lg mb-1">{member.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{member.position}</p>
                  <p className="text-gray-500 text-xs mb-3">{member.department}</p>
                  
                  {member.bio && (
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">{member.bio}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Order: {member.order_index}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="p-1 text-gray-400 hover:text-[#0375e5] transition-colors"
                        title="Edit member"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete member"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#0f4c81]">
                  {editingMember ? 'Edit Member' : 'Add New Member'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMember} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position *
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                    >
                      <option value="">Select Department</option>
                      <option value="Pimpinan">Pimpinan</option>
                      <option value="Programa">Programa</option>
                      <option value="Teknik">Teknik</option>
                      <option value="Berita">Berita</option>
                      <option value="Administrasi">Administrasi</option>
                      <option value="Keuangan">Keuangan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Index
                    </label>
                    <input
                      type="number"
                      name="order_index"
                      value={formData.order_index}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo
                  </label>
                  <ImageUpload
                    value={formData.photo_url}
                    onChange={handleImageChange}
                    maxSize={5}
                    placeholder="Upload member photo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biography
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[#0375e5] text-white rounded-md hover:bg-[#0f4c81] transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="w-4 h-4" />
                        {editingMember ? 'Update' : 'Save'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};