import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    return res.status(200).json({
      success: true,
      message: 'Simple test endpoint working',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Simple test failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
} 