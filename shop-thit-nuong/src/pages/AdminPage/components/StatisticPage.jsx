import React, { useState, useMemo } from 'react'
import { Select, Button, Table, DatePicker } from 'antd'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import * as OrderService from '../../../services/OrderService'

const { Option } = Select

const StatisticPage = () => {
  const user = useSelector((state) => state?.user)
  const [filterType, setFilterType] = useState('day')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  const { data: ordersData } = useQuery({
    queryKey: ['orders-statistic'],
    queryFn: async () => {
      const res = await OrderService.getAllOrder(user?.access_token)
      return res?.data || []
    }
  })

  const orders = Array.isArray(ordersData) ? ordersData : []

  // Lọc và nhóm dữ liệu theo filterType
  const chartData = useMemo(() => {
    const grouped = {}

    orders.forEach((order) => {
      const date = new Date(order.createdAt)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.toISOString().split('T')[0]

      let key = ''
      if (filterType === 'day' && year === selectedYear && month === selectedMonth) {
        key = day
      } else if (filterType === 'month' && year === selectedYear) {
        key = `${year}-${String(month).padStart(2, '0')}`
      } else if (filterType === 'year') {
        key = `${year}`
      }

      if (!key) return

      if (!grouped[key]) {
        grouped[key] = { time: key, revenue: 0, orders: 0, orderList: [] }
      }
      grouped[key].revenue += order.totalPrice || 0
      grouped[key].orders += 1
      grouped[key].orderList.push(order)
    })

    return Object.values(grouped).sort((a, b) => a.time.localeCompare(b.time))
  }, [orders, filterType, selectedYear, selectedMonth])

  const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0)
  const totalOrders = chartData.reduce((sum, d) => sum + d.orders, 0)

  const formatVND = (value) => new Intl.NumberFormat('vi-VN').format(value) + ' đ'

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      render: (text) => <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{text}</span>
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (val) => <span style={{ color: '#e53935', fontWeight: 700 }}>{formatVND(val)}</span>
    },
    {
      title: 'Số đơn',
      dataIndex: 'orders',
      key: 'orders',
      render: (val) => (
        <span style={{
          background: '#e8f5e9', color: '#2e7d32',
          borderRadius: 20, padding: '2px 12px', fontWeight: 600
        }}>
          {val}
        </span>
      )
    },
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <div style={{ padding: '24px', background: '#f7f8fc', minHeight: '100vh' }}>

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{
          width: 4, height: 28,
          background: 'linear-gradient(180deg, #e53935, #ff7043)',
          borderRadius: 4
        }} />
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>
          Thống kê doanh thu
        </h2>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{
          flex: 1, background: 'linear-gradient(135deg, #e53935, #ff7043)',
          borderRadius: 16, padding: '20px 24px',
          boxShadow: '0 4px 16px rgba(229,57,53,0.25)'
        }}>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 8 }}>
            Tổng doanh thu
          </div>
          <div style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>
            {formatVND(totalRevenue)}
          </div>
        </div>
        <div style={{
          flex: 1, background: 'linear-gradient(135deg, #11998e, #38ef7d)',
          borderRadius: 16, padding: '20px 24px',
          boxShadow: '0 4px 16px rgba(17,153,142,0.25)'
        }}>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 8 }}>
            Tổng đơn hàng
          </div>
          <div style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>
            {totalOrders} đơn
          </div>
        </div>
        <div style={{
          flex: 1, background: 'linear-gradient(135deg, #f7971e, #ffd200)',
          borderRadius: 16, padding: '20px 24px',
          boxShadow: '0 4px 16px rgba(247,151,30,0.25)'
        }}>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 8 }}>
            Trung bình / đơn
          </div>
          <div style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>
            {totalOrders ? formatVND(Math.round(totalRevenue / totalOrders)) : '0 đ'}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: '16px 20px',
        marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center',
        border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <Select value={filterType} onChange={setFilterType} style={{ width: 130 }}>
          <Option value="day">Theo ngày</Option>
          <Option value="month">Theo tháng</Option>
          <Option value="year">Theo năm</Option>
        </Select>

        <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 100 }}>
          {years.map(y => <Option key={y} value={y}>{y}</Option>)}
        </Select>

        {filterType === 'day' && (
          <Select value={selectedMonth} onChange={setSelectedMonth} style={{ width: 120 }}>
            {months.map(m => <Option key={m} value={m}>Tháng {m}</Option>)}
          </Select>
        )}

        <div style={{ color: '#888', fontSize: 13, marginLeft: 'auto' }}>
          Hiển thị <strong>{chartData.length}</strong> kết quả
        </div>
      </div>

      {/* Chart */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: '24px 20px',
        marginBottom: 20, border: '1px solid #f0f0f0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>
          Biểu đồ doanh thu
        </h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12, fill: '#888' }}
                axisLine={{ stroke: '#f0f0f0' }}
              />
              <YAxis
                tickFormatter={(v) => new Intl.NumberFormat('vi-VN').format(v)}
                tick={{ fontSize: 11, fill: '#888' }}
                axisLine={{ stroke: '#f0f0f0' }}
              />
              <Tooltip
                formatter={(value) => [formatVND(value), 'Doanh thu']}
                contentStyle={{ borderRadius: 10, border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar
                dataKey="revenue"
                name="Doanh thu"
                fill="url(#colorRevenue)"
                radius={[6, 6, 0, 0]}
              />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e53935" />
                  <stop offset="100%" stopColor="#ff7043" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa', fontSize: 14 }}>
            Không có dữ liệu trong khoảng thời gian này
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: '20px',
        border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>
          Chi tiết theo thời gian
        </h3>
        <Table
          columns={columns}
          dataSource={chartData.map((d, i) => ({ ...d, key: i }))}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </div>

    </div>
  )
}

export default StatisticPage