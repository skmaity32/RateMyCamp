const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!");
});

const randomTitle = () => {
    const descIdx = Math.floor(Math.random() * descriptors.length);
    const placeIdx = Math.floor(Math.random() * places.length);
    return `${descriptors[descIdx]} ${places[placeIdx]}`;
};

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomIdx = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 1200) + 800;
        const newCamp = new Campground({
            title: randomTitle(),
            image: 'https://source.unsplash.com/collection/9046579',
            price,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga neque iusto ea distinctio nulla corporis aperiam eligendi eos dolorum unde accusantium tempora esse, incidunt consectetur suscipit velit quasi asperiores sint',
            location: `${cities[randomIdx].city}, ${cities[randomIdx].state}`
        });

        await newCamp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
