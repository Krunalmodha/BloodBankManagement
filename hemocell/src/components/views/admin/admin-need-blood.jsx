import React from 'react';
import { useAdminData } from '../../../hooks/useAdminData';
import HeaderStats from '../../sections/header-stats/header_stats';
import DisplayTableComponent from '../../sections/display-table/display-table-component';
import FilterableComponent from '../../sections/filterable/filterable-component';
import { ENDPOINTS, TABLE_HEADERS, FILTER_OPTIONS } from '../../../config/apiConfig';

export default function AdminNeedBlood() {
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
  } = useAdminData(ENDPOINTS.NEED_BLOOD, {
    name: '',
    phone: '',
    bloodType: '',
    message: ''
  });

  // Handle update click
  const handleUpdateClick = (id) => {
    handleUpdate(id);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <HeaderStats heading="Blood Request Users" />
      <div className="bg-white p-10 m-10 -mt-20 rounded-rsm">
        <FilterableComponent
          filter={filter}
          handleSearchChange={handleSearchChange}
          optionsData={FILTER_OPTIONS.NEED_BLOOD}
          selectedOpt={selectedOpt}
          handleInputChange={handleInputChange}
        />

        <div className="overflow-x-scroll">
          <DisplayTableComponent
            tableHeader={TABLE_HEADERS.NEED_BLOOD}
            data={data}
            filter={filter}
            selectedOpt={selectedOpt}
            type="need-blood"
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
