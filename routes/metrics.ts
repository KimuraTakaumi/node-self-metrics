/// <reference path="../typings/mongoose/mongoose.d.ts"/>
/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>
import express = require('express');
import mongoose = require("mongoose");

var router = express.Router();

interface IMetricsSchemaDocument extends mongoose.Document {
    user:String;
    work:String;
    date:Number;
}

var MetricsSchema:mongoose.Schema = new mongoose.Schema({
    user: {type: String, required: true},
    work: {type: String, required: true},
    date: {type: Number, required: true}
});

class Metrics {

    private mMongoose:mongoose.Mongoose;

    private mModel:mongoose.Model<IMetricsSchemaDocument>;

    constructor() {
        this.mMongoose = mongoose.connect("mongodb://localhost/metrics");
        this.mModel = <mongoose.Model<IMetricsSchemaDocument>>this.mMongoose.model('Metrics', MetricsSchema);
    }

    public insert(json:String, callback:(json:string)=>any) {
        var model = new this.mModel(json);
        model.save((err:any, res:IMetricsSchemaDocument)=> {
            console.log(<string>(res.toJSON()));
            callback(<string>(res.toJSON()));
        });
    }

    public find(user:any, callback:(json:string)=>any) {
        this.mModel.find(user, (err:any, res:IMetricsSchemaDocument[])=> {
            console.log(<string>(JSON.stringify(res)));
            callback(<string>(JSON.stringify(res)));
        });
    }
}

var metrics = new Metrics();

router.post('/', function (req:express.Request, res:express.Response) {
    metrics.insert(req.body, (json:string) => {
        res.send(json);
    });
});

router.get('/', function (req:express.Request, res:express.Response) {
    metrics.find({}, (json:string)=> {
        res.send(json);
    });
});

router.get('/:user', function (req:express.Request, res:express.Response) {
    var user = {};
    user['user'] = req.params.user;
    metrics.find(user, (json:string)=> {
        res.send(json);
    });
});

router.get('/:user/:year/:month/:day', function (req:express.Request, res:express.Response) {
    var start = new Date(Number(req.params.year), Number(req.params.month) - 1, Number(req.params.day), 0, 0);
    var end = new Date(Number(req.params.year), Number(req.params.month) - 1, Number(req.params.day) + 1, 0, 0);

    var user = {"date": {"$gte": start.getTime(), "$lt": end.getTime()}};

    user['user'] = req.params.user;
    metrics.find(user, (json:string)=> {
        res.send(json);
    });
});

module.exports = router;