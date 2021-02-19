const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT;

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});