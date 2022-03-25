const Sequelize = require('sequelize');
var sequelize = new Sequelize('d5t3o400nhmn8o', 'hqdtuovtzvnjek', 'd2f683ffb991f01c7aa4eef36512d370c520909aad17b9078a3cf5ec2d45b52c', {
    host: 'ec2-52-3-60-53.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Post = sequelize.define("Post", {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
});

var Category = sequelize.define("Category", {
    category: Sequelize.STRING
});

Post.belongsTo(Category, {foreignKey: 'category'});


module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(()=>{
            resolve();
        }).catch(err=>{
            reject("unable to sync the database");
        });
    });
};

module.exports.getAllPosts = function () {
    return new Promise((resolve, reject) => {
        Post.findAll().then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        });
    });
};

module.exports.getPublishedPosts = function () {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true
            }
        }).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        });
    });
};

module.exports.getCategories = function () {
    return new Promise((resolve, reject) => {
        Category.findAll().then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        });
    });
};

module.exports.addPost = function (postData) {
    return new Promise((resolve, reject) => {
        postData.published = (postData.published) ? true : false;
        for (var prop in postData)
        {
            if (postData[prop] === "")
            {
                postData[prop] = null;
            }
        }
        postData.postDate = new Date();

        Post.create({
            body: postData.body,
            title: postData.title,
            postDate: postData.postDate,
            featureImage: postData.featureImage,
            published: postData.published,
            category: postData.category
        }).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("unable to create post");
        });
    });
};

module.exports.getPostsByCategory = function (category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                category: category
            }
        }).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        });
    });
};

module.exports.getPostsByMinDate = function (minDateStr) {
    return new Promise((resolve, reject) => {
        const { gte } = Sequelize.Op;
        
        Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                }
            }
        }).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        });
    });
};

module.exports.getPostById = function (id) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                id: id
            }
        }).then(data=>{
            resolve(data[0]);
        }).catch(err=>{
            reject("no results returned");
        });
    });
};

module.exports.getPublishedPostsByCategory = function (category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true,
                category: category
            }
        }).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        });
    });
};

module.exports.addCategory = function (categoryData) {
    return new Promise((resolve, reject)=>{
        for (var prop in categoryData)
        {
            if (categoryData[prop] === "")
            {
                categoryData[prop] = null;
            }
        }

        Category.create({
            category: categoryData.category
        }).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("unable to create category");
        });
    });
}

module.exports.deleteCategoryById = function (id) {
    return new Promise((resolve, reject)=>{
        Category.destroy({
            where: {
                id: id
            }
        }).then(()=>{
            resolve();
        }).catch(err=>{
            reject();
        });
    });
}

module.exports.deletePostById = function (id) {
    return new Promise((resolve, reject)=>{
        Post.destroy({
            where: {
                id: id
            }
        }).then(()=>{
            resolve();
        }).catch(err=>{
            reject();
        });
    });
}