require('dotenv').config();
const methodOverride = require('method-override')

//bring in express
const express = require('express')
const app = express()

//bring in mongo
const connectMongo = require('./dbconfig/connect');
const Article = require('./models/article');
connectMongo();



//set the view engine to ejs
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))

app.get('/', async (req,res)=>{
 const articles = await Article.find({}).sort({
  createdAt: 'desc'
 })
 res.render('articles/index', {articles: articles})
})

app.use('/articles', require('./routes/articles'))


app.listen(5000, ()=>{console.log('🚀 Server listening On port 5000')})