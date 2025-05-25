import * as clientService from "../services/adminServices.js";

import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import transporter from "../utils/Transporter.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') }); 


export const getClients = async (req, res) => {
    try {
        const clients = await clientService.getClients();

        if (!clients) {
            return res.status(404).json({
                success: false,
                message: "No clients found",
            });
        }

        return res.status(200).json({
            success: true,
            clients,
        });
    } catch (err) {
        console.error("Error fetching clients:", err);
        return res.status(500).json({
            success: false,
            message: "Error Getting Clients",
        });
    }
};


export const addclients = async (req, res) => {
  try {
    const {
      name,
      age,
      constituency,
      mandal,
      Password,
      Mobile,
      Email,
      PoliticalParty,
    } = req.body;

    if (
      !name ||
      !age ||
      !constituency ||
      !Mobile ||
      !PoliticalParty ||
      !Password ||
      !Email
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);
    
    await clientService.addClient(
        name,
        age,
        constituency,
        mandal,
        Mobile,
        Email,
        PoliticalParty,
        hashedPassword 
    );
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: Email,
        subject: "Your Dashboard is Ready",
        text: `Your login credentials:\n\nUsername: ${Email}\nPassword: ${Password}`,
    });

    return res.status(201).json({
      message: "Client added successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Error adding client:", error);
    return res.status(500).json({
      success: false,
      message: "Error Adding Client",
    });
  }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const adminData = await clientService.getadminInfo();
        const admin = adminData.find(admin => admin.email === email);

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined in environment variables.");
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
        const tokenData = { userId: admin.id };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("token", token, { 
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true, 
            sameSite: "strict" 
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            admin: { id: admin.id, email: admin.email }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error Logging In' 
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: " Logged out succesfully"
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}