import bcrypt from "bcryptjs";
import { query } from "../init/db.js";
import jwt from "jsonwebtoken";
export const findClient = async (email, position) => {
  try {
    const table = position === 'MLA' ? 'mla_info' : 'volunteer_info';
    const result = await query(`SELECT * FROM ${table} WHERE "Email" = $1`, [email]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching client data:", error);
    throw error;
  }
};
export const addVolunteer = async (mla_id, name, age, mandal, mobile, email, password,constituency) => {
  try {
    const insertResult = await query(
      `INSERT INTO volunteer_info (name, age, mandal, "Mobile", "Email", "Password", mla_id,constituency)
       VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING "id"`,
      [name, age, mandal, mobile, email, password, mla_id,constituency]
    );

    const newVolunteerId = insertResult.rows[0].id;

    await query(
      `UPDATE mla_info
       SET volunteers = ARRAY_APPEND(COALESCE(volunteers, '{}'), $1)
       WHERE id = $2`,
      [newVolunteerId, mla_id]
    );

    return { success: true, volunteerId: newVolunteerId };
  } catch (error) {
    console.error("Error in addVolunteer:", error);
    throw error;
  }
};


export const findMlaByID = async (mla_id) => {
  try {
    const result = await query(`SELECT * FROM mla_info WHERE id = $1`, [mla_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error in finding MLA:", error);
    throw error;
  }
};

export const getvolunteerData = async (id) => {
  try {
    const result = await query(`SELECT * FROM volunteer_info WHERE id = $1`, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching volunteer info:", error);
    throw error;
  }
};

export const addCitizen = async (
  volunteerId,
  name,
  age,
  gender,
  constituency,
  mandal,
  village,
  caste,
  subcaste,
  votedFor
) => {
  try {
    await query(
      `INSERT INTO citizen_info 
      (name, age, gender, constituency, mandal, village, caste, subcaste, votedFor, volunteer_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [name, age, gender, constituency, mandal, village, caste, subcaste, votedFor, volunteerId]
    );
  } catch (error) {
    console.error("Error in addCitizen service:", error);
    throw error;
  }
};


export const getCitizens = async (volunteerId) => {
  try {
    const result = await query(
      `SELECT id, name, age, gender, constituency, mandal, village, caste, subcaste ,votedfor
       FROM citizen_info 
       WHERE volunteer_id = $1`,
      [volunteerId]
    );

    return result.rows;
  } catch (error) {
    console.error("Error in getCitizens service:", error);
    throw error;
  }
};

export const getStats = async (mlaParty, mlaConstituency) => {
  try {
    const result = await query(`
      SELECT
        CASE 
          WHEN age BETWEEN 18 AND 30 THEN '18-30'
          WHEN age BETWEEN 31 AND 55 THEN '31-55'
          ELSE '55+'
        END AS age_group,
        COUNT(*) FILTER (WHERE votedFor = $1) AS mla_votes,
        COUNT(*) FILTER (WHERE votedFor != $1) AS other_votes
      FROM citizen_info
      WHERE constituency = $2
      GROUP BY age_group
    `, [mlaParty, mlaConstituency]);

    return result.rows;
  } catch (error) {
    console.error("Error in getStats service:", error);
    throw error;
  }
};

export const getCasteStats = async (mlaParty, mlaConstituency) => {
  try {
    const result = await query(`
      SELECT
        caste,
        COUNT(*) FILTER (WHERE votedFor = $1) AS mla_votes,
        COUNT(*) FILTER (WHERE votedFor != $1) AS other_votes
      FROM citizen_info
      WHERE constituency = $2
      GROUP BY caste
    `, [mlaParty, mlaConstituency]);

    return result.rows;
  } catch (error) {
    console.error("Error in getCasteStats:", error);
    throw error;
  }
};

export const getGenderAgeVotingStats = async (mlaParty, mlaConstituency) => {
  try {
    const result = await query(`
      SELECT
        CASE 
          WHEN age BETWEEN 18 AND 30 THEN '18-30'
          WHEN age BETWEEN 31 AND 55 THEN '31-55'
          ELSE '55+'
        END AS age_group,
        CASE 
          WHEN gender = 'M' THEN 'male'
          WHEN gender = 'F' THEN 'female'
          ELSE 'other'
        END AS gender,
        COUNT(*) AS count
      FROM citizen_info
      WHERE votedFor = $1 AND constituency = $2
      GROUP BY age_group, gender
      ORDER BY age_group, gender
    `, [mlaParty, mlaConstituency]);

    return result.rows;
  } catch (error) {
    console.error("Error in getGenderAgeVotingStats:", error);
    throw error;
  }
};

export const fetchMandalwiseVotingStats = async (mlaParty, mlaConstituency) => {
  const result = await query(`
    SELECT
      mandal,
      COUNT(*) FILTER (WHERE votedFor = $1) AS mla_votes,
      COUNT(*) FILTER (WHERE votedFor != $1) AS other_votes
    FROM citizen_info
    WHERE constituency = $2
    GROUP BY mandal
  `, [mlaParty, mlaConstituency]);

  return result.rows;
};

export const getMandalwiseAgeGroupStats = async (mlaParty, mlaConstituency) => {
  const result = await query(`
    SELECT
      mandal,
      COUNT(*) FILTER (WHERE votedFor = $1 AND age BETWEEN 18 AND 30) AS age_18_30,
      COUNT(*) FILTER (WHERE votedFor = $1 AND age > 30 AND age <= 55) AS age_31_55,
      COUNT(*) FILTER (WHERE votedFor = $1 AND age > 55) AS age_55_plus
    FROM citizen_info
    WHERE constituency = $2
    GROUP BY mandal
  `, [mlaParty, mlaConstituency]);

  return result.rows;
};

export const getMandalwiseCasteStats = async (mlaParty, mlaConstituency) => {
  const result = await query(`
    SELECT
      mandal,
      caste,
      COUNT(*) FILTER (WHERE votedFor = $1) AS mla_votes
    FROM citizen_info
    WHERE constituency = $2
    GROUP BY mandal, caste
  `, [mlaParty, mlaConstituency]);

  return result.rows;
};
export const getGenderAgeGroupStatsByMandal = async (mlaParty, mlaConstituency) => {
  const result = await query(`
    SELECT
      mandal,
      COUNT(*) FILTER (WHERE gender = 'M' AND age BETWEEN 18 AND 30) AS male_18_30,
      COUNT(*) FILTER (WHERE gender = 'F' AND age BETWEEN 18 AND 30) AS female_18_30,
      COUNT(*) FILTER (WHERE gender = 'M' AND age BETWEEN 31 AND 55) AS male_31_55,
      COUNT(*) FILTER (WHERE gender = 'F' AND age BETWEEN 31 AND 55) AS female_31_55,
      COUNT(*) FILTER (WHERE gender = 'M' AND age > 55) AS male_55_plus,
      COUNT(*) FILTER (WHERE gender = 'F' AND age > 55) AS female_55_plus
    FROM citizen_info
    WHERE votedFor = $1 AND constituency = $2
    GROUP BY mandal;
  `, [mlaParty, mlaConstituency]);

  return result.rows;
};

export const changeVolunteerPassword = async (volunteerId, currentPassword, newPassword) => {
  const result = await query('SELECT "Password" FROM volunteer_info WHERE id = $1', [volunteerId]);

  if (!result.rows.length) {
    throw new Error('Volunteer not found');
  }

  const isMatch = await bcrypt.compare(currentPassword, result.rows[0].Password);
  if (!isMatch) {
    throw new Error('Incorrect current password');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await query('UPDATE volunteer_info SET "Password" = $1 WHERE id = $2', [hashedPassword, volunteerId]);
};
export const changeMLAPassword = async (mlaId, currentPassword, newPassword) => {
  const result = await query('SELECT "Password" FROM mla_info WHERE id = $1', [mlaId]);

  if (!result.rows.length) {
    throw new Error('MLA not found');
  }

  const isMatch = await bcrypt.compare(currentPassword, result.rows[0].Password);
  if (!isMatch) {
    throw new Error('Incorrect current password');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await query('UPDATE mla_info SET "Password" = $1 WHERE id = $2', [hashedPassword, mlaId]);
};

export const sendPasswordResetLink = async (email, position) => {
  const table = position === 'MLA' ? 'mla_info' : 'volunteer_info';
  const result = await query(`SELECT * FROM ${table} WHERE "Email" = $1`, [email]);
  const user = result.rows[0];
  if (!user) {
    throw new Error('No user found with that email and position');
  }
  return user;
};

export const resetPassword = async (hashedPassword, id, position) => {
  const table = position === 'MLA' ? 'mla_info' : 'volunteer_info';

  await query(
    `UPDATE ${table} SET "Password" = $1 WHERE id = $2`,
    [hashedPassword, id]
  );
};

export const getvolunteers = async (mla_id) => {
  try {
    const mlaResult = await query(
      `SELECT volunteers FROM mla_info WHERE id = $1`,
      [mla_id]
    );
    const volunteerIds = mlaResult.rows[0]?.volunteers || [];
    if (volunteerIds.length === 0) return [];
    const volunteerDetails = await query(
      `
      SELECT 
        id,
        name,
        "Email",
        mandal,
        "Mobile"
      FROM volunteer_info
      WHERE id = ANY($1)
      `,
      [volunteerIds]
    );

    return volunteerDetails.rows;
  } catch (error) {
    console.error("Error in getvolunteers service:", error);
    throw error;
  }
};
