const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurifiy = require('dompurify')
const { JSDOM } = require('jsdom')

const dompurify = createDomPurifiy(new JSDOM().window)

const ArticleSchema = new mongoose.Schema({
 title: {
  type:String,
  required: true
 },
 description: {
  type: String,
 },
 markdown:{
  type: String,
  required: true
 }, 
 createdAt: {
  type: Date, 
  default: Date.now
 },
 slug:{
  type: String,
  require: true,
  unique: true
 },
 sanitizedHtml: {
  type: String, 
  required: true,

 }
})

ArticleSchema.pre('validate', function(){
 if(this.title){
  this.slug = slugify(this.title,{lower: true, strict: true})
 }

 if(this.markdown){
  this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
 }
 
})

module.exports = mongoose.model('Article', ArticleSchema)