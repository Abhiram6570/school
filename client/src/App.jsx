import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import axios from 'axios'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [user, setUser] = useState(null)
  
  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    email: ''
  })
  
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      const response = await axios.post('/api/login', loginData)
      
      if (response.data.success) {
        setUser(response.data.user)
        setIsLoggedIn(true)
        setMessage('Login successful!')
        setIsError(false)
      } else {
        setMessage(response.data.message)
        setIsError(true)
      }
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Server error. Please try again.')
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      const response = await axios.post('/api/register', registerData)
      
      if (response.data.success) {
        setMessage('Registration successful! You can now login.')
        setIsError(false)
        
        // Clear form and switch to login
        setRegisterData({ username: '', password: '', email: '' })
        setShowRegister(false)
      } else {
        setMessage(response.data.message)
        setIsError(true)
      }
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed. Please try again.')
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setLoginData({ username: '', password: '' })
    setMessage('Logged out successfully')
    setIsError(false)
  }

  // Toggle between login and register
  const toggleForm = () => {
    setShowRegister(!showRegister)
    setMessage('')
    setIsError(false)
  }

  // If logged in, show dashboard
  if (isLoggedIn) {
    return (
      <div className="app">
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow">
                <div className="card-header bg-success text-white">
                  <h3 className="text-center mb-0">🏫 School Dashboard</h3>
                </div>
                <div className="card-body text-center">
                  <div className="mb-4">
                    <div className="display-4 mb-3">🎓</div>
                    <h4>Welcome, {user?.username}!</h4>
                    <p className="text-muted">{user?.email}</p>
                  </div>
                  
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5>Student Information</h5>
                      <p><strong>Role:</strong> Student</p>
                      <p><strong>Class:</strong> 10th Grade</p>
                      <p><strong>Roll No:</strong> 2024001</p>
                    </div>
                  </div>
                  
                  <button onClick={handleLogout} className="btn btn-danger btn-lg">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show login or register form
  return (
    <div className="app">
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h3 className="text-center mb-0">
                  {showRegister ? '📝 Student Registration' : '🏫 School Login'}
                </h3>
              </div>
              
              <div className="card-body">
                {/* Message alert */}
                {message && (
                  <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}>
                    {message}
                  </div>
                )}
                
                {/* Register Form */}
                {showRegister ? (
                  <form onSubmit={handleRegister}>
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        placeholder="Create a password"
                        required
                      />
                    </div>
                    
                    <div className="d-grid gap-2">
                      <button 
                        type="submit" 
                        className="btn btn-success"
                        disabled={loading}
                      >
                        {loading ? 'Registering...' : 'Register'}
                      </button>
                      
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={toggleForm}
                      >
                        Already have an account? Login
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Login Form */
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label className="form-label">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        value={loginData.username}
                        onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                        placeholder="Enter username"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        placeholder="Enter password"
                        required
                      />
                    </div>
                    
                    <div className="d-grid gap-2 mb-3">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? 'Logging in...' : 'Login'}
                      </button>
                      
                      <button 
                        type="button" 
                        className="btn btn-outline-success"
                        onClick={toggleForm}
                      >
                        Create New Account
                      </button>
                    </div>
                    
                    <div className="text-center text-muted">
                      <small>Demo: admin/admin123 | student/student123</small>
                    </div>
                  </form>
                )}
              </div>
              
              <div className="card-footer text-center">
                <small className="text-muted">
                  School Management System © 2024
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App