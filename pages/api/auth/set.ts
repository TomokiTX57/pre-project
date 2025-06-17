import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { access_token, refresh_token } = req.body
  const supabase = createServerSupabaseClient({ req, res })
  await supabase.auth.setSession({ access_token, refresh_token })
  res.status(200).json({ ok: true })
} 