const express = require("express");
const router = express.Router();    


const { getBlogs, getBlogById, createBlog, updateBlog,deleteBlog,addComment,getComments,updateComment,deleteComment} = require('../controller/blog_controller');


router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/',createBlog)
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);
router.get('/:blogId/comments', getComments);
router.post('/:id/comments', addComment);
router.put('/:blogId/comments/:commentId', updateComment);
router.delete('/:blogId/comments/:commentId', deleteComment);       

module.exports = router;

