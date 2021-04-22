const Product = require('../models/Product');
const Invoice = require('../models/Invoice');

const getProducts = (req, res) => {
    Product.aggregate([
        {
            $lookup: {
                from: "companies",
                as: '_company',
                localField: 'company',
                foreignField: '_id'
            }
        },
        {
            $unwind: '$items'
        },
        {
            $project: {
                _id: 0,
                title: { $concat: ["$title", ' ', "$items.title", ": ", '$items.weight'] },
                //title: { $concat: ["$title", ": ", '$items.weight', ': ', { $substr: ["$items.mrp", 0, 128] }, 'Rs'] },
                productId: '$_id',
                company: { $arrayElemAt: ['$_company.name', 0] },
                companyId: { $arrayElemAt: ['$_company._id', 0] },
                itemId: '$items._id',
                mrp: { $concat: [{ $substr: ["$items.mrp", 0, 128] }, 'Rs'] },
                status: '$items.status',
                item: '$items'
            }
        }
    ])
        .then(result => res.json(result))
        .catch(console.log)
};

module.exports = {
    getProducts,
}