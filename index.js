import express from "express";
import bodyParser from "body-parser";
import {connect, Schema, model} from 'mongoose';

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"))

connect("mongodb+srv://kikihid:k1k1jug4@cluster0.6agdokk.mongodb.net/blogDB", {useNewUrlParser: true })

const blogSchema = new Schema({
  title: String,
  author: String,
  main: String
})

const BlogModel = model("Blog", blogSchema)

const defaultSchema = new BlogModel({
  title: "Hello",
  author: "Daily",
  main: "Welcome to Daily! here you can write anything in your head to post and to be seen by everybody! Let's start creating yours!"
})

const defaultSchema2 = new BlogModel({
  title: "Tutorial",
  author: "Daily",
  main: "To create a new journal, click the button on top left in the navbar, then click 'insert', then you can write the title and something you want to post."
})

const defaultPost = [defaultSchema, defaultSchema2]

app.get("/", async (req, res) => {
  const journals = await BlogModel.find({})
  if (journals.length === 0) {
    await BlogModel.insertMany(defaultPost)
    res.redirect("/")
  } else {
    res.render("index.ejs", { arr: journals })
  }
})

app.get("/insert", (req, res) => {
  res.render("insert.ejs")
})

app.get("/about", (req, res) => {
  res.render("about.ejs")
})

app.post("/", async (req, res) => {
  const newPost = new BlogModel({
    title: req.body.title,
    author: req.body.author,
    main: req.body.post
  })
  await newPost.save()
  const journals = await BlogModel.find({})
  res.render("index.ejs", { arr: journals })
})

app.post("/delete", async (req, res) => {
  const storyId = req.body.id
  await BlogModel.deleteOne({ _id: storyId })
  res.redirect("/")
})

// for (let i = 0; i < journals.length; i++) {
//   let newUrl = journals[i].title.replaceAll(' ', '-')
//   app.get(`/${newUrl}`, (req, res) => {
//     res.render("more.ejs", { title: journals[i].title, post: journals[i].main })
//   })
// }

app.get("/:postTitle", async (req, res) => {
  const param = req.params.postTitle.replaceAll(' ', '').toLowerCase()
  const journals = await BlogModel.find({})
  journals.forEach(element => {
    if (param === element.title.replaceAll(' ', '').toLowerCase()) {
      res.render("more.ejs", { title: element.title, post: element.main, author: element.author, id: element._id})
    }
  })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})