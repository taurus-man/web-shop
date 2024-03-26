require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
app.use('/auth', authRoutes);
app.use('/product', productRoutes);
app.use('/user', userRoutes);
app.use('/cart', cartRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on : http://localhost:${PORT}`)
})