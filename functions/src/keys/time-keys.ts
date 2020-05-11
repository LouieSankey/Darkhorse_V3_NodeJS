import * as moment from 'moment';

const database = require('../index').database

const scheduleOffset = -117;

const urlDate = moment().add(scheduleOffset, "days").format('YYYYMMDD');
const firebaseTimestamp = database.Timestamp.now();
const jsTime = database.Timestamp.fromDate(firebaseTimestamp.toDate());
const jsMoment = moment(jsTime);

module.exports.jsMoment = jsMoment;
module.exports.urlDate = urlDate;
module.exports.firebaseTimestamp = firebaseTimestamp;
module.exports.scheduleOffset = scheduleOffset;
module.exports.moment = moment;
