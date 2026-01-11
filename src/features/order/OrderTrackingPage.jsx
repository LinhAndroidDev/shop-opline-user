import { useState, useEffect } from 'react';
import { useOrder } from './orderSlice';
import { Link, useParams } from 'react-router-dom';
import { Table } from 'antd';

const OrderTracking = () => {
  const { id } = useParams();
  const { orders, getOrderById, orderStatuses } = useOrder();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (id) {
      const foundOrder = getOrderById(id);
      setOrder(foundOrder);
    }
  }, [id, orders]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const statusInfo = orderStatuses[status] || { color: 'secondary' };
    return statusInfo.color;
  };

  const getStatusLabel = (status) => {
    const statusInfo = orderStatuses[status] || { label: status };
    return statusInfo.label;
  };

  const getStatusTimeline = (status) => {
    const statusOrder = ['pending', 'processing', 'delivering', 'completed'];
    const currentIndex = statusOrder.indexOf(status);
    return statusOrder.map((s, index) => ({
      status: s,
      label: getStatusLabel(s),
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  // Single order detail view
  if (id && order) {
    const timeline = getStatusTimeline(order.status);
    const columns = [
      {
        title: 'Sản phẩm',
        key: 'product',
        render: (_, item) => (
          <div className="d-flex align-items-center">
            <img
              src={item.image}
              alt={item.name}
              style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }}
              className="rounded"
            />
            <div>
              <div className="fw-bold">{item.name}</div>
              <div className="text-muted small">
                {item.variant.color && <span>Màu: {item.variant.color}</span>}
                {item.variant.size && <span className="ms-2">Size: {item.variant.size}</span>}
              </div>
            </div>
          </div>
        ),
      },
      {
        title: 'Giá',
        dataIndex: 'price',
        key: 'price',
        render: (price) => formatPrice(price),
      },
      {
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: 'Thành tiền',
        key: 'total',
        render: (_, item) => formatPrice(item.price * item.quantity),
      },
    ];

    return (
      <div className="container my-5">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Trang chủ</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/orders">Đơn hàng</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {order.id}
            </li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>Chi tiết đơn hàng
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <strong>Mã đơn hàng:</strong> {order.id}
                </div>
                <div className="mb-3">
                  <strong>Ngày đặt:</strong> {formatDate(order.date)}
                </div>
                <div className="mb-3">
                  <strong>Trạng thái:</strong>{' '}
                  <span className={`badge bg-${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <Table
                  dataSource={order.items}
                  columns={columns}
                  rowKey={(item, index) => index}
                  pagination={false}
                />

                <hr />

                <div className="d-flex justify-content-between">
                  <strong>Tổng cộng:</strong>
                  <strong className="text-primary fs-5">{formatPrice(order.total)}</strong>
                </div>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-truck me-2"></i>Thông tin giao hàng
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-2">
                  <strong>Người nhận:</strong> {order.shipping?.name}
                </div>
                <div className="mb-2">
                  <strong>Số điện thoại:</strong> {order.shipping?.phone}
                </div>
                <div className="mb-2">
                  <strong>Email:</strong> {order.shipping?.email}
                </div>
                <div className="mb-2">
                  <strong>Địa chỉ:</strong> {order.shipping?.address}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm sticky-top" style={{ top: '100px' }}>
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-clock me-2"></i>Trạng thái đơn hàng
                </h5>
              </div>
              <div className="card-body">
                {timeline.map((item, index) => (
                  <div key={item.status}>
                    <div className="d-flex align-items-start mb-2">
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
                          item.active
                            ? 'bg-primary text-white'
                            : item.completed
                            ? 'bg-success text-white'
                            : 'bg-secondary text-white'
                        }`}
                        style={{ width: '40px', height: '40px', minWidth: '40px' }}
                      >
                        {item.completed ? (
                          <i className="fas fa-check"></i>
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <div className={`fw-bold ${item.active ? 'text-primary' : ''}`}>
                          {item.label}
                        </div>
                        {item.status === order.status && (
                          <small className="text-muted">Trạng thái hiện tại</small>
                        )}
                      </div>
                    </div>
                    {index < timeline.length - 1 && (
                      <div
                        className={`ms-5 ${
                          item.completed
                            ? 'border-start border-3 border-success'
                            : 'border-start border-3 border-secondary'
                        }`}
                        style={{ height: '30px', marginLeft: '28px', marginBottom: '15px' }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Orders list view
  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Link to={`/orders/${id}`}>{id}</Link>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'date',
      key: 'date',
      render: (date) => formatDate(date),
    },
    {
      title: 'Sản phẩm',
      key: 'items',
      render: (_, order) => (
        <div>
          {order.items.map((item, index) => (
            <div key={index} className="small">
              {item.name} x {item.quantity}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total) => formatPrice(total),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`badge bg-${getStatusColor(status)}`}>
          {getStatusLabel(status)}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, order) => (
        <Link to={`/orders/${order.id}`} className="btn btn-sm btn-primary">
          Xem chi tiết
        </Link>
      ),
    },
  ];

  return (
    <div className="container my-5">
      <h2 className="mb-4">
        <i className="fas fa-clipboard-list me-2"></i>Theo dõi đơn hàng
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-clipboard-list fa-4x text-muted mb-4"></i>
          <h3>Bạn chưa có đơn hàng nào</h3>
          <p className="text-muted mb-4">Hãy mua sắm và tạo đơn hàng đầu tiên của bạn</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            <i className="fas fa-shopping-bag me-2"></i>
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body">
            <Table
              dataSource={orders}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;

