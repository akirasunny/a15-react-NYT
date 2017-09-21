var React = require("react");

var Articleholder = require("./Article-holder");
var helper = require("../utils/helper");

var Articles = React.createClass({
	getInitialState: function() {
		return (
			{data: []}
		)
	},
	componentDidMount: function() {
		helper.getall().then(function(res) {
			this.setState({data: res.data});
		}.bind(this));
	},
	render: function() {
		return (
			<Articleholder data={this.state.data} />
		)
	}
});

module.exports = Articles;