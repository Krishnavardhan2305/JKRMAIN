import express from "express";
import { addCitizen, addVolunteer, clientLogin, getmladata, getVolunteerCitizens, getvolunteerData, getVotingStatsByGenderAndAge, getVotingStatsByAgeGroup, logout, getVotingStatsByCaste, getMandalwiseVotingStats, getMandalwiseAgeGroupStats, getMandalwiseCasteStats, getMandalGenderAgeStats, volunteerchangepassword, mlachangepassword, forgotPassword, resetPassword, getVolunteers } from "../controllers/clientcontroller.js";
import  isAuthenticated from "../middleware/isAuthenticated.js"
const router = express.Router();

router.post("/clientLogin", clientLogin);
router.post("/addVolunteer",isAuthenticated,addVolunteer);
router.post("/logout", logout);
router.get("/mladata", isAuthenticated,getmladata);
router.get("/volunteerData",isAuthenticated,getvolunteerData);
router.get('/volunteerCitizens',isAuthenticated,getVolunteerCitizens);
router.post("/addCitizen",isAuthenticated,addCitizen)
router.get('/citizenStats',getVotingStatsByAgeGroup);
router.get('/citizenStatsByCaste', getVotingStatsByCaste);
router.get('/votingInsightsByGender', getVotingStatsByGenderAndAge);
router.get('/mandalwiseVotingStats', getMandalwiseVotingStats);
router.get('/mandalwiseAgeGroupStats', getMandalwiseAgeGroupStats);
router.get('/mandalwiseCasteStats', getMandalwiseCasteStats);
router.get('/mandalwiseGenderAgeStats', getMandalGenderAgeStats);
router.post('/volunteer/changepassword',isAuthenticated,volunteerchangepassword);
router.post('/mlachangepassword', isAuthenticated, mlachangepassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/volunteers',getVolunteers);


export default router;