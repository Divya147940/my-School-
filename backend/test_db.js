import pool from './db.js';

async function test() {
    try {
        console.log("Testing connection...");
        const res = await pool.query('SELECT NOW()');
        console.log("Success:", res.rows[0]);
    } catch (e) {
        console.error("Test failed:", e);
    } finally {
        await pool.end();
    }
}

test();
