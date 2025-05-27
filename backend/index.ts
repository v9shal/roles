const express = require('express');
const resource=require('./routes/resourceRoutes');
const userresource=require('./routes/userRoutes');
const skillroute=require('./routes/skillRoute');
const PostRoute=require('./routes/postRoute');
const app = express();
app.use(express.json());

app.use('/api/resources', resource);
app.use('/api/userRegister', userresource);
app.use('/api/skill',skillroute);
app.use('/api/post',PostRoute);
app.get('/healthy', (req:any, res:any) => {
  res.status(200).json({ message: 'Server is healthy' });
})

app.listen(3000, () => console.log('Server is running on port 3000'));
