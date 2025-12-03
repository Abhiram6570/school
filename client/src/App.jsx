import { useState } from 'react'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    
    // Simple validation
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true)
    } else {
      alert('Wrong credentials. Try admin/admin123')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
  }

  return (
    <div className="app">
      {isLoggedIn ? (
        // Dashboard after login
        <div className="dashboard">
          <h1>Welcome to Dashboard</h1>
          <p>You are logged in as: {username}</p>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      ) : (
        // Login form
        <div className="login-box">
          <h2>School Login</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <div className="input-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          <div className="demo-credentials">
            <p>Demo: admin / admin123</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App