import * as clientService from "../services/clientServices.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import transporter from "../utils/Transporter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

export const clientLogin = async (req, res) => {
  try {
    const { email, password, position } = req.body;

    if (!email || !password || !position) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const client = await clientService.findClient(email, position);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const isMatch = await bcrypt.compare(password, client.Password || client.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect credentials",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables.");
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }

    const tokenData = {
      id: client.id,
      email: client.Email,
      position,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "None",
      secure: true, 
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      client: {
        id: client.id,
        email: client.Email,
        name: client.name,
        mandal: client.mandal,
        constituency: client.constituency,
        position,
      }
    });
    

  } catch (error) {
    console.error("Error during client login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getmladata = async (req, res) => {
  try {
    const userId = req.id;
    const MLA_INFO = await clientService.findMlaByID(userId);
    
    if (!MLA_INFO) {
      return res.status(404).json({
        success: false,
        message: "MLA not found",
      });
    }

    return res.status(200).json(MLA_INFO);
  } catch (error) {
    console.error("Error getting mladata:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addVolunteer = async (req, res) => {
  try {
    const userId = req.id;
    const { name, age, mandal, mobile, email,constituency } = req.body;
    if (!name || !age || !mandal || !mobile || !email||!constituency) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    const password = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    await clientService.addVolunteer(userId, name, age, mandal, mobile, email, hashedPassword,constituency);
    const MLA_INFO = await clientService.findMlaByID(userId);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `You are added as a volunteer by ${MLA_INFO.name} for ${mandal}`,
      text: `Your login credentials:\n\nUsername: ${email}\nPassword: ${password}`,
    });

    return res.status(201).json({
      success: true,
      message: "Volunteer added successfully",
    });

  } catch (error) {
    console.error("Error adding volunteer:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
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

export const getvolunteerData = async (req, res) => {
  try {
    const userId = req.id; 
    if(!userId)
    {
      console.log("No user found");
      
    }
    const volunteer = await clientService.getvolunteerData(userId);
    return res.status(200).json(volunteer); 
  } catch (error) {
    console.error("Error fetching volunteer data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addCitizen = async (req, res) => {
  try {
    const volunteerId = req.id;
    const {
      name,
      age,
      gender,
      constituency,
      mandal,
      village,
      caste,
      subcaste,
      votedFor,
    } = req.body;

    if (!name || !age || !gender || !constituency || !mandal || !village || !caste || !votedFor) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    await clientService.addCitizen(
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
    );

    return res.status(201).json({
      success: true,
      message: "Citizen added successfully",
    });
  } catch (error) {
    console.error("Error adding citizen:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getVolunteerCitizens = async (req, res) => {
  try {
    const volunteerId = req.id;

    const citizens = await clientService.getCitizens(volunteerId);

    return res.status(200).json(citizens);
  } catch (error) {
    console.error("Error fetching volunteer's citizens:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching citizens",
    });
  }
};

export const getVotingStatsByAgeGroup = async (req, res) => {
  try {
    const { mlaParty, mlaConstituency } = req.query;

    if (!mlaParty || !mlaConstituency) {
      return res.status(400).json({ success: false, message: "mlaParty and mlaConstituency are required" });
    }

    const stats = await clientService.getStats(mlaParty, mlaConstituency);

    const transformed = stats.flatMap(({ age_group, mla_votes, other_votes }) => {
      const result = [];
      if (mla_votes > 0) {
        result.push({ age_group, votedfor: mlaParty, count: mla_votes });
      }
      if (other_votes > 0) {
        result.push({ age_group, votedfor: 'Others', count: other_votes });
      }
      return result;
    });

    return res.status(200).json({
      success: true,
      data: transformed,
    });
  } catch (error) {
    console.error("Error fetching voting stats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getVotingStatsByCaste = async (req, res) => {
  try {
    const { mlaParty, mlaConstituency } = req.query;

    if (!mlaParty || !mlaConstituency) {
      return res.status(400).json({ success: false, message: "mlaParty and mlaConstituency are required" });
    }

    const stats = await clientService.getCasteStats(mlaParty, mlaConstituency);

    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Error fetching caste stats:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getVotingStatsByGenderAndAge = async (req, res) => {
  try {
    const { mlaParty, mlaConstituency } = req.query;

    if (!mlaParty || !mlaConstituency) {
      return res.status(400).json({ success: false, message: "mlaParty and mlaConstituency are required" });
    }

    const stats = await clientService.getGenderAgeVotingStats(mlaParty, mlaConstituency);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Error fetching gender-age voting stats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getMandalwiseVotingStats = async (req, res) => {
  const { mlaParty, mlaConstituency } = req.query;
  if (!mlaParty || !mlaConstituency) {
    return res.status(400).json({ success: false, message: "mlaParty and mlaConstituency are required" });
  }

  try {
    const result = await clientService.fetchMandalwiseVotingStats(mlaParty, mlaConstituency);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching mandal-wise stats:', error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getMandalwiseAgeGroupStats = async (req, res) => {
  const { mlaParty, mlaConstituency } = req.query;
  if (!mlaParty || !mlaConstituency) {
    return res.status(400).json({ success: false, message: "mlaParty and mlaConstituency are required" });
  }

  try {
    const result = await clientService.getMandalwiseAgeGroupStats(mlaParty, mlaConstituency);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching mandal-wise age group stats:', error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getMandalwiseCasteStats = async (req, res) => {
  const { mlaParty, mlaConstituency } = req.query;
  if (!mlaParty || !mlaConstituency) {
    return res.status(400).json({ success: false, message: "mlaParty and mlaConstituency are required" });
  }

  try {
    const result = await clientService.getMandalwiseCasteStats(mlaParty, mlaConstituency);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching mandal caste stats:', error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getMandalGenderAgeStats = async (req, res) => {
  const { mlaParty, mlaConstituency } = req.query;

  if (!mlaParty || !mlaConstituency) {
    return res.status(400).json({ error: 'mlaParty and mlaConstituency are required' });
  }

  try {
    const data = await clientService.getGenderAgeGroupStatsByMandal(mlaParty, mlaConstituency);
    res.json({ data });
  } catch (error) {
    console.error('Error in getMandalGenderAgeStats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const volunteerchangepassword=async(req,res)=>
{
  const { currentPassword, newPassword } = req.body;
  const volunteerId = req.id;

  try {
    await clientService.changeVolunteerPassword(volunteerId, currentPassword, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error changing volunteer password:', err);

    if (err.message === 'Volunteer not found') {
      return res.status(404).json({ error: err.message });
    } else if (err.message === 'Incorrect current password') {
      return res.status(401).json({ error: err.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
}
export const mlachangepassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const mlaId = req.id; 

  try {
    await clientService.changeMLAPassword(mlaId, currentPassword, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error changing MLA password:', err);

    if (err.message === 'MLA not found') {
      return res.status(404).json({ error: err.message });
    } else if (err.message === 'Incorrect current password') {
      return res.status(401).json({ error: err.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email, position } = req.body;

  try {
    if (!email || !position) {
      return res.status(400).json({ error: 'Email and position are required' });
    }
    const user = await clientService.sendPasswordResetLink(email, position);
    const resetToken = jwt.sign(
      { id: user.id, position },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
     );
    // const PORT=process.env.PORT;
    // const resetLink = `http://localhost:${PORT}/reset-password/${resetToken}`;
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>Hello ${user.name || 'User'},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });
    res.status(200).json({ message: 'Reset link sent to your email' });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(400).json({ error: error.message || 'Failed to send reset link' });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, position } = decoded;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await clientService.resetPassword(hashedPassword, id, position);

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
};

export const getVolunteers = async (req, res) => {
  try {
    const { mla_id } = req.query;
    const volunteers = await clientService.getvolunteers(mla_id);

    return res.status(200).json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
