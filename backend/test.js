// ./backend/test.js
const  { RegisterUser,DeleteUser } =require( './actions/user_registration_actions.js');

async function main() {
  try {
    // Test: Create a new user
    console.log('Testing user deletion...');
    
const email="vishal@example.com"
    const newUser = await DeleteUser(email);
    console.log('User deleted successfully:', newUser);

    // Add additional tests here, e.g., fetching users, deleting users, etc.
    // Examp
    // console.log('Fetching all users...');
    // const users = await FetchAllUsers(); // Hypothetical function
    // console.log('All users:', users);

  } catch (e) {
    console.error('Error in main:', e); // Detailed error log
  } finally {
    console.log('Test script finished.');
    process.exit(0); // Ensure the script exits
  }
}

main();

