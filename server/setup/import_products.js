require('dotenv').config({ path: '../.env' });
var mysql = require('mysql2');

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    var products = [
        {
            name: "Product 1",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley",
            price: "19.99",
            image_url: "https://picsum.photos/seed/random101/300/700"
        },
        {
            name: "Product 2",
            description: "Letraset sheets containing Lorem Ipsum passages, and more recently with desktop ",
            price: "20.34",
            image_url: "https://picsum.photos/seed/random102/300/700"
        },
        {
            name: "Product 3",
            description: "It has roots in a piece of classical Latin literature from 45 BC",
            price: "133",
            image_url: "https://picsum.photos/seed/random103/300/700"
        },
        {
            name: "Product 4",
            description: "If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden",
            price: "65.76",
            image_url: "https://picsum.photos/seed/random104/300/700"
        },
        {
            name: "Product 5",
            description: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
            price: "59.96",
            image_url: "https://picsum.photos/seed/random105/300/700"
        },
        {
            name: "Product 6",
            description: "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem i",
            price: "46.84",
            image_url: "https://picsum.photos/seed/random106/300/700"
        },
        {
            name: "Product 7",
            description: "Lorem Ipsum passages, and more recently with desktop publishing",
            price: "19.99",
            image_url: "https://picsum.photos/seed/random107/300/700"
        },
        {
            name: "Product 8",
            description: "fact that a reader will be distracted by the readable content of a page when ",
            price: "67.99",
            image_url: "https://picsum.photos/seed/random108/300/700"
        }
    ];

    function insertProducts() {
        products.forEach(product => {
            var sqlInsertProduct = `INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)`;
            connection.query(sqlInsertProduct, [product.name, product.description, product.price, product.image_url], function (err, result) {
                if (err) throw err;
                console.log("Product inserted: " + product.name);
            });
        });
    }

    insertProducts();

    connection.end(function(err) {
        if (err) {
            return console.log('error:' + err.message);
        }
        console.log('Closing the database connection.');
    });
});