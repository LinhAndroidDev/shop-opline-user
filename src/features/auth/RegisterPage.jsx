import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // TODO: Implement actual register API call
      console.log('Register values:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      message.error('Đăng ký thất bại. Vui lòng thử lại.');
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
                  Đăng ký
                </h2>
                <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                  Tạo tài khoản mới để bắt đầu mua sắm
                </p>
              </div>

              {/* Form */}
              <div className="card-body p-4 p-md-5">
                <Form
                  name="register"
                  onFinish={onFinish}
                  layout="vertical"
                  size="large"
                  autoComplete="off"
                >
                  <Form.Item
                    name="fullName"
                    rules={[
                      { required: true, message: 'Vui lòng nhập họ tên!' },
                      { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className="text-muted" />}
                      placeholder="Họ và tên"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>

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
                    name="phone"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số điện thoại!' },
                      { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined className="text-muted" />}
                      placeholder="Số điện thoại"
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

                  <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-muted" />}
                      placeholder="Xác nhận mật khẩu"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="agree"
                    valuePropName="checked"
                    rules={[
                      {
                        validator: (_, value) =>
                          value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý với điều khoản!')),
                      },
                    ]}
                  >
                    <div className="d-flex align-items-start">
                      <input type="checkbox" className="form-check-input mt-1 me-2" id="agree" />
                      <label htmlFor="agree" className="form-check-label small text-muted" style={{ cursor: 'pointer' }}>
                        Tôi đồng ý với{' '}
                        <Link to="/terms" className="text-decoration-none" style={{ color: 'var(--primary)' }}>
                          Điều khoản sử dụng
                        </Link>
                        {' '}và{' '}
                        <Link to="/privacy" className="text-decoration-none" style={{ color: 'var(--primary)' }}>
                          Chính sách bảo mật
                        </Link>
                      </label>
                    </div>
                  </Form.Item>

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
                      Đăng ký
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

                {/* Social Register */}
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
                    <span>Đăng ký với Google</span>
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
                    <span>Đăng ký với Facebook</span>
                  </Button>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <span className="text-muted">Đã có tài khoản? </span>
                  <Link to="/login" className="text-decoration-none fw-bold" style={{ color: 'var(--primary)' }}>
                    Đăng nhập ngay
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

export default RegisterPage;

