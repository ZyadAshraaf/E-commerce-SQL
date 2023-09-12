/*============ Built in libraries ================*/
const path = require('path');

/*============ Third-party libraries ================*/
const express = require('express');
const bodyParser = require('body-parser');

/*============ Controllers ================*/
const errorController = require('./controllers/error');

/*============ Sequailze ================*/
const sequelize = require("./util/database");

/*============ Routes =============== */
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

/*============ Models =================*/
const Product = require("./models/product");
const User = require("./models/user")
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item")
const Order = require("./models/order");
const OrderItem = require("./models/order-item")
//Execute express function in app variabale
const app = express();

/*============ View Engine ejs ==============*/
app.set('view engine', 'ejs');
app.set('views', 'views');

/*============ Middlewares ==============*/
//Use bodyParser in a middleware to parse any data 
app.use(bodyParser.urlencoded({
    extended: false
}));

//use static path in a middlewares to a public folder to make a js cabaple to access it
app.use(express.static(path.join(__dirname, 'public')));

//Middleware to store user data in req.user
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
})

//Middleware use defined routes files
app.use('/admin', adminRoutes);
app.use(shopRoutes);

//Middleware to 404 page in case no valid url
app.use(errorController.get404);

/*============ Assocciations / Relations ==============*/
//OneToMany Relation between User (Admin) and Products
Product.belongsTo(User, {
    constraints: true,
    onDelete: "CASCADE"
});
User.hasMany(Product); //optional it has the same meaning
//OneToOne Relation between User and Cart
User.hasOne(Cart);
Cart.belongsTo(User); //optional it has the same meaning
//ManyToMany Reation between Cart and Products
Cart.belongsToMany(Product, {
    through: CartItem
});
Product.belongsToMany(Cart, {
    through: CartItem
});
//OneToMany Relation between User (Admin) and Orders
Order.belongsTo(User);
User.hasMany(Order)
//ManyToMany Reation between Cart and Products
Order.belongsToMany(Product,{through: OrderItem})
Product.belongsToMany(Order,{through: OrderItem})

//sequelize.sync() is synchronising(Migrate) models and realtions to database
sequelize.sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({
                name: 'Zyad',
                email: 'zyad.ashraaf@gmail.com'
            });
        }
        return user;
    })
    .then(user => {
        return user.createCart();
    }).then(cart=>{
        
        app.listen(3000);
    })
    .catch(err => console.log(err))