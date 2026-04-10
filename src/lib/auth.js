import { SignJWT, jwtVerify } from 'jose';

// Secret key for JWT. In production, provide a strong secret via ENV variable.
const secretKey = process.env.JWT_SECRET || 'fables_super_strong_secret_key_1234!';
const key = new TextEncoder().encode(secretKey);

/**
 * Creates a signed JWT token
 * @param {Object} payload Payload to encode
 * @param {String} expiresIn Duration String (default "7d")
 */
export async function signToken(payload, expiresIn = '7d') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

/**
 * Verifies a JWT token and returns its payload
 * @param {String} token 
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
