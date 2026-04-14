import { v2 as cloudinary } from 'cloudinary';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  // Only authenticated users can get an upload signature
  const cookieStore = await cookies();
  const token = cookieStore.get('fables_session')?.value;

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const session = await verifyToken(token);
  if (!session) {
    return Response.json({ error: 'Invalid session' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { paramsToSign } = body;

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return Response.json({ signature });
  } catch (error) {
    console.error('Cloudinary sign error:', error);
    return Response.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}
