import express from "express";
import{protect} from "../middleware/authMiddleware.js";
import{getSongs,getPlaylistByTag,toggleFavourite}from "../authController/songController.js";
const songRouter=express.Router();

songRouter.get("/",getSongs);
songRouter.get("/playListByTag/:tag",getPlaylistByTag);
songRouter.get("/favourite",protect,toggleFavourite);
songRouter.get("/favourites",protect,(req,res)=>
{
    res.json(req.user.favoutites);
});
export default songRouter;
