const Project = require('../models/projectModel');

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
    return res.json({ statusCode: 200, data: projects, message: 'Success' });
  } catch (err) {
    console.error('getProjects error', err);
    return res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const payload = {
      title: req.body.title || 'Untitled',
      link: req.body.link || '',
      desciption: req.body.desciption || req.body.description || '',
      image: req.body.image || '/images/kitten.png',
      author: req.body.author || 'Anonymous'
    };
    const project = new Project(payload);
    await project.save();
    return res.json({ statusCode: 201, data: project, message: 'Created' });
  } catch (err) {
    console.error('createProject error', err);
    return res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }
};
