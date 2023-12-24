const app = require('./app');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({path: path.join(__dirname, 'config.env')});
const mongoose = require('mongoose');

dotenv.config({path: path.join(__dirname, 'config.env')});

const DB = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);

mongoose.connect(DB, {
    // Need to look at mongoDB documentation to find new options
}).then(() => {
    console.log('DB Connection Successful');
}).catch(err => console.log(err));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
