import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Verify JWT token
router.post('/verify', async (req, res) => {
  const { supabase, logger } = req.app.locals;
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      error: 'Token is required'
    });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({
        error: 'Invalid token'
      });
    }

    // Get user profile from our users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      logger.error('Failed to fetch user profile:', profileError);
      return res.status(500).json({
        error: 'Failed to fetch user profile'
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        ...profile
      }
    });
  } catch (error) {
    logger.error('Token verification failed:', error);
    res.status(500).json({
      error: 'Token verification failed'
    });
  }
});

// Get current user profile
router.get('/profile', authMiddleware, async (req, res) => {
  const { supabase, logger } = req.app.locals;
  const userId = req.user.id;

  try {
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      logger.error('Failed to fetch user profile:', error);
      return res.status(500).json({
        error: 'Failed to fetch user profile'
      });
    }

    res.json({ profile });
  } catch (error) {
    logger.error('Profile fetch failed:', error);
    res.status(500).json({
      error: 'Profile fetch failed'
    });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  const { supabase, logger } = req.app.locals;
  const userId = req.user.id;
  const { full_name, phone, location } = req.body;

  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        full_name,
        phone,
        location,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update user profile:', error);
      return res.status(500).json({
        error: 'Failed to update profile'
      });
    }

    res.json({ profile: data });
  } catch (error) {
    logger.error('Profile update failed:', error);
    res.status(500).json({
      error: 'Profile update failed'
    });
  }
});

export default router;