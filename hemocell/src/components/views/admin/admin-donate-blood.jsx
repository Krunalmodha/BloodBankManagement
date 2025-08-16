import React from 'react';
import { useAdminData } from '../../../hooks/useAdminData';
import HeaderStats from '../../sections/header-stats/header_stats';
import DisplayTableComponent from '../../sections/display-table/display-table-component';
import FilterableComponent from '../../sections/filterable/filterable-component';
import { ENDPOINTS, TABLE_HEADERS, FILTER_OPTIONS } from '../../../config/apiConfig';

export default function AdminDonateBlood() {
  const {
    data,
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
  } = useAdminData(ENDPOINTS.DONATE_BLOOD, {
    name: '',
    email: '',
    phone: '',
    bloodType: '',
    message: '',
    donated: false
  });

  // Handle the donated status toggle
  const handleDonatedChange = async (id) => {
    try {
      const item = data.find(item => item.id === id);
      const newStatus = !item.donated;
      
      await fetch(`http://localhost:3001/api/donate-blood/donated`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, id })
      });
      
      // Update local state
      setData(prevData => 
        prevData.map(item => 
          item.id === id ? { ...item, donated: newStatus } : item
        )
      );
    } catch (err) {
      console.error('Error updating donation status:', err);
    }
  };

  // Handle update click
  const handleUpdateClick = (id) => {
    handleUpdate(id);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <HeaderStats heading="Blood Donating Users" />
      <div className="bg-white p-10 m-10 -mt-20 rounded-rsm">
        <FilterableComponent
          filter={filter}
          handleSearchChange={handleSearchChange}
          optionsData={FILTER_OPTIONS.DONATE_BLOOD}
          selectedOpt={selectedOpt}
          handleInputChange={handleInputChange}
        />

        <div className="overflow-x-scroll">
          <DisplayTableComponent
            tableHeader={TABLE_HEADERS.DONATE_BLOOD}
            data={data}
            filter={filter}
            selectedOpt={selectedOpt}
            handleCheckboxChange={handleDonatedChange}
            type="donate-blood"
            handleUpdateClick={handleUpdateClick}
            handleDelete={handleDelete}
            status={status}
            setStatus={setStatus}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            updatedData={updatedData}
            setUpdatedData={setUpdatedData}
          />
        </div>
      </div>
    </>
  );
}
