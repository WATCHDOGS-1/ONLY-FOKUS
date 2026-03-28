import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { query } from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Type for Clerk Auth request
interface AuthRequest extends express.Request {
  auth: {
    userId: string;
    sessionId: string;
    getToken: () => Promise<string>;
  };
}

// POST /api/profile - create profile
app.post('/api/profile', ClerkExpressRequireAuth(), async (req, res) => {
  const { userId } = (req as AuthRequest).auth;
  const { username, display_name, bio, avatar_url } = req.body;

  try {
    const existing = await query('SELECT id FROM profiles WHERE clerk_id = $1', [userId]);
    if (existing.rowCount && existing.rowCount > 0) {
      return res.status(200).json(existing.rows[0]);
    }

    const result = await query(
      `INSERT INTO profiles (clerk_id, username, display_name, bio, avatar_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, username, display_name, bio, avatar_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/profile/:username - fetch profile
app.get('/api/profile/:username', async (req, res) => {
  try {
    const result = await query('SELECT * FROM profiles WHERE username = $1', [req.params.username]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/profile/me/current - fetch own profile by Clerk ID
app.get('/api/profile/me/current', ClerkExpressRequireAuth(), async (req, res) => {
  const { userId } = (req as AuthRequest).auth;
  try {
    const result = await query('SELECT * FROM profiles WHERE clerk_id = $1', [userId]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/profile - update profile
app.patch('/api/profile', ClerkExpressRequireAuth(), async (req, res) => {
  const { userId } = (req as AuthRequest).auth;
  const { username, display_name, bio, avatar_url } = req.body;

  try {
    const result = await query(
      `UPDATE profiles 
       SET username = COALESCE($1, username),
           display_name = COALESCE($2, display_name),
           bio = COALESCE($3, bio),
           avatar_url = COALESCE($4, avatar_url)
       WHERE clerk_id = $5 RETURNING *`,
      [username, display_name, bio, avatar_url, userId]
    );
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/follow/:userId - follow
app.post('/api/follow/:userId', ClerkExpressRequireAuth(), async (req, res) => {
  const { userId: clerkId } = (req as AuthRequest).auth;
  const followingId = req.params.userId; // the UUID of the user to follow

  try {
    const followerRes = await query('SELECT id FROM profiles WHERE clerk_id = $1', [clerkId]);
    if (followerRes.rowCount === 0) return res.status(404).json({ error: 'Follower profile not found' });
    const followerId = followerRes.rows[0].id;

    if (followerId === followingId) return res.status(400).json({ error: "Can't follow yourself" });

    await query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [followerId, followingId]
    );
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/follow/:userId - unfollow
app.delete('/api/follow/:userId', ClerkExpressRequireAuth(), async (req, res) => {
  const { userId: clerkId } = (req as AuthRequest).auth;
  const followingId = req.params.userId;

  try {
    const followerRes = await query('SELECT id FROM profiles WHERE clerk_id = $1', [clerkId]);
    if (followerRes.rowCount === 0) return res.status(404).json({ error: 'Profile not found' });
    const followerId = followerRes.rows[0].id;

    await query('DELETE FROM follows WHERE follower_id = $1 AND following_id = $2', [followerId, followingId]);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/follow/:userId/stats - counts
app.get('/api/follow/:userId/stats', async (req, res) => {
  const { userId } = req.params;
  try {
    const followers = await query('SELECT COUNT(*) FROM follows WHERE following_id = $1', [userId]);
    const following = await query('SELECT COUNT(*) FROM follows WHERE follower_id = $1', [userId]);
    res.json({
      followers: parseInt(followers.rows[0].count),
      following: parseInt(following.rows[0].count)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
