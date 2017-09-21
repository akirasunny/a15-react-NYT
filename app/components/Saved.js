var React = require("react");
var Link = require("react-router").Link;

var Articleholder = require("./Article-holder")

var helper = require("../utils/helper");

var Saved = React.createClass({
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		helper.saved().then(function(res) {
			console.log(res.data);
			this.setState({data: res.data});
		}.bind(this));
	},
	render: function() {
		return(
			<Articleholder data={this.state.data} />
		)
	}
})

module.exports = Saved;