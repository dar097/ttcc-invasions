export interface IHistory{
    started: Date,
    ended?: Date,
    name: String,
    population: Number,
    cogs_attacking: String,
    cogs_type: String,
    count_defeated?: Number,
    count_total: Number
}