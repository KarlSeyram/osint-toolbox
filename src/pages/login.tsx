return (
  <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
    <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Login</h1>
      <p className="text-gray-500 mb-6">Welcome back to OSINT</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Login
      </button>

      <p className="mt-4 text-sm text-gray-600">
        Don’t have an account?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Register
        </a>
      </p>
    </div>

    {/* ✅ Footer */}
    <p className="mt-6 text-sm text-gray-400 text-center">
      © 2025 Karl Software. All rights reserved.
    </p>
  </div>
);
