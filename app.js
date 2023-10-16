require('dotenv').config()
const express =  require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')
 console.log(process.env.API_KEY);
 
const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs')
app.use(express.static('public'))

mongoose.connect('mongodb://127.0.0.1:27017/userDB?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1')

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema)


app.get('/', (req, res) => {
    res.render('home')
})

app.route('/register')
    .get( (req, res) => {
        res.render('register')
    })
    .post( (req,res) =>{
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        })
        
        newUser.save().then( () => {
            res.render('secrets')
        })

    })



app.route('/login')
    .get( (req, res) => {
        res.render('login')
    })
    .post( (req, res) => {
        const username = req.body.username
        const password = req.body.password;

        User.findOne({email: username}).then( (i) => {
            if (i){
                if(i.password === password){
                    res.render('secrets')
                } else{
                    console.log('noo');
                    res.redirect('/login')
                }
            } else{
                console.log('error');
                res.redirect('/login')
            }

            // console.log(i.password === password);
            // console.log(username);
            // console.log(password);

        }) 
    })


app.listen( process.env.PORT || 3000, ()=>{
    console.log('Listening on port 3000');
})