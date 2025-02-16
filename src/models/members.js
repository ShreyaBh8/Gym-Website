const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken")
const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        trim:true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})


memberSchema.methods.generateToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY, { expiresIn: "7d" });
        this.tokens = this.tokens.concat({ token });
        await this.save();
        return token;
    }
    catch (e) {
        console.error("Token Generation Error:", e);
    }
}

memberSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const Member = new mongoose.model("Member", memberSchema)
module.exports = Member