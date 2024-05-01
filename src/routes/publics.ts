import express from "express";
import PublicController from "../controllers/public-controller";
import isAuthenticated from "../middlewares/isAuthenticated";

const publics = express.Router();

publics.post("/register", PublicController.register);

publics.post("/login", PublicController.login);

publics.post("/google-login", PublicController.googleSignIn);

publics.get("/types", PublicController.getTypes);

publics.get("/lodgings", PublicController.getLodgings);

publics.get("/lodgings/:id", PublicController.getLodgingById);

publics.use(isAuthenticated);

publics.post(
  "/generate-midtrans-token/:lodgingId",
  PublicController.generateMidtransToken
);

publics.get("/bookmarks", PublicController.getBookmarks);

publics.post("/bookmarks/:LodgingId", PublicController.addBookmark);

publics.delete("/bookmarks/:LodgingId", PublicController.deleteBookmark);

export default publics;
