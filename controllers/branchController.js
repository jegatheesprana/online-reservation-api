const Branch = require('../models/Branch');

const getBranches = (req, res) => {
    Branch.find()
        .then(result => {
            res.json(result)
        })
        .catch(console.log);
}

const createBranch = (req, res) => {
    const { name, address, num, city, postal, supplier, rep, repNum } = req.body;
    const branch = new Branch({
        name, address, num, city, postal, supplier, rep, repNum
    })
    branch.save()
        .then(result => {
            res.send(result)
        })
        .catch(console.log);
}

const deleteBranch = (req, res) => {
    const { id } = req.params;
    // delete
}

module.exports = {
    getBranches,
    createBranch,
    deleteBranch
}