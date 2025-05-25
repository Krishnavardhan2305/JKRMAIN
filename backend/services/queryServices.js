import { query } from "../init/db.js"; 

export const reportQuery = async (user_id, position, issue, image_url) => {
  const queryText = `
    INSERT INTO queries (user_id, position, issue, image_url)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [user_id, position, issue, image_url];
  const result = await query(queryText, values);
  return result.rows[0];
};

export const getqueries = async () => {
  try {
    const result = await query(`SELECT * FROM queries`);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
