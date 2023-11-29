// 3
const express= require("express");
const bcrypt = require("bcrypt");
const {auth, authAdmin} = require("../middlewares/auth");
const {UserModel,validUser, validLogin,createToken} = require("../models/userModel")
const router = express.Router();

router.get("/" , async(req,res)=> {
  res.json({msg:"Users work"})
})

// אזור שמחזיר למשתמש את הפרטים שלו לפי הטוקן שהוא שולח
router.get("/myInfo",auth, async(req,res) => {
  try{
    let userInfo = await UserModel.findOne({_id:req.tokenData._id},{password:0});
    res.json(userInfo);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }  
})

// רק משתמש אדמין יוכל להגיע ולהציג את רשימת 
// כל המשתמשים
router.get("/usersList", authAdmin , async(req,res) => {
  try{
    let data = await UserModel.find({},{password:0});
    res.json(data)
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }  
})



router.post("/", async(req,res) => {
  let validBody = validUser(req.body);
  // במידה ויש טעות בריק באדי שהגיע מצד לקוח
  // יווצר מאפיין בשם אירור ונחזיר את הפירוט של הטעות
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = new UserModel(req.body);
    // נרצה להצפין את הסיסמא בצורה חד כיוונית
    // 10 - רמת הצפנה שהיא מעולה לעסק בינוני , קטן
    user.password = await bcrypt.hash(user.password, 10);

    await user.save();
    user.password = "***";
    res.status(201).json(user);
  }
  catch(err){
    if(err.code == 11000){
      return res.status(500).json({msg:"Email already in system, try log in",code:11000})
       
    }
    console.log(err);
    res.status(500).json({msg:"err",err})
  }
})


// שינוי בלוג אין אנחנו שולחים גם רול בקייאט טוקן
router.post("/login", async(req,res) => {
  let validBody = validLogin(req.body);
  if(validBody.error){
    // .details -> מחזיר בפירוט מה הבעיה צד לקוח
    return res.status(400).json(validBody.error.details);
  }
  try{
    // קודם כל לבדוק אם המייל שנשלח קיים  במסד
    let user = await UserModel.findOne({email:req.body.email})
    if(!user){
      return res.status(401).json({msg:"Password or email is worng ,code:1"})
    }
    // אם הסיסמא שנשלחה בבאדי מתאימה לסיסמא המוצפנת במסד של אותו משתמש
    let authPassword = await bcrypt.compare(req.body.password,user.password);
    if(!authPassword){
      return res.status(401).json({msg:"Password or email is worng ,code:2"});
    }
    // מייצרים טוקן לפי שמכיל את האיידי של המשתמש
    let token = createToken(user._id,user.role);
    res.json({token});
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

module.exports = router;