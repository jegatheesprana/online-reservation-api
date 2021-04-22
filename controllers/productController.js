const Product = require('../models/Product');

const index = (req, res) => {
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

const details = (req, res) => {
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
            $unwind: '$_company'
        }
    ])
        .then(result => res.json(result))
        .catch(console.log)
};

const productItems = (req, res) => {
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
                title: { $concat: ["$title", ": ", '$items.weight', ': ', { $substr: ["$items.mrp", 0, 128] }, 'Rs'] },
                productId: '$_id',
                company: { $arrayElemAt: ['$_company.name', 0] },
                companyId: { $arrayElemAt: ['$_company._id', 0] },
                itemId: '$items._id',
                item: '$items'
            }
        }
    ])
        .then(result => res.json(result))
        .catch(console.log)
};

const createPost = async (req, res) => {
    const { title, company, products } = req.body;
    const product = new Product({
        title, company, items: products
    })
    product.save()
        .then(() => {
            res.json('success')
        })
        .catch(console.log);
}

const detail = async (req, res) => {
    const { id } = req.params;
    Product.findOne({ _id: id })
        .then(result => {
            res.json(result)
        })
        .catch(console.log)
}

const updatePut = async (req, res) => {
    const { id } = req.params;
    const { title, company, products, deletedItems } = req.body;

    // update the product details
    await Product.updateOne({ _id: id }, {
        $set: { title, company }
    })

    // removes deleted product items
    await Product.updateMany(
        { _id: id },
        {
            $pull: {
                items: { _id: { $in: deletedItems } }
            }
        }
    )

    // add new product items
    const result = await Product.updateMany(
        { _id: id },
        {
            $push: {
                items: { $each: products.filter(product => product._type === 'new') }
            }
        }
    )

    //updates old products *** should update later
    products.filter(product => product._type === 'old').forEach(async product => {
        await Product.updateOne(
            { _id: id, 'items._id': product._id },
            {
                $set: {
                    "items.$.title": product.title,
                    "items.$.upc": product.upc,
                    "items.$.mrp": product.mrp,
                    "items.$.purPrice": product.purPrice,
                    "items.$.selPrice": product.selPrice,
                    "items.$.weight": product.weight,
                    "items.$.status": product.status
                }
            }
        ).catch(console.log)
    })

    res.send(result)
}

const deleteProduct = (req, res) => {
    const { id } = req.params;
    Product.findByIdAndDelete(id)
        .then(() => res.json('ok'))
        .catch(console.log)
}

const deleteProductItem = (req, res) => {
    const { productId, itemId } = req.params;
    Product.updateMany(
        { _id: productId },
        {
            $pull: {
                items: { _id: itemId }
            }
        }
    )
        .then(() => res.json('ok'))
        .catch(console.log)
}

module.exports = {
    index,
    details,
    productItems,
    createPost,
    detail,
    updatePut,
    deleteProduct,
    deleteProductItem
}