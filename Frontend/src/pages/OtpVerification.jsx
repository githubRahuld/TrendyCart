import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { loginUser } from "../store/authSlice.js";
import { Button, Card, Spacer, Input } from "@nextui-org/react";

const OtpVerification = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const email = location.state?.email || "";

  // Refs for each input
  const inputRefs = useRef([]);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${baseUrl}/api/v1/auth/verifyOtp`, { email, otp })
      .then((res) => {
        setError("");

        const { accessToken, refreshToken } = res.data.data;

        // Set Cookies
        Cookies.set("accessToken", accessToken, {
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("refreshToken", refreshToken, {
          secure: true,
          sameSite: "strict",
        });

        const userData = res.data.data;
        dispatch(loginUser({ userData }));

        setLoading(false);
        navigate("/users/home");
      })
      .catch((err) => {
        setLoading(false);

        if (err.response) {
          if (err.response.status === 409) {
            setError(err.response.data.message);
          } else {
            setError(
              "An error occurred: " +
                (err.response.data.message || "Unknown error.")
            );
          }
        } else {
          setError("A network error occurred. Please try again.");
        }
      });
  };

  // Handle OTP input change
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Only accept numbers

    const newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join(""));

    // Focus the next input if the current one is filled
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace to focus previous input
  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <Card className="max-w-md w-full p-8 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-white/30 mx-auto">
        <h2 className="text-2xl text-center font-bold font-poppins text-gray-900 mb-6">
          OTP Verification
        </h2>

        <form onSubmit={handleOtpSubmit}>
          <Spacer y={2} />
          <Input
            label="Email Address"
            value={email}
            readOnly
            fullWidth
            bordered
            color="primary"
            className="text-lg mb-4 "
          />
          <Spacer y={2} />

          {/* OTP Inputs */}
          <div className="flex justify-center space-x-4 mb-6">
            {[...Array(6)].map((_, index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                value={otp[index] || ""}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyUp={(e) => handleBackspace(e, index)} // Handle backspace
                bordered
                color="primary"
                ref={(el) => (inputRefs.current[index] = el)}
                css={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  fontSize: "1.5rem",
                  textAlign: "center",
                  border: "2px solid black",
                }}
                className="mb-4"
              />
            ))}
          </div>

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            color="primary"
            className="text-xl mb-4"
            css={{
              padding: "12px 0",
              "&:hover": {
                backgroundColor: "#1e88e5",
              },
            }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          {error && (
            <p className="text-red-500 text-center font-semibold text-lg">
              {error}
            </p>
          )}
        </form>
      </Card>
    </div>
  );
};

export default OtpVerification;
