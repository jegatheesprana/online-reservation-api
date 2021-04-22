const Company = require('../models/Company');

const get_companies = (req, res) => {
    Company.find()
        .then(result => {
            res.json(result)
        })
        .catch(console.log);
}

const create_company = (req, res) => {
    const { name, address, num, city, postal, supplier, rep, repNum } = req.body;
    const company = new Company({
        name, address, num, city, postal, supplier, rep, repNum
    })
    company.save()
        .then(result => {
            res.send(result)
        })
        .catch(console.log);
}

const delete_company = (req, res) => {

}

module.exports = {
    get_companies,
    create_company
}