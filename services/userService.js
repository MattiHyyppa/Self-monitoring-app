import { executeQuery } from '../database/database.js';

const getUserByEmail = async (email) => {
  const existingUsers = await executeQuery("SELECT * FROM users WHERE email = $1;", email);
  if (existingUsers && existingUsers.rowCount > 0) {
    return existingUsers.rowsOfObjects()[0];
  }
  return null;
}

const addUser = async (email, hash) => {
  await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, hash);
}

export { getUserByEmail, addUser }