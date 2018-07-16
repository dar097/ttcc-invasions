export interface IDistrict{
    name: string,
    online: boolean,
    population: number,
    invasion_online: boolean,
    last_update?: number,
    cogs_attacking: string,
    cogs_type?: string,
    count_defeated: number,
    count_total: number,
    remaining_time?: number
}