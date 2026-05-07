import { Table } from 'antd';
import React, { useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { Excel } from "antd-table-saveas-excel";
import { useMemo } from 'react';

const TableComponent = (props) => {
  const { selectionType = 'checkbox', data:dataSource = [], isLoading = false, columns = [], handleDelteMany } = props
  const [rowSelectedKeys, setRowSelectedKeys] = useState([])
  const newColumnExport = useMemo(() => {
    const arr = columns?.filter((col) => col.dataIndex !== 'action')
    return arr
  }, [columns])
  
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys)
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === 'Disabled User',
    //   // Column configuration not to be checked
    //   name: record.name,
    // }),
  };
  const handleDeleteAll = () => {
  if (typeof handleDelteMany === 'function') {
    handleDelteMany(rowSelectedKeys)
  }
}
const exportExcel = () => {
  const excel = new Excel();

  const exportColumns = newColumnExport.map((col) => ({
    ...col,
    render: undefined
  }))

  const exportData = dataSource.map((row) => {
    const cleanRow = {}
    exportColumns.forEach((col) => {
      const val = row[col.dataIndex]
      cleanRow[col.dataIndex] = val === null || val === undefined ? '' : String(val)
    })
    return cleanRow
  })

  excel
    .addSheet("Sheet1")
    .addColumns(exportColumns)
    .addDataSource(exportData, { str2Percent: true })
    .saveAs("Excel.xlsx")
}
  
  return (
  <Loading isLoading={isLoading}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
      {!!rowSelectedKeys.length && handleDelteMany && (
        <div
          onClick={handleDeleteAll}
          style={{
            background: 'linear-gradient(135deg, #e53935, #ff7043)',
            color: '#fff',
            fontWeight: '700',
            fontSize: '13px',
            padding: '8px 18px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(229,57,53,0.25)',
          }}
        >
          🗑 Xóa tất cả ({rowSelectedKeys.length})
        </div>
      )}
      <button
        onClick={exportExcel}
        style={{
          background: '#fff',
          color: '#1a1a2e',
          fontWeight: '600',
          fontSize: '13px',
          padding: '8px 18px',
          borderRadius: '10px',
          border: '1px solid #e0e0e0',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
        }}
      >
        📥 Export Excel
      </button>
    </div>
    <Table
      rowSelection={{
        type: selectionType,
        ...rowSelection,
      }}
      columns={columns}
      dataSource={dataSource}
      {...props}
    />
  </Loading>
)
}

export default TableComponent