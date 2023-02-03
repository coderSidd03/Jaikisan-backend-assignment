import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Routes from './Routes/routes.js'

const app = express();

app.use(express.json());


dotenv.config();

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true
})
  .then(
    app.listen(process.env.PORT,() => console.log(`>> app running on port ${process.env.PORT}...\n>> database connected..`))
  )
  .catch(err => console.error(err));



// usage of routes
app.use('/', Routes)