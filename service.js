require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const apiRawUrl = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/[symbol]/quote";
const apiUrl = (symbol) => apiRawUrl.replace("[symbol]", symbol);
const axios = require("axios");

let likeSchema = new mongoose.Schema({
    symbol: { type: String, required: true, default: '' },
    ip: { type: String, required: true, default: '' },
    timestamp: { type: Date, default: new Date().toISOString() },
}, { versionKey: false });

let likeModel = mongoose.model(`Like`, likeSchema);;

const createAndSaveLike = async (obj) => {
    try {

        let exists = await getLikes({ symbol: obj.symbol, ip: obj.ip })
        if (exists) {
            return 'Just one like per IP';
        }

        const newDoc = new likeModel(obj);
        let response = await newDoc.save();
        return "New record added";
    } catch (error) {
        if (error.name == 'ValidationError') {
            return 'required field(s) missing';
        }
        return error;
    }
};

const getLikes = async (obj) => {
    try {
        let response = await likeModel.find(obj);
        return response.length;
    } catch (error) {
        return error;
    }
};

const handleRequest = async (symbol, ip, isLike) => {
    try {
        let likeMsj = null;
        let getData = await axios.get(apiUrl(symbol))
        if (isLike) {
            likeMsj = await createAndSaveLike({ symbol, ip })
        }
        let likes = await getLikes({ symbol })
        let obj = { stockData: { stock: symbol, price: getData.data.latestPrice, likes: likes } }

        if (isLike) {
            obj.stockData.likeMsj = likeMsj;
        }

        return obj;
    } catch (error) {
        return error
    }
}

const parseResponse = (obj1, obj2) => {
    let l1 = obj1.likes;
    let l2 = obj2.likes;
    obj1.rel_likes = l1 - l2
    obj2.rel_likes = l2 - l1
    return { stockData: [obj1, obj2] };
}

exports.createAndSaveLike = createAndSaveLike;
exports.getLikes = getLikes;
exports.handleRequest = handleRequest;
exports.parseResponse = parseResponse;
