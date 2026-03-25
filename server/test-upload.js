const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function runTest() {
  try {
    console.log("Creating dummy file...");
    fs.writeFileSync('test.png', 'dummy image data');

    console.log("Generating admin token...");
    // From .env: JWT_SECRET=supersecretportfoliojwtkey123
    const token = jwt.sign(
      { id: 1, username: 'admin' }, 
      'supersecretportfoliojwtkey123', 
      { expiresIn: '1h' }
    );

    console.log("Uploading file...");
    const formData = new FormData();
    formData.append('file', fs.createReadStream('test.png'));

    const res = await axios.post('http://localhost:5001/api/upload', formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log("Upload Success! Response:", res.data);
  } catch (err) {
    if (err.response) {
      console.error("Upload failed with status:", err.response.status);
      console.error("Error data:", err.response.data);
    } else {
      console.error("Upload failed:", err.message);
    }
  } finally {
    if (fs.existsSync('test.png')) {
      fs.unlinkSync('test.png');
    }
  }
}

runTest();
