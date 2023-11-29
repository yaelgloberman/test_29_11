// 5
const express= require("express");
const { auth } = require("../middlewares/auth");
const {CakesModel,validateCake} = require("../models/cakeModel")
const router = express.Router();

router.get("/" , async(req,res)=> {
  let perPage = req.query.perPage || 5;
  let page = req.query.page || 1;

  try{
    let data = await CakesModel.find({})
    .limit(perPage)
    .skip((page - 1) * perPage)
    // .sort({_id:-1}) like -> order by _id DESC
    .sort({_id:-1})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

// /cakes/search?s=
router.get("/search",async(req,res) => {
  try{
    let queryS = req.query.s;
    // מביא את החיפוש בתור ביטוי ולא צריך את כל הביטוי עצמו לחיפוש
    // i -> מבטל את כל מה שקשור ל CASE SENSITVE
    let searchReg = new RegExp(queryS,"i")
    let data = await CakesModel.find({name:searchReg})
    .limit(50)
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

router.post("/", auth,async(req,res) => {
  let validBody = validateCake(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let cake = new CakesModel(req.body);
    // add the user_id of the user that add the cake
    cake.user_id = req.tokenData._id;
    await cake.save();
    res.status(201).json(cake);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

// האדמין יוכל לערוך את כל הרשומות ויוזרים יוכלו לערוך רק את של עצמם
router.put("/:editId",auth, async(req,res) => {
  let validBody = validateCake(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let editId = req.params.editId;
    let data;
    if(req.tokenData.role == "admin"){
      data = await CakesModel.updateOne({_id:editId},req.body)
    }
    else{
       data = await CakesModel.updateOne({_id:editId,user_id:req.tokenData._id},req.body)
    }
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})


// האדמין יוכל למחוק את כל הרשומות ויוזרים יוכלו למחוק רק את של עצמם

router.delete("/:delId",auth, async(req,res) => {
  try{
    let delId = req.params.delId;
    let data;
    // אם אדמין יכול למחוק כל רשומה אם לא בודק שהמשתמש
    // הרשומה היוזר איי די שווה לאיי די של המשתמש
    if(req.tokenData.role == "admin"){
      data = await CakesModel.deleteOne({_id:delId})
    }
    else{
      data = await CakesModel.deleteOne({_id:delId,user_id:req.tokenData._id})
    }
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

module.exports = router;