const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const jwt = require('jsonwebtoken');

async function uploadTest() {
  try {
    fs.writeFileSync('test.png', 'dummy image');
    const token = jwt.sign({ id: 1, username: 'admin' }, 'supersecretportfoliojwtkey123');
    
    const form = new FormData();
    form.append('file', fs.createReadStream('test.png'));
    
    const res = await axios.post('http://localhost:5001/api/upload', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: 'Bearer ' + token
      }
    });
    console.log("SUCCESS:", res.data);
  } catch (err) {
    if (err.response) {
      console.log("ERROR STATUS:", err.response.status);
      console.log("ERROR DATA:", err.response.data);
    } else {
      console.log("ERROR MESSAGE:", err.message);
    }
  }
}

uploadTest();
