var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BearSchema   = new Schema({
	name: { type: String, required: true, index: { unique: true } },
	data: { type: Object, required: true }
});

module.exports = mongoose.model('Regshape', BearSchema);