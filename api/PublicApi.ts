const API_BASE_URL = 'https://b2b.motionview.com.bd/api';
//const API_BASE_URL = 'http://localhost/erp_b2b/api';

const getHeaders = async () => {
  return {
    'Content-Type': 'application/json',
  };
};

// Function to handle login and return response
export const sendOtpApi = async (phone, type, check_place) => {
  try {
    const response = await fetch(`${API_BASE_URL}/send-otp-phone`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({phone, type, check_place}),
    });

    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (data?.success) {
      return {success: true, data: data?.data};
    } else {
      return {success: false, error: data?.message};
    }
  } catch (error) {
    console.error('Login failed:', error);
    return {success: false, error: error};
  }
};

export const verifyOtpApi = async (medium, otp, type, check_place) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({medium, otp, type, check_place}),
    });

    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (data?.success) {
      return {success: true, data: data?.data};
    } else {
      return {success: false, error: data?.message};
    }
  } catch (error) {
    console.error('Login failed:', error);
    return {success: false, error: error};
  }
};

export const resetPasswordApi = async (
  phone,
  password,
  confirm_password,
  type,
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reset-password-phone`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({phone, password, confirm_password, type}),
    });

    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (data?.success) {
      return {success: true, data: data?.data};
    } else {
      return {success: false, error: data?.message};
    }
  } catch (error) {
    console.error('Login failed:', error);
    return {success: false, error: error};
  }
};
