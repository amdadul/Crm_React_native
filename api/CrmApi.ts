import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://b2b.motionview.com.bd/api/brand-store';

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token && {Authorization: `Bearer ${token}`}),
  };
};

// Function to handle login and return response
export const loginApi = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({email, password}),
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

export const getTotalSalesApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sales/get-total-sales`, {
      method: 'GET',
      headers: await getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error with status: ${response.status}`);
    }

    const data = await response.json();

    if (data?.success) {
      return {success: true, data: data?.data};
    } else {
      return {success: false, error: data?.message};
    }
  } catch (error) {
    console.error('Total Sales:', error);
    return {success: false, error: error};
  }
};

export const getTotalStockApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/get-total-stock`, {
      method: 'GET',
      headers: await getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error with status: ${response.status}`);
    }

    const data = await response.json();

    if (data?.success) {
      return {success: true, data: data?.data};
    } else {
      return {success: false, error: data?.message};
    }
  } catch (error) {
    console.error('Total Stock:', error);
    return {success: false, error: error};
  }
};

export const getStockListApi = async (page, per_page = 20) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/stock/inventories?page=${page}&per_page=${per_page}`,
      {
        method: 'GET',
        headers: await getHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error(`Error with status: ${response.status}`);
    }

    const data = await response.json();
    if (data?.data.length > 0) {
      return {success: true, data};
    } else {
      return {success: false, error: data?.message};
    }
  } catch (error) {
    console.error(error);
    return {success: false, error: error};
  }
};

export const getStockUpdateListApi = async (page, per_page = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/stock/invoice-list?page=${page}&per_page=${per_page}`,
      {
        method: 'GET',
        headers: await getHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error(`Error with status: ${response.status}`);
    }

    const data = await response.json();

    if (data?.data.length > 0) {
      return {success: true, data};
    } else {
      return {success: false, error: 'Data not found!'};
    }
  } catch (error) {
    console.error(error);
    return {success: false, error: error};
  }
};

export const getSalesListApi = async (page, per_page = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/sales/invoice-list?page=${page}&per_page=${per_page}`,
      {
        method: 'GET',
        headers: await getHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error(`Error with status: ${response.status}`);
    }

    const data = await response.json();
    if (data?.data.length > 0) {
      return {success: true, data};
    } else {
      return {success: false, error: data?.message};
    }
  } catch (error) {
    console.error(error);
    return {success: false, error: error};
  }
};

export const stockUpdateCreateApi = async formData => {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/update`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error(`Error with status: ${response.status}`);
    }

    const data = await response.json();
    if (data?.length > 0) {
      return {success: true, data};
    } else {
      return {success: false, error: data?.message};
    }
  } catch (error) {
    console.error(error);
    return {success: false, error: error};
  }
};

export const serialNoVerifyApi = async formData => {
  try {
    const response = await fetch(`${API_BASE_URL}/sales/serial_no_verify`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error(`Error with status: ${response.status}`);
    }

    const data = await response.json();
    if (data?.data?.length > 0) {
      return {success: true, data: data?.data};
    } else {
      return {success: false, error: data?.message};
    }
  } catch (error) {
    console.error(error);
    return {success: false, error: error};
  }
};

export const salesCreateApi = async formData => {
  try {
    const response = await fetch(`${API_BASE_URL}/sales/create`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error(`Error with status: ${response.status}`);
    }

    const data = await response.json();
    if (data?.length > 0) {
      return {success: true, data};
    } else {
      return {success: false, error: data?.message};
    }
  } catch (error) {
    console.error(error);
    return {success: false, error: error};
  }
};

export const changePasswordVerifyApi = async formData => {
  try {
    const response = await fetch(`${API_BASE_URL}/change-password-verify`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error(`Error with status: ${response.status}`);
    }

    const data = await response.json();

    if (data?.success) {
      return {success: true, data};
    } else {
      return {success: false, error: data?.message};
    }
  } catch (error) {
    console.error(error);
    return {success: false, error: error};
  }
};

export const changePasswordApi = async formData => {
  try {
    const response = await fetch(`${API_BASE_URL}/change-password`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error(`Error with status: ${response.status}`);
    }

    const data = await response.json();
    if (data?.success) {
      return {success: true, data};
    } else {
      return {success: false, error: data?.message};
    }
  } catch (error) {
    console.error(error);
    return {success: false, error: error};
  }
};

export const getDropdownData = async () => {
  const response = await fetch(`${API_BASE_URL}/get-store-list`, {
    method: 'GET',
    headers: await getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Error with status: ${response.status}`);
  }
  const data = await response.json();
  if (data?.data.length > 0) {
    return {success: true, data: data?.data};
  } else {
    return {success: false, error: data?.message};
  }
};

export const getSalesReport = async (start_date, end_date, store_id) => {
  const response = await fetch(`${API_BASE_URL}/sales/export-sales-report`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({start_date, end_date, store_id}),
  });
  if (!response.ok) {
    throw new Error(`Error with status: ${response.status}`);
  }
  return await response;
};

export const getStockReport = async store_id => {
  const response = await fetch(`${API_BASE_URL}/stock/export-stock-report`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({store_id}),
  });
  if (!response.ok) {
    throw new Error(`Error with status: ${response.status}`);
  }
  return await response;
};

// Function to handle logout and remove the token
export const logoutApi = async () => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    headers: await getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Login failed with status: ${response.status}`);
  }
  await AsyncStorage.removeItem('userToken');
  await AsyncStorage.removeItem('userName');
  await AsyncStorage.removeItem('userPhone');
  await AsyncStorage.removeItem('userType');
  await AsyncStorage.removeItem('tokenExpiration');
  return true;
};
