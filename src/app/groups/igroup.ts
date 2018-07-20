import { IToon } from "./itoon";

export interface IGroup{
    activity: String,
    building_level?: Number, //building
    cog_type?: String, //building
    street?: String, //building
    facility_type?: String, //facility
    boss?: String, //boss.hq
    playground?: String, //boss.task
    district: String,
    host: IToon,
    toons: IToon[],
    created: Date
}

/*
var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
    activity: {
        type: String,
        enum: [
            'Building', 
            'Facility', 
            'Boss(HQ)', 
            'Boss(Playground)'
        ],
        required: true
    },
    },
    cog_type: {//Building
        type: String,
        enum: [
        ],
        required: function() {
            return this.activity == 'Building';
        }
    },
    street: {
        required: function() {
            return this.activity == 'Building';
        }
    },
    facility_type: {//Facility
        required: function() {
            return this.activity == 'Facility';
        }
    },
    boss: {//Boss(HQ)
    },
    playground: {//Boss(Playground)
        required: function() {
            return this.activity == 'Boss(Playground)';
        }
    },
    district: {
        required: true
    },
    host: {
    },
    toons: [{
    }],
*/