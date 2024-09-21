const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBookByIsbn = (isbn) =>{
  return new Promise((resolve,reject)=>{
   const bookDetails = books[isbn] 
   if(bookDetails)
    {
      resolve(bookDetails)
    }
    else{
      reject()
    }
  })
}
const getAllBooks = () =>{
  return new Promise((resolve,reject)=>{
   const bookDetails = books
   if(bookDetails)
    {
      resolve(bookDetails)
    }
    else{
      reject()
    }
  })
}
const getBooksByAuthor = (author)=>{
  return new Promise((resolve,reject)=>{
    const bookDetails = []
    for(const book in books){
      if(books[book].author.toLowerCase() == author.toLowerCase())
      {
        bookDetails.push(books[book]) 
      }
    }
    if(bookDetails)
    {
      resolve(bookDetails)
    }else{
      reject()
    }
  })
}
const getBooksByTitle = (title)=>{
  return new Promise((resolve,reject)=>{
    const bookDetails = []
    for(const book in books){
      if(books[book].title.toLowerCase() == title.toLowerCase())
      {
        bookDetails.push(books[book]) 
      }
    }
    if(bookDetails)
    {
      resolve(bookDetails)
    }else{
      reject()
    }
  })
}
public_users.post("/register", (req,res) => {
  
  const {username,password} = req.body 

  if(isValid(username))
  {
    users.push({id: users.length ,username: username,password : password})
    return res.status(200).json({message: "Successfully registered"})
  }else{
    return res.status(400).json({message: "Username already exists"})
  }

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {

  getAllBooks().then(data=>{
    return res.status(200).json(data)
  })
  .catch(
    ()=>{
      return res.status(400).json({message: 'Cannot get all books'})
    }
  )

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  const isbn = req.params.isbn 
  getBookByIsbn(isbn)
  .then(data=>{
    return res.status(200).json(data)
  })
  .catch(()=>{
    return res.status(400).json({message: 'Invalid isbn code'})
  })

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  const author = req.params.author 
  getBooksByAuthor(author)
  .then(data=>{
    return res.status(200).json(data)
  })
  .catch(()=>{
    return res.status(400).json({message: 'Cannot get books by author'})
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title 
  getBooksByTitle(title)
  .then(data=>{
    return res.status(200).json(data)
  })
  .catch(()=>{
    return res.status(400).json({message: 'Cannot get books by title'})
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn 
  const bookDetails = books[isbn] 
  if(bookDetails)
  {
    return res.status(200).json({reviews: bookDetails.reviews})
  }

  return res.status(400).json({message: "ISBN not found"});
});

module.exports.general = public_users;
