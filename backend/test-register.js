const axios = require('axios');

const testRegister = async () => {
  try {
    console.log('Testing registration endpoint...');

    const userData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };

    console.log('Sending request with data:', userData);

    const response = await axios.post('http://localhost:5000/api/auth/register', userData);

    console.log('Registration successful!');
    console.log('Response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Registration failed!');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testRegister();
