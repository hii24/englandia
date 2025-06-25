import type { NextApiRequest, NextApiResponse } from 'next';
import { getLessons, createLesson } from '@/server/lessons/service';
// import { getSession } from 'next-auth/react'; // если используешь next-auth

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // const session = await getSession({ req });
    // const user = session?.user;
    // if (!user) return res.status(401).json({ error: 'Not authenticated' });

    if (req.method === 'GET') {
      const lessons = await getLessons();
      return res.status(200).json(lessons);
    }

    if (req.method === 'POST') {
      // TODO: Проверка роли (admin)
      try {
        const lesson = await createLesson(req.body);
        return res.status(201).json(lesson);
      } catch (e: any) {
        return res.status(400).json({ error: e.message });
      }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: any) {
    console.error('API /lessons error:', e);
    return res.status(500).json({ error: e.message || 'Internal Server Error' });
  }
} 