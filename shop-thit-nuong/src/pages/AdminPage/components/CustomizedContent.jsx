import { UserOutlined, AppstoreOutlined, ShoppingCartOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons'

const LABELS = {
  users: 'Người dùng',
  products: 'Sản phẩm',
  orders: 'Đơn hàng',
  revenue: 'Doanh thu',
  paid: 'Đã thanh toán',
}

const ICONS = {
  users: <UserOutlined />,
  products: <AppstoreOutlined />,
  orders: <ShoppingCartOutlined />,
  revenue: <DollarOutlined />,
  paid: <CheckCircleOutlined />,
}

const COLORS = {
  users: ['#e66465', '#9198e5'],
  products: ['#a8c0ff', '#3f2b96'],
  orders: ['#11998e', '#38ef7d'],
  revenue: ['#f7971e', '#ffd200'],
  paid: ['#56ab2f', '#a8e063'],
}

const CLICKABLE = ['users', 'products', 'orders']

const CustomizedContent = (props) => {
  const { data, setKeySelected } = props

  const formatValue = (key, value) => {
    if (key === 'revenue') {
      return new Intl.NumberFormat('vi-VN').format(value) + ' đ'
    }
    return value
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      justifyContent: 'center',
      padding: '30px 20px'
    }}>
      {Object.keys(data).map((item) => (
        <div
          key={item}
          onClick={() => CLICKABLE.includes(item) && setKeySelected(item)}
          style={{
            width: 220,
            background: `linear-gradient(135deg, ${COLORS[item]?.[0]}, ${COLORS[item]?.[1]})`,
            height: 140,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            borderRadius: '16px',
            cursor: CLICKABLE.includes(item) ? 'pointer' : 'default',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 30 }}>
            {ICONS[item]}
          </span>
          <span style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>
            {formatValue(item, data[item])}
          </span>
          <span style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 12,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.8px'
          }}>
            {LABELS[item]}
          </span>
        </div>
      ))}
    </div>
  )
}

export default CustomizedContent