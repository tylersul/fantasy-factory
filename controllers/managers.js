const Manager              = require('../models/manager');

module.exports.index = async (req, res) => {
  const managers = await Manager.find({});
  res.render("managers/index", { managers });
}

module.exports.getNewForm = (req, res) => {
  res.render('managers/new');
}

module.exports.postManager = async (req, res) => {
  const manager = new Manager(req.body.manager);
  manager.author = req.user._id;
  manager.images = req.files.map(f => ({url: f.path, filename: f.filename}));
  await manager.save();
  req.flash('success', 'Successfully created new manager.');
  res.redirect(`/managers/${manager._id}`);
}

module.exports.getManager = async (req, res) => {
  const manager = await Manager.findById(req.params.id).populate('author');
  if (!manager) {
    req.flash('error', 'Manager not found.');
    return res.redirect('/managers');
  }
  res.render('managers/show', { manager });
}

module.exports.putManagers = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const manager = await Manager.findByIdAndUpdate(id, { ...req.body.manager });
  const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
  manager.images.push(...imgs);
  await manager.save();
  req.flash('success', 'Successfully updated manager.');
  res.redirect(`/managers/${manager._id}`)
}

module.exports.getEditForm = async (req,res) => {

  const manager = await Manager.findById(req.params.id);

  if (!manager) {
    req.flash('error', 'Manager not found.');
    return res.redirect('/managers');
  }

  res.render('managers/edit', { manager })
}

module.exports.deleteManager = async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  console.log(id);
  await Manager.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted manager.');
  res.redirect('/managers');
}