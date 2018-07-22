import { IToon } from "./itoon";

export interface IGroup{
    _id: string,
    activity: string,
    building_level?: number, //building
    cog_type?: string, //building
    street?: string, //building
    facility_type?: string, //facility
    boss?: string, //boss.hq
    playground?: string, //boss.task
    district: string,
    host: IToon,
    toons: IToon[],
    created?: Date
}

/*
var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
    activity: {
        type: string,
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
        type: string,
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