const express = require('express')
const router = express.Router();
const Article = require('../models/article')


/*
! Route: /articles/new
* Method: GET
? Description: render the "new article" page
*/
router.get('/new', (req,res) => {
 res.render('articles/new', {article: new Article()})
})


/*
 ! Route: /articles/:slug
 * Method: GET
 ? Description: find the article that matches the "slug" parameter in the 
 ? req.params
*/
router.get('/:slug', async (req,res)=>{
 const article = await Article.findOne({slug: req.params.slug})
 if(article == null){
  res.redirect('/')
 }
 res.render('articles/show', {article: article})
})

/*
 ! Route: /articles
 * Method: POST
 ? Description: calls the save_and_redirect middleware with "new" as the path 
 ? argument. Creates a new article and saves it to DB 
*/
router.post('/', async (req, res, next) => {
 req.article= new Article()
 next()
}, save_and_redirect('new'))



/*
 ! Route: /articles/edit/:id
 * Method: GET
 ? Description: fetches article with the ID that matches the req.params.id
 ? and renders the editor page.
*/
router.get('/edit/:id', async (req, res) => {
 const article = await Article.findById(req.params.id)
 if(!article){
  res.redirect('views/errors/err404.ejs')
 }
 res.render('articles/edit', {article:article})
})



/*
 ! Route: /articles/:id
 * Method: PUT
 ? Description: fetches the article with the ID that matches the req.params.id
 ? and calls the save_and_redirect 
*/
router.put('/:id', async(req, res, next)=>{
 try{
  const article = await Article.findById(req.params.id)
  if(!article){
   res.redirect('/')
  }
  req.article = article
  next()

 }catch(e){
  console.log('PUT failed at /articles/:id ❌')
 }
}, save_and_redirect('edit'))

/*
 ! Route: /articles/:id
 * Method: DELETE
 ? Description: finds the article in the db that matches tHe req.params.id
 ? and deletes it. Redirects the user to the index page. 
*/
router.delete('/:id', async(req,res)=>{
 await Article.findByIdAndDelete(req.params.id)
 res.redirect('/')
})

/*
*/
function save_and_redirect(path){
 //return async function
 return async (req, res) => {
  //get requested article
  let article = req.article
  
  //update the article properties
  article.title = req.body.title
  article.description = req.body.description
  article.markdown = req.body.markdown
  
  /* attempt to save... 
  * SUCCESS -> redirect to the article "show" page
  ! ERROR -> log the error and reload page with form data filled. 
  TODO: Respond with an error message to the user. 
  */
  try {
   article = await article.save()
   res.redirect(`/articles/${article.slug}`)
  } catch (e) {
   console.error(`POST failed at /articles/:id ❌  for the path ${path}`)
   console.error(e)
   console.log(`articles/${path}/${article.slug}`)
   res.render(`articles/${path}/${article.slug}` ,{article: article})
  }
 }
}
module.exports = router;
