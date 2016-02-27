/// <reference path="../typings/mongoose/mongoose.d.ts"/>
/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>
var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var MetricsSchema = new mongoose.Schema({
    user: { type: String, required: true },
    work: { type: String, required: true },
    date: { type: Date, required: true}
});
var Metrics = (function () {
    function Metrics() {
        this.mMongoose = mongoose.connect("mongodb://localhost/metrics");
        this.mModel = this.mMongoose.model('Metrics', MetricsSchema);
    }
    Metrics.prototype.insert = function (json, callback) {
        var model = new this.mModel(json);
        model.save(function (err, res) {
            console.log((res.toJSON()));
            callback((res.toJSON()));
        });
    };
    Metrics.prototype.find = function (user, callback) {
        this.mModel.find(user, function (err, res) {
            console.log((JSON.stringify(res)));
            callback((JSON.stringify(res)));
        });
    };
    return Metrics;
})();
var metrics = new Metrics();
router.post('/', function (req, res) {
    metrics.insert(req.body, function (json) {
        res.send(json);
    });
});
router.get('/', function (req, res) {
    metrics.find({}, function (json) {
        res.send(json);
    });
});
router.get('/:user', function (req, res) {
    var user = {};
    user['user'] = req.params.user;
    metrics.find(user, function (json) {
        res.send(json);
    });
});
router.get('/:user/:year/:month/:day', function (req, res) {
    var user = { "date": { "$gte": new Date(req.params.year, Number(req.params.month) - 1, req.params.day, 0, 0),
            "$lt": new Date(req.params.year, Number(req.params.month) - 1, Number(req.params.day) + 1, 0, 0) } };
    user['user'] = req.params.user;
    metrics.find(user, function (json) {
        res.send(json);
    });
});
module.exports = router;
//# sourceMappingURL=metrics.js.map