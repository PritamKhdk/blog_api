const { get } = require('http');
const Blog = require('../models/blog_model');

const getBlogs = async (req, res) => {
  try {
    const { search = '', tag = '', sort = 'asc' } = req.query;

    const filter = {};
    if (search.trim()) {
      filter.title = { $regex: new RegExp(search.trim(), 'i') };
    }
    if (tag.trim()) {
      filter.tags = tag.trim();
    }

    const sortOrder = sort.toLowerCase() === 'desc' ? -1 : 1;

    const blogs = await Blog.find(filter)
      .sort({ title: sortOrder })
      .lean();

    res.json({ data: blogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
} 

const createBlog = async (req, res) => {
  try {
    const { title, description, tags, comments} = req.body;
    if (!title || !description) {
      return res.status(400).json({
        message: 'Both title and description are required'
      });
    }
    const blog = await Blog.create({ title, description, tags, comments });
    return res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateBlog =async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!blog) {            
            return res.status(404).json({ message: 'Blog not found' });
        }                               
        res.status(200).json(blog);
    } catch (error) {               
        res.status(400).json({ message: error.message });
    }
}
const deleteBlog= async (req, res) => {
  try {             
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {                                
        return res.status(404).json({ message: 'Blog not found' });
        }
    res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {       

    res.status(500).json({ message: error.message });
    }   
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, text } = req.body;

    if (!user || !text) {
      return res.status(400).json({ message: 'User and text are required' });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.comments.push({ user, text });
    await blog.save();

    res.status(201).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const { text } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    comment.text = text;
    await blog.save();

    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    blog.comments.pull(commentId); // <-- change here
    await blog.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.json(blog.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBlogs,getBlogById,updateBlog,deleteBlog,createBlog,addComment,deleteComment,updateComment,getComments
};