//Creating a connection to the skills table in the database

import { Router } from 'express';
import { pool } from '../db/pool';

const router = Router();

//Get all skills
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM skills');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});

export default router;