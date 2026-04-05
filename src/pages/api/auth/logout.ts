import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.setHeader('Set-Cookie', [
    'auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict',
    'auth_user=; Path=/; Max-Age=0; SameSite=Strict'
  ]);

  res.status(200).json({ success: true, message: 'Logout realizado' });
}
