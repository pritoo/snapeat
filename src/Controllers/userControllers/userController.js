const mongoose = require('mongoose');
const User = require("../../Models/userModels/userModel");
const catchAsync =require("../../Middlewares/catchAsyncError");
const auth =require("../../Middlewares/auth");
//const sendToken = require("../../utils/jwtToken")
const bcrypt = require('bcryptjs');
const jwt =require("jsonwebtoken")


//signup user
exports.registerUsers = catchAsync(async(req, res,next) => {

    //const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //console.log(hashedPassword,"test")
    const singupRecords = new User({
        //id:req.body.id,
        name: req.body.name,
        email: req.body.email,
        contact_no :req.body.contact_no,
        password: hashedPassword,
        insta_name:req.body.insta_name,
        food_blogger:req.body.food_blogger,
        profile_id:req.file,
        status: true,
        is_registered: true,
        type: 'user',
    
      });

      //sendToken(User,res.status(200));
      
        const check = await User.findOne({ email: req.body.email });
        if (check !== null) {
          res.status(400).json({
            status: false,
            message: 'Email already exist',
         
          });
        } else {
          await singupRecords.save();
          //console.log(singupRecords,"hello");
          res.status(200).json({
            status: true,
            message: 'Successfully Signed up',
            results: singupRecords,
          });
        }
    
        //res.status(400).json(err.message);
      
})

//all user details
exports.getAllUser= catchAsync(async (req, res, next) => {

  const users = await User.find();

  res.status(200).json({
    status:true,
    success:true,
    result:users
  })
})

//user details
exports.getUserDetails = catchAsync(async(req, res, next) => {
  const id = req.user.id;
 //console.log(id,"hello");
 //console.log(req.body,"test");
  const user =await User.findById(req.user.id);
  //console.log("id--",req.user)
  res.status(200).json({
    'statusCode':'200',
    status:true,
    success:true,
    result:user
  })
});

//update user profile
exports.updateUserProfile = catchAsync(async (req, res) => {
    const id = req.user.id;
    //console.log(req.file.originalname);

    const prefrences = [];
    
  
    let dietary=req.body.dietaryandothers;
    console.log(dietary,".....dietary")
    let dietary_id = dietary.split(',')
    prefrences.push(dietary_id);

    let ingrediant=req.body.fav_ingrediants;
    let ingrediant_id=ingrediant.split(',')
    prefrences.push(ingrediant_id);

    let dislike_ingrediants=req.body.dislike_ingrediants;
    let dislike_ingrediant_id=dislike_ingrediants.split(',')
    //const splitlevel=split(dietary,ingrediant,dislike_ingrediants,',')
    prefrences.push(dislike_ingrediant_id);
    //console.log(splitlevel)
   
    console.log(prefrences);
    prefrences.save();

    //const address=req.body.address
    
    const updateUserDetails = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        contact_no :req.body.contact_no,
        //password: req.body.password,
        insta_name:req.body.insta_name,
        food_blogger:req.body.food_blogger,
        profile_id:req.file.originalname,
        // address:req.body.address
      },
     
      { new: true }
      
    );

    
    res.status(200).json({
      status: true,
      message: 'Successfully userdetails details',
      results: updateUserDetails,
    });
 
    //res.status(400).json("profile not updated");
  
});


exports.changePassword = async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id)
  console.log(req.params.id)
  if(req.body.current_Password){
  try {
    const databasePassword = await User.findOne({_id:id});
  
    // const hashedPassword = await bcrypt.hash(req.body.new_Password, 10)
    const validPassword =  bcrypt.compare(req.body.current_Password, databasePassword.password);
    console.log(validPassword ,"validPassword")
    if (validPassword) {
      const hashedPassword = await bcrypt.hash(req.body.new_Password, 10);
      const results = await User.findByIdAndUpdate({_id:id}, { password: hashedPassword });
      res.status(200).json({
        status: true,
        message: 'Successfully Updated Password',
        results: results,
      });
    } else {
      res.status(400).json({
        status: false,
        message: 'Entered Current Password is wrong',
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'Password update failed',
      error: error,
    });
  }

}else{
  if(req.body.new_Password == req.body.confirm_password){
    const hashedPassword = await bcrypt.hash(req.body.new_Password, 10);
      const results = await User.findByIdAndUpdate({_id:id}, { password: hashedPassword });
      if(results){
      res.status(200).json({
        status: true,
        message: 'Successfully revived Password',
        results: results,
      });}
      else {
        res.status(400).json({
          status: false,
          message: 'Something went  wrong',
        });
      }
  } else {
    res.status(400).json({
      status: false,
      message: 'Password does not match',
    });
  }
}};


//logIn user
exports.logIn = async (req, res) => {
  try {
    const check = await User.findOne({ email: req.body.email });
   
    if (check === null) {
      res.status(400).json({
        status: false,
        message: 'Email is wrong',
      });
    } else {
      const validPassword =  bcrypt.compare(req.body.password, check.password);
      if (validPassword) {
        const payload = {
          email: req.body.email,
          id: check.id,
        };
      
        let envsecret = auth.getSecretToken();
        let token = jwt.sign(payload, envsecret);
        //console.log("token---",token)
      //   res.cookie('access_token', token, {
      //     httpOnly: true,
      //   }
      //  );
       

        res.status(200).json({
          status: true,
          message: 'Successfully Signed in',
          //user_type: check.user_type,
          token: token,
          result: check,
        });
      } else {
        res.status(400).json({
          status: false,
          message: 'password is wrong',
        });
      }
    }
  }
   catch (err) {
    res.status(400).json(err.message);
  }
};


//Logout user
exports.logOut = catchAsync(async (req, res, next) => {
  res.clearCookie("token", null, {
    //expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    status:true,
    success: true,
    message: "logged out",
  });
});



