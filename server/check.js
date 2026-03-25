const sqlite3 = require('sqlite3').verbose(); 
const db = new sqlite3.Database('portfolio.db'); 
db.get("SELECT value FROM content WHERE key = 'profilePicture'", [], (err, row) => { 
  if (err) {
    console.error(err);
  } else if (!row) {
    console.log("NOT FOUND IN DB");
  } else {
    console.log("DB VALUE:", row.value); 
  }
});
