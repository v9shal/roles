const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.post('/users', async (req:any, res:any) => {
  const { email, passwordHash, name } = req.body;
  try {
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(3000, () => console.log('Server is running on port 3000'));
