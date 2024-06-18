import bcrypt, { hash } from 'bcrypt';

const saltRounds = 10;

/**
 * Hashes a password using bcrypt.
 * @param password The password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
}

/**
 * Compares a plaintext password with a hashed password.
 * @param password The plaintext password.
 * @param hashedPassword The hashed password to compare against.
 * @returns A promise that resolves to true if the passwords match, false otherwise.
 */
export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    console.log(match)
    return match;
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
}
