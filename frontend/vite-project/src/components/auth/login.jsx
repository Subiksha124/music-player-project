import React, { useState } from "react";
import Input from "../common/input";
import validator from "validator";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  clearError,
  setError,
  setLoading,
  setUser,
} from "../../redux/slices/authSlice";
import { closeAuthModal, switchAuthMode } from "../../redux/slices/uiSlice";
import "../../css/auth/Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const { authMode } = useSelector((state) => state.ui);

  const isForgot = authMode === "forgot";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!validator.isEmail(email)) {
      dispatch(setError("Please enter a valid email address"));
      return;
    }

    if (!password) {
      dispatch(setError("Please enter your password"));
      return;
    }

    dispatch(setLoading(true));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const data = res.data || {};

      dispatch(
        setUser({
          user: data.user,
          token: data.token,
        })
      );

      localStorage.setItem("token", data.token);
      dispatch(closeAuthModal());
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error;

      dispatch(setError(serverMessage || "Login Failed"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleForgotPassword = async () => {
    if (!validator.isEmail(forgotEmail)) {
      setForgotMsg("Please enter a valid email");
      return;
    }

    try {
      setForgotMsg("Sending reset link...");
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/forgot-password`,
        { email: forgotEmail }
      );
      setForgotMsg("Reset link sent! Check your email 📩");
    } catch (error) {
      setForgotMsg(
        error?.response?.data?.message ||
          "Failed to send the reset email."
      );
    }
  };

  return (
    <div className="login-wrapper">
      <h3 className="login-title">Welcome Back</h3>
      <p className="login-subtitle">Please enter your details to login</p>

      {!isForgot ? (
        <form className="login-form" onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            placeholder="johndoe@email.com"
            type="email"
          />

          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Min 8 character"
            type="password"
          />

          <div className="forgot-wrapper">
            <span
              className="forgot-link"
              onClick={() => {
                dispatch(clearError());
                dispatch(switchAuthMode("forgot"));
              }}
            >
              Forgot Password?
            </span>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      ) : (
        <div className="forgot-box">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your registered email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />

          {forgotMsg && <p className="forgot-msg">{forgotMsg}</p>}

          <button
            className="login-submit-btn"
            onClick={handleForgotPassword}
          >
            Send Reset Link
          </button>

          <span
            className="forgot-link"
            onClick={() => {
              setForgotMsg("");
              dispatch(clearError());
              dispatch(switchAuthMode("login"));
            }}
          >
            Back to Login
          </span>
        </div>
      )}
    </div>
  );
};

export default Login;
