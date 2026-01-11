import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // TODO: Implement actual login API call
      console.log('Login values:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      message.error('Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ 
      background: 'linear-gradient(135deg, var(--primary-gradient-light-start) 0%, var(--primary-gradient-light-end) 100%)',
      padding: '2rem 0'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-lg border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              {/* Header */}
              <div className="card-header bg-white border-0 text-center py-4">
                <div className="mb-3">
                  <div 
                    className="mx-auto d-flex align-items-center justify-content-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary-gradient-start) 0%, var(--primary-gradient-end) 100%)',
                      boxShadow: '0 4px 15px rgba(251, 146, 60, 0.3)'
                    }}
                  >
                    <UserOutlined style={{ fontSize: '2rem', color: '#fff' }} />
                  </div>
                </div>
                <h2 className="mb-2" style={{ fontSize: '1.75rem', fontWeight: 600, color: '#111827' }}>
                  Đăng nhập
                </h2>
                <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                  Chào mừng bạn trở lại!
                </p>
              </div>

              {/* Form */}
              <div className="card-body p-4 p-md-5">
                <Form
                  name="login"
                  onFinish={onFinish}
                  layout="vertical"
                  size="large"
                  autoComplete="off"
                >
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email!' },
                      { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="text-muted" />}
                      placeholder="Email"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu!' },
                      { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-muted" />}
                      placeholder="Mật khẩu"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Item name="remember" valuePropName="checked" className="mb-0">
                      <input type="checkbox" className="form-check-input me-2" id="remember" />
                      <label htmlFor="remember" className="form-check-label small text-muted" style={{ cursor: 'pointer' }}>
                        Ghi nhớ đăng nhập
                      </label>
                    </Form.Item>
                    <Link to="/forgot-password" className="text-decoration-none small" style={{ color: 'var(--primary)' }}>
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <Form.Item className="mb-4">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      style={{
                        height: '48px',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, var(--primary-gradient-start) 0%, var(--primary-gradient-end) 100%)',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(251, 146, 60, 0.3)'
                      }}
                    >
                      Đăng nhập
                    </Button>
                  </Form.Item>
                </Form>

                {/* Divider */}
                <div className="text-center mb-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 border-top"></div>
                    <span className="px-3 text-muted small">hoặc</span>
                    <div className="flex-grow-1 border-top"></div>
                  </div>
                </div>

                {/* Social Login */}
                <div className="d-grid gap-2 mb-4">
                  <Button
                    block
                    style={{
                      height: '48px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className="fab fa-google text-danger"></i>
                    <span>Đăng nhập với Google</span>
                  </Button>
                  <Button
                    block
                    style={{
                      height: '48px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className="fab fa-facebook text-primary"></i>
                    <span>Đăng nhập với Facebook</span>
                  </Button>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <span className="text-muted">Chưa có tài khoản? </span>
                  <Link to="/register" className="text-decoration-none fw-bold" style={{ color: 'var(--primary)' }}>
                    Đăng ký ngay
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

