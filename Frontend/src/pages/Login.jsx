import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Button, Card, Spacer } from "@nextui-org/react";
import { FaGoogle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${baseUrl}/api/v1/auth/login`, { email, password })
      .then((res) => {
        setError("");
        setMsg(res.data.message);

        navigate("/auth/verifyOtp", { state: { email } });
      })
      .catch((err) => {
        setLoading(false);
        setMsg("");
        if (err.response || err.response.status === 409) {
          setError(err.response.data.message);
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      });
  };

  const googleAuth = () => {
    window.open(`http://localhost:4000/auth/google/callback`, "_self");
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#dde9f1",
      }}
    >
      <Card className="max-w-[500px] w-[80%] p-10 bg-gray-100 backdrop-blur-[15px] shadow-2xl  mx-auto border-none rounded-2xl mt-6">
        <h2 className="text-5xl font-extrabold text-center text-transparent bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 bg-clip-text ">
          Login
        </h2>

        {msg && <p style={{ color: "green", textAlign: "center" }}>{msg}</p>}
        <Spacer y={1} />
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <form onSubmit={handleLogin}>
          <Spacer y={2} />
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            bordered
            color="primary"
            required
          />
          <Spacer y={2} />
          <Input
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            bordered
            color="primary"
            required
          />
          <Spacer y={2} />
          <Button type="submit" fullWidth disabled={loading} color="primary">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <Spacer y={1} />
        <p style={{ textAlign: "center", color: "#888" }}>or</p>
        <Spacer y={0.5} />

        <Button
          onClick={googleAuth}
          fullWidth
          color="error"
          className="flex items-center justify-center space-x-3 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <FaGoogle />
          <span>Login with Google</span>
        </Button>
      </Card>
    </div>
  );
};

export default Login;
