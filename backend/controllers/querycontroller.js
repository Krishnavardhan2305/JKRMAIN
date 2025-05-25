import cloudinary from "../utils/Cloudinary.js";
import * as queryService from "../services/queryServices.js";
import getDataUri from "../utils/getdatauri.js";

export const raiseQueryController = async (req, res) => {
  try {
    const { issue, position } = req.body;
    const userID = req.id;
    let imageUrl = null;

    if (!issue) {
      return res.status(400).json({ message: "Issue is required" });
    }

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const uploadResult = await cloudinary.uploader.upload(fileUri.content);
      imageUrl = uploadResult.secure_url;
    }

    const result = await queryService.reportQuery(userID, position, issue, imageUrl);

    res.status(201).json({
      message: "Query raised successfully",
      query: result,
    });
  } catch (error) {
    console.error("Error in raiseQueryController:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getqueries = async (req, res) => {
  try {
    const queries = await queryService.getqueries();
    return res.status(200).json({
      queries,
      success: true,
      message: "Returned queries successfully"
    });
  } catch (error) {
    console.log("Error in getting queries", error);
    res.status(500).json({
      message: "Internal Server Error"
    });  
  }
};
