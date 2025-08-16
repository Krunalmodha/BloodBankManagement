import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

export const useAdminData = (endpoint, initialData = {}) => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedOpt, setSelectedOpt] = useState("name");
  const [status, setStatus] = useState("normal");
  const [selectedId, setSelectedId] = useState(null);
  const [updatedData, setUpdatedData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [endpoint]);

  // Update form data when selectedId changes
  useEffect(() => {
    if (selectedId) {
      const selectedItem = data.find(item => item.id == selectedId);
      if (selectedItem) {
        setUpdatedData(selectedItem);
      }
    }
  }, [selectedId, data]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setFilter(e.target.value);
  };

  // Handle filter option change
  const handleInputChange = (e) => {
    setSelectedOpt(e.target.value);
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${endpoint}/delete/${id}`);
      setData(data.filter(item => item.id !== id));
    } catch (err) {
      console.error(`Error deleting item:`, err);
      setError('Failed to delete item');
    }
  };

  // Handle update action
  const handleUpdate = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/${endpoint}/update/${id}`, { updatedData });
      setData(data.map(item => 
        item.id === id ? { ...item, ...updatedData } : item
      ));
      setStatus("normal");
    } catch (err) {
      console.error(`Error updating item:`, err);
      setError('Failed to update item');
    }
  };

  // Filter data based on search input
  const filterData = (items) => {
    if (!filter) return items;
    
    const searchTerm = filter.toLowerCase();
    return items.filter(item => {
      if (selectedOpt === "all") return true;
      if (!item[selectedOpt]) return false;
      
      const value = String(item[selectedOpt]).toLowerCase();
      return value.includes(searchTerm);
    });
  };

  return {
    data: filterData(data),
    loading,
    error,
    filter,
    selectedOpt,
    status,
    selectedId,
    updatedData,
    setStatus,
    setSelectedId,
    setUpdatedData,
    handleSearchChange,
    handleInputChange,
    handleDelete,
    handleUpdate,
    refetch: fetchData
  };
};
