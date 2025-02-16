require('dotenv').config();
const express = require("express")
const app = express()
const path = require('path');
const hbs = require('hbs');
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const validator = require('validator');
const auth = require("./middleware/auth");

require("./db/conn");
const Member = require("./models/members");
const Booker=require("./models/bookers");
const { default: isEmail } = require('validator/lib/isEmail');
const port = process.env.PORT || 8000

const tempPath = path.join(__dirname, '../templates/hbs');
const partialPath = path.join(__dirname, '../templates/partials');
const staticPath = path.join(__dirname, '../public');
app.use(express.static(staticPath));

app.set('view engine', 'hbs');
app.set('views', tempPath);
hbs.registerPartials(partialPath);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.get('/', auth, (req, res) => {
    res.render('index', { login: req.user ? req.user.name.split(" ")[0] : 'Login',isAuthenticated:req.user?true:false })
})

app.get('/success', auth, (req, res) => {
    res.render('success', { isAuthenticated: req.user, login: req.user.name.split(" ")[0],username:req.user.name});
});

app.get('/book', auth,(req,res)=>{  
    res.render('book',{isAuthenticated: req.user, login: req.user.name.split(" ")[0],user_email:req.user.email,isBooked:true})
})

app.get('/bookDetails',auth,async(req,res)=>{
    const email=req.user.email
    const bookings=await Booker.find({email})
    // console.log(bookings);
    res.render('bookDetails',{isAuthenticated: req.user, login: req.user.name.split(" ")[0],bookings:bookings})
})

app.get('/edit',auth,async(req,res)=>{
    res.render('edit',{isAuthenticated: req.user, login: req.user.name.split(" ")[0],fname:req.user.name,useremail:req.user.email})
})

app.get('/login', (req, res) => {
    if (req.cookies.jwt) {
        return res.redirect('/success');
    }
    res.render('login', { login: 'Login' })
})

app.get('/signUp', (req, res) => {
    if (req.cookies.jwt) {
        return res.redirect('/');
    }
    res.render('signUp', { login: 'Login' })
})

app.get('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token !== req.token;
        });
        res.clearCookie("jwt");
        await req.user.save();
        console.log("Logout Successful!");
        res.redirect('/');
    } catch (e) {
        res.status(500).send(e);
    }
});
app.post('/cancel',auth,async(req,res)=>{
    const useremail=req.user.email
    const {email,stype,date,time}=req.body
    await Booker.findOneAndDelete({email,stype,date,time})

    const bookings=await Booker.find({email:useremail})
    res.render('bookDetails',{isAuthenticated: req.user, login: req.user.name.split(" ")[0],bookings:bookings,success:"Booking Cancelled!"})

})


app.post('/signUp', async (req, res) => {
    try {
        const { password, cpassword, email } = req.body;

        const existingUser = await Member.findOne({ email });

        if (password !== cpassword) {
            return res.render("signUp", { error: "Passwords do not match!" });
        } else if (!validator.isEmail(email)) {
            return res.render("signUp", { error: "Invalid email format!" });
        } else if (existingUser) {
            return res.render("signUp", { error: "Email already exists!" });
        }

        const newMember = new Member({
            name: req.body.name,
            email,
            password
        });

        await newMember.save();
        res.status(201).render('signUp',{success:"You have successfully signed up to our gym. Login to book sessions!",login:"Login"})

    } catch (e) {
        res.status(500).send(e);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const userEmail = await Member.findOne({ email });

        if (!userEmail) {
            return res.render("login", { error: "Email not found!" ,login:"Login"});
        }

        const isMatch = await bcrypt.compare(password, userEmail.password);

        if (!isMatch) {
            return res.render("login", { error: "Invalid login details!",login:"Login"});
        } 


        const token = await userEmail.generateToken();
        res.cookie("jwt", token, { expires: new Date(Date.now() + 3600000), httpOnly: true });

        res.status(201).render("success", { 
            isAuthenticated: true, 
            success: "Login successful!", 
            login: userEmail.name.split(" ")[0],
            username:userEmail.name
        });
    } catch (e) {
        res.status(400).render("login", { error: "Invalid login details!",login:"Login"});
    }
});

app.post('/book', auth,async(req,res)=>{
    try{
        const {email,phone,gender,state,city,stype,date,time}=req.body
        const existingBooking=await Booker.findOne({email,date,time})
        const existingSession=await Booker.findOne({email,stype,date})
        if(existingBooking){
            return res.render('book',{error:'You have already booked a session at this time!',login:req.user.name.split(" ")[0],user_email:req.user.email,isBooked:true})
        }
        else if(existingSession){
            return res.render('book',{error:`You can only book one ${stype} session per day!`,login:req.user.name.split(" ")[0],user_email:req.user.email,isBooked:true})
        }
        const newBooker = new Booker({
            fullname:req.body.name,email,phone,gender,state,city,stype,date,time
        });
        
        await newBooker.save();
        res.status(201).render('book',{success:`You have successfully booked a session on ${stype}!`,login:req.user.name.split(" ")[0],user_email:req.user.email,isBooked:true})
    }
    catch(e){
        res.status(500).send(e);
    }
})

app.post('/edit',auth,async(req,res)=>{
    try{
        const userEmail=req.user.email
        const { password, cpassword, email } = req.body;
       
        if(password){
            if (password !== cpassword) {
                return res.render("edit", { error: "Passwords do not match!",isAuthenticated: req.user, login: req.user.name.split(" ")[0],fname:req.user.name,useremail:req.user.email });
            }
        }
        if(email){
            if (!validator.isEmail(email)) {
                return res.render("edit", { error: "Invalid email format!",isAuthenticated: req.user, login: req.user.name.split(" ")[0],fname:req.user.name,useremail:req.user.email });
            }
            const existingUser = await Member.findOne({ email });
            if (existingUser) {
                return res.render("edit", { error: "Email already exists!",isAuthenticated: req.user, login: req.user.name.split(" ")[0],fname:req.user.name,useremail:req.user.email });
            }
        }
        
        const updatedFields = {};
        Object.entries(req.body).forEach(([key, value]) => {
            //key = "name"; updatedFields."key"="value"  is worng
            if (value) {
                updatedFields[key]=value
            }
        });
        const updatedUser = await Member.findOneAndUpdate(
            { email: userEmail },
            { $set: updatedFields },
            { new: true }
        );
        const token = await updatedUser.generateToken(); // ✅ Now `updatedUser` is a document
        res.cookie("jwt", token, { expires: new Date(Date.now() + 3600000), httpOnly: true });

        res.render('edit',{isAuthenticated: req.user, login: req.user.name.split(" ")[0],fname:req.user.name,useremail:req.user.email,success:"Profile was updated successfully!"})  
        //{ $set: { key: value } } will literally create a field named "key" in the document instead of updating the actual field.
    }
    catch(e){
        res.status(500).send(e);
    }

})

app.listen(port, () => {
    console.log(`Connection set at ${port}`);
})