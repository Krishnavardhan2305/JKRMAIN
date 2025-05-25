import { query } from "../init/db.js";

export const getClients = async () => {
    try {
        const result = await query("SELECT * FROM mla_info");
        
        if (!result || !result.rows) {
            throw new Error("No clients data found");
        }
        return result.rows; 
    } catch (err) {
        console.error("Error fetching clients:", err);
        throw new Error("Error fetching clients from database");
    }
};

export const addClient = async (name, age, constituency, mandal, Mobile, Email, PoliticalParty, password) => {
    try {
        const result = await query(
            `INSERT INTO mla_info(name, age, constituency, mandal, "Mobile", "Email", "PoliticalParty", "Password")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [name, age, constituency, mandal, Mobile, Email, PoliticalParty, password]
          );
          
          
    } catch (error) {
        console.error("Database insertion error:", error);
        throw error;
    }
};

export const getadminInfo = async () => {
    try {
        const { rows } = await query('SELECT * FROM admininfo');
        return rows;
    } catch (error) {
        console.error("Error fetching adminData:", error);
        throw error;
    }
};