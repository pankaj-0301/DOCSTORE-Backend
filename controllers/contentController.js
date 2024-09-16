const Content = require('../models/Content');

// Save content to MongoDB
exports.saveContent = async (req, res) => {
  const {title, content, timestamp } = req.body;
  try {
    const newContent = new Content({ title,content, timestamp });
    const savedContent = await newContent.save();
    res.status(201).json({ id: savedContent._id.toString() });
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ error: 'Failed to save content' });
  }
};

// Retrieve content from MongoDB
exports.getContentById = async (req, res) => {
  const { id } = req.params;
  try {
    const document = await Content.findById(id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ title: document.title, content: document.content });
  } catch (error) {
    console.error('Error retrieving content:', error);
    res.status(500).json({ error: 'Failed to retrieve content' });
  }
};
