const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  if(users.some(user=>user.username === username))
  {
    return false;
  }
  return true;
}

const authenticatedUser = (username,password)=>{ 
  
  if(users.some(user=>user.username === username && user.password === password))
  {
    return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username,password} = req.body 
  if(authenticatedUser(username,password))
  {
    const user = users.find(user=>user.username === username)
    const jwtToken = jwt.sign({username: username,id: user.id},'pctien1401',{expiresIn: 60*60});
    req.session.Authorization = { token : jwtToken } 
    return res.status(200).json({message: 'Login successfully'})
  }else{
    return res.status(400).json({message: 'Invalid username or password'})
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn 
  const review = req.body
  const user = req.user
  for(const book in books)
  {
    if(book === isbn )
    {
      const numberOfReviews = Object.keys(books[book].reviews).length;
      books[book].reviews[numberOfReviews] = {
        userId : user.id ,
        message : review.message
      } 
      return res.status(200).json({message: 'Review successfully'})
    }
  }
  return res.status(400).json({message: 'Invalid isbn code'})
});


regd_users.delete("/auth/review/:isbn",(req,res)=>{
  const isbn = req.params.isbn 
  const user = req.user 
  for(const book in books)
  {
    if(book === isbn){
      const reviews = books[book].reviews 
      for(const review in reviews)
      {
        if(reviews[review].userId === user.id)
        {
          delete reviews[review]
          return res.status(200).json({message: 'Delete successfully'})
        }
      }
    }
  }
  return res.status(400).json({message: 'Delete failed'})
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
