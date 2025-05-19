const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('Testing login endpoint...');
    
    const credentials = {
      email: 'test1747639041576@example.com',
      password: 'password123'
    };
    
    console.log('Sending request with credentials:', credentials);
    
    const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
    
    console.log('Login successful!');
    console.log('Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Login failed!');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testLogin();
