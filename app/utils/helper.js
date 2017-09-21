var axios = require("axios");

var helper = {
	getall: function() {
		return axios.get("/data");
	},
	save: function(id) {
		return axios.post("/save/" + id);
	},
	saved: function() {
		return axios.get("/api/saved");
	},
	addnote: function(id, note) {
		return axios.post("/note/" + id, note);
	},
	search: function(stateobj) {
		return axios.post("/advanced-search", stateobj);
	}
}

module.exports = helper;