import { NextApiRequest, NextApiResponse } from 'next';
import { syncDatabase } from '../../lib/sync-db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; error?: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await syncDatabase();
    res.status(200).json({ message: 'Banco de dados sincronizado com sucesso!' });
  } catch (error) {
    console.error('Erro na sincronização:', error);
    res.status(500).json({
      message: 'Erro ao sincronizar banco de dados',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}