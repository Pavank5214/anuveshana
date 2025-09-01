const express = require ("express");
const Portfolio = require("../models/Portfolio");
const{protect,admin} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect,admin, async (req,res)=>{
    try{
        const{name,description, images,category} = req.body ;

        if (!name || !description || !category || !images || images.length === 0) {
            return res.status(400).json({ message: "All fields are required, including images" });
          }

        const portfolio = new Portfolio({
            name,
            description,
            images,
            category
        });

        const createdPortfolio = await portfolio.save();
        res.status(201).json(createdPortfolio);
    } catch (error){
        console.error("Error creating portfolio:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.put("/:id",protect,admin,async(req,res)=>{
    try {
        const {name,description, images,category} = req.body;

        const portfolio = await Portfolio.findById(req.params.id);

        if(portfolio){
            portfolio.name =  name || portfolio.name;
            portfolio.description = description || portfolio.description;
            portfolio.images = images || portfolio.images;
            portfolio.category = category || portfolio.category;

            const updatedPortfolio = await portfolio.save();
            res.json(updatedPortfolio);
        }else{
            res.status(404).json({message: "Portfolio not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.delete("/:id", protect , admin , async (req,res)=>{
    try{
        const portfolio = await Portfolio.findById(req.params.id);
        if(portfolio){
           await  portfolio.deleteOne();
            res.json("portfolio deleted");
        } else{
            res.status(404).json({message: "Portfolio not found"});
        }
    } catch(error){
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.get("/", async (req,res)=>{
    try {
        const portfolios = await Portfolio.find();
        res.json(portfolios);
    } catch (error) {
        console.error("Error fetching portfolios:", error.message);
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

router.get("/:id", async (req,res)=>{
    try {
        const portfolio = await Portfolio.findById(req.params.id);
        if(!portfolio){
            return res.status(404).json({messaage : "Portfolio not found"});
        }
        res.json(portfolio);
    } catch (error) {
        console.error("Error fetching portfolio:", error.message);
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
})
module.exports = router;