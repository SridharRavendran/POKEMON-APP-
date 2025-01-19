const express = require('express');
const app = express();
const cors = require('cors');
const { sequelize } = require('./models');
const pokemonRoutes = require('./routes/pokemon');

app.use(cors());
app.use(express.json());
app.use('/api', pokemonRoutes);

// Start server
sequelize.sync({ force: true }).then(() => {
    console.log('Database synced!');
    app.listen(3000, () => console.log('Server running on port 3000'));
});
