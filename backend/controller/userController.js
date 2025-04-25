const RegisterUser=require('../actions/user_registration_actions');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
async function RegisterUser(req,res){
    try {
        const user = await RegisterUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ error: "An error occurred while registering the user. Please try again later." });
    }
}
async function Login(input) {
    const validationResult = UserInputSchema.safeParse(input);
    if (!validationResult.success) {
        throw new Error(
            `Validation error: ${validationResult.error.issues
                .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                .join(', ')}`
        );
    }

    const validatedData = validationResult.data;

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: validatedData.username,
                passwordHash: validatedData.passwordHash,

            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        if (user.passwordHash !== validatedData.passwordHash) {
            throw new Error("Invalid password");
        }
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || "fallback_secret",
            { expiresIn: '24h' }
          );
    
          res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
          });
          res.json({
            message: 'Login successful',
            user: {
              username: user.username,
              role: user.role || 'user'
            }
          });

    } catch (error) {
        console.error("Error during user login:", error);

        throw new Error("An error occurred while logging in. Please try again later.");
    }
}
async function verify(req, res) {
    try {
      const token = req.cookies.authToken;
      if (!token) {
        return res.status(401).json({ error: "No token present" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
      const user = await UserModel.getUserByUsername(decoded.username);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      res.status(200).json({
        message: "authorized",
        user: {
          username: user.username,
          role: user.role || 'user',
          token:token
        }
      });
    } catch (error) {
      console.error('Token Verification Error:', error);
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

async function DeleteUser(req,res){
    try{
        const {username}=req.params;
        if(!username || typeof username !== 'string') {
            return res.status(400).json({ error: "Invalid username" });
        }
        const deletedUser=await DeleteUser(username);
        if(!deletedUser){
            return res.status(401).json({ error: `User with username "${username}" not found.` });
        }
        res.status(200).json({message:`user with username ${username} deleted successfully`});

    }
    catch(error){
        console.error(`Error deleting user with username ${username}:`, error);
        if(error.message.includes("not found")){
            return res.status(404).json({error: error.message});
        }
        res.status(500).json({error: `An error occurred while deleting the user with username ${username}.`});
    }
}
module.exports = { RegisterUser, DeleteUser };