var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var http = require('http');
var request = require('request');
var moment = require('moment');

//var fs = require('fs');

var InvasionLog = require('./log-model');
var InvasionHistory = require('./log-history');

var app = express();

app.use(cors());

app.use(bodyParser.json());

mongoose.connect('mongodb://ttcc-admin:aquilina123@ds239071.mlab.com:39071/ttcc-invasions-logs', { useNewUrlParser: true }, err=>{
    if(!err){
        console.log('Invasion Logger started.');
    }else{
        console.log(err);
        console.log('Invasion Logger failed to start.');
    }
});


app.get('/test', function(req, res){
    var newDistrict = {
        name: "Opera Oasis",
        cogs_attacking: "Spin Doctor"
    };
    InvasionHistory.aggregate([
        {
            
            $lookup: {
                from: "invasionlogs",
                localField: "started_ref",
                foreignField: "_id", // <-- reference field from country collection
                as: "log"
            }
        },
        { "$match": { "log.name": newDistrict.name, "log.cogs_attacking": newDistrict.cogs_attacking/*, "logs.created": { $gte: createdMin, $lte: createdMax }*/ } }
    ]).exec(function(err, history){
        if(err)
            res.status(400).send(err);
        else
            res.status(200).send(history);
    });
});

app.get('/latest', function(req, res){
    InvasionLog.findOne().select('created').sort({ created: -1}).exec(function(err, latestLog)
    {
        if(err)
        {
            console.log('error from /latest');
            console.log(err);
            res.status(400).send('Error at /latest:1');
        } 
        else
        {
            if(latestLog && latestLog.created)
            {
                var createdMax = moment(latestLog.created).add(1, 'second').toDate();
                var createdMin = moment(latestLog.created).subtract(1, 'second').toDate();
                InvasionLog.find({created: { $gte: createdMin, $lte: createdMax } }).exec(function(err, latestLogs){
                    if(err)
                    {
                        console.log('error from /latest');
                        console.log(err);
                        res.status(400).send('Error at /latest:3');
                    } 
                    else
                    {
                        res.status(200).send(latestLogs);
                    }
                });
            }
            else
            {
                console.log('error from /latest');
                console.log(latestLog);
                res.status(400).send('Error at /latest:2');
            }
        }
    });
});

var requestLoop = setInterval(function(){
    request({
        url: "https://corporateclash.net/api/v1/districts/",
        method: "GET",
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10
    },function(error, response, body){
        if(!error && response.statusCode == 200){
            console.log('got a response');
            var districts = JSON.parse(body);
            InvasionLog.remove({ cogs_attacking: "None" }, function(err){
                if(err)
                {
                    console.log(err);
                }
                for(var district in districts)
                {
                    let newDistrict = new InvasionLog(districts[district]);

                    
                    newDistrict.save(function(err){
                        if(err)
                        console.log(err);
                        else
                        {
                            let createdMax = moment(newDistrict.created).add(30, 'minutes').toDate();
                            let createdMin = moment(newDistrict.created).subtract(30, 'minutes').toDate();
                            if(newDistrict.cogs_attacking !== 'None')
                            {
                                console.log(newDistrict.name + ' - ' + newDistrict.cogs_attacking);
                                InvasionHistory.aggregate([
                                    { $sort : { started: -1 } },
                                    {
                                        $lookup: {
                                            from: "invasionlogs",
                                            localField: "started_ref",
                                            foreignField: "_id", // <-- reference field from country collection
                                            as: "log"
                                        }
                                    },
                                    { "$match": { "log.name": newDistrict.name, "log.cogs_attacking": newDistrict.cogs_attacking, "log.created": { $gte: createdMin } } }
                                ]).exec(function(err, history){
                                    if(err)
                                    {
                                        console.log('InvasionHistory Error: Finding History');
                                    }
                                    else
                                    {
                                        if(history.length == 0)
                                        {
                                            var newEntry = new InvasionHistory({ started_ref: newDistrict._id, started: newDistrict.created });
                                            newEntry.save(function(err){
                                                if(err)
                                                {
                                                    console.log('InvasionHistory Error: Saving History');
                                                    console.log(err);
                                                }
                                                else
                                                    console.log('InvasionHistory Notice: Saved History (' + newDistrict.name + ').');
                                            });
                                        }
                                        else
                                        {
                                            console.log('InvasionHistory Notice: Start already logged.');
                                        }
                                    }
                                });
                            }
                            else
                            {
                                InvasionHistory.findOne({ name: newDistrict.name, created: { $gte: createdMin, $lte: createdMax } }).populate('started_ref').sort({ created: -1}).exec(function(err, history){
                                    if(err)
                                    {
                                        console.log('InvasionHistory Error: Finding History');
                                    }
                                    else
                                    {
                                        if(history)
                                        {
                                            console.log(history);
                                            console.log('passed still?');
                                            InvasionLog.findOne({ name: newDistrict.name, cogs_attacking: history.started_ref.cogs_attacking }).sort({created: -1}).exec(function(err, log){
                                                if(err)
                                                {
                                                    console.log('InvasionHistory Error: Finding Log');
                                                }
                                                else
                                                {
                                                    if(log)
                                                    {
                                                        history.ended = Date.now();
                                                        history.ended_ref = log._id;
                                                        history.save(function(err){
                                                            if(err)
                                                                console.log('InvasionHistory Error: Updating History');
                                                            else
                                                                console.log('InvasionHistory Notice: Saved History (' + log.name + ').');
                                                        });
                                                    }
                                                    else
                                                    {
                                                        console.log('InvasionHistory Error: Log not found.');
                                                    }
                                                }
                                            });
                                            var newEntry = new InvasionHistory({ started_ref: history._id, started: history.created });
                                            newEntry.save(function(err){
                                                if(err)
                                                {
                                                    console.log('InvasionHistory Error: Saving');
                                                    console.log(err);
                                                }
                                            });
                                        }
                                        else
                                        {
                                            //console.log('InvasionHistory Notice: End already logged or no current Start.');
                                        }
                                    }
                                });
                            } 
                        }
                    });


                }
            });
        }else{
            console.log('error: ' + response.statusCode);
        }
    });
  }, 25000);
  
  // If you ever want to stop it...  clearInterval(requestLoop)

app.listen(3000);
