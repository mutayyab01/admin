import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CryptoJS from 'crypto-js';

const SignUpLayer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    termsAccepted: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let merchantResponse = null;

    try {
      // Hash the password using SHA256
      const hashedPassword = CryptoJS.SHA256(formData.password).toString();

      merchantResponse = await axios.post(`${API_URL}/merchants/createMerchantWithEmailOnly`, {
        email: formData.email
      });

      if (!merchantResponse.data.newMerchant) {
        throw new Error('Failed to create merchant');
      }

      // Then create user admin with hashed password
      const userAdminResponse = await axios.post(`${API_URL}/userAdmins/`, {
        Username: formData.username,
        Password: hashedPassword,
        Category: "merchant",
        MerchantID: merchantResponse.data.newMerchant
      });

      if (userAdminResponse.data) {
        navigate('/dashboard'); // Redirect to dashboard after successful signup
      }
    } catch (err) {
      if (err.response?.data?.error === 'DUPLICATE_EMAIL') {
        setError('This email is already registered. Please use a different email or sign in.');
      } else if (err.response?.data?.error === 'DUPLICATE_USERNAME') {
        // Delete the merchant if username is duplicate
        if (merchantResponse?.data?.newMerchant) {
          await axios.delete(`${API_URL}/merchants/${merchantResponse.data.newMerchant}`);
        }
        setError('This username is already taken. Please choose a different username.');
      } else {
        setError(
          err.response?.data?.message || 
          err.response?.data?.error || 
          'An error occurred during signup. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='auth bg-base d-flex flex-wrap'>
      <div className='auth-left d-lg-block d-none'>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
          <img src='assets/images/auth/auth-img.png' alt='' />
        </div>
      </div>
      <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
        <div className='max-w-464-px mx-auto w-100'>
          <div>
            <Link to='/' className='mb-40 max-w-290-px'>
              <img src='assets/images/logo.png' alt='' />
            </Link>
            <h4 className='mb-12'>Sign Up to your Account</h4>
            <p className='mb-32 text-secondary-light text-lg'>
              Welcome back! please enter your detail
            </p>
          </div>
          {error && (
            <div className="alert alert-danger mb-3" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='f7:person' />
              </span>
              <input
                type='text'
                name="username"
                value={formData.username}
                onChange={handleChange}
                className='form-control h-56-px bg-neutral-50 radius-12'
                placeholder='Username'
                required
              />
            </div>
            <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='mage:email' />
              </span>
              <input
                type='email'
                name="email"
                value={formData.email}
                onChange={handleChange}
                className='form-control h-56-px bg-neutral-50 radius-12'
                placeholder='Email'
                required
              />
            </div>
            <div className='mb-20'>
              <div className='position-relative '>
                <div className='icon-field'>
                  <span className='icon top-50 translate-middle-y'>
                    <Icon icon='solar:lock-password-outline' />
                  </span>
                  <input
                    type='password'
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className='form-control h-56-px bg-neutral-50 radius-12'
                    id='your-password'
                    placeholder='Password'
                    required
                    minLength={8}
                  />
                </div>
                <span
                  className='toggle-password ri-eye-line cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light'
                  data-toggle='#your-password'
                />
              </div>
              <span className='mt-12 text-sm text-secondary-light'>
                Your password must have at least 8 characters
              </span>
            </div>
            <div className=''>
              <div className='d-flex justify-content-between gap-2'>
                <div className='form-check style-check d-flex align-items-start'>
                  <input
                    className='form-check-input border border-neutral-300 mt-4'
                    type='checkbox'
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    id='condition'
                    required
                  />
                  <label
                    className='form-check-label text-sm'
                    htmlFor='condition'
                  >
                    By creating an account means you agree to the
                    <Link to='#' className='text-primary-600 fw-semibold'>
                      Terms &amp; Conditions
                    </Link>{" "}
                    and our
                    <Link to='#' className='text-primary-600 fw-semibold'>
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
            </div>
            <button
              type='submit'
              className='btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32'
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            <div className='mt-32 center-border-horizontal text-center'>
              <span className='bg-base z-1 px-4'>Or sign up with</span>
            </div>
            <div className='mt-32 d-flex align-items-center gap-3'>
              <button
                type='button'
                className='fw-semibold text-primary-light py-16 px-24 w-50 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50'
              >
                <Icon
                  icon='ic:baseline-facebook'
                  className='text-primary-600 text-xl line-height-1'
                />
                Google
              </button>
              <button
                type='button'
                className='fw-semibold text-primary-light py-16 px-24 w-50 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50'
              >
                <Icon
                  icon='logos:google-icon'
                  className='text-primary-600 text-xl line-height-1'
                />
                Google
              </button>
            </div>
            <div className='mt-32 text-center text-sm'>
              <p className='mb-0'>
                Already have an account?{" "}
                <Link to='/sign-in' className='text-primary-600 fw-semibold'>
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUpLayer;
