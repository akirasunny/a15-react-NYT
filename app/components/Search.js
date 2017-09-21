var React = require("react");
var Link = require("react-router").Link;

var helper = require("../utils/helper");

var Articleholder = require("./Article-holder");

var Search = React.createClass({
	getInitialState: function() {
		return ({
			keyword: "",
			startdate: "",
			enddate: "",
			result: []
		})
	},
	handleInput: function(event) {
		var obj = {};
		obj[event.target.id] = event.target.value;
		this.setState(obj);
	},
	handleClick: function() {
		helper.search(this.state).then(function(res) {
			if (res.data.err === "") {
				return (
					alert("Invalid date. Please try again.")
				)
			}
			else {
				this.setState({result: res.data})
			}
		}.bind(this));
	},
	render: function() {
		return(
			<div id="container">
				<h2>Search</h2>
					<label htmlFor="keyword">Key word</label><br/>
					<input
					type="text"
					id="keyword"
					placeholder="i.e. Trump, Hurricane..."
					onChange={this.handleInput}
					/><br/>
					<label htmlFor="startdate">Start Date (optional)</label><br/>
					<input 
					value={this.state.startdate}
					type="date"
					id="startdate"
					onChange={this.handleInput}
					></input><br/>
					<label htmlFor="enddate">End Date (optional)</label><br/>
					<input
					value={this.state.enddate}
					type="date"
					id="enddate"
					onChange={this.handleInput}
					></input>
					<button type="submit" onClick={this.handleClick}>Submit</button>

					{this.state.result.length !== 0 &&
						<Articleholder data={this.state.result}/>}
			</div>
		)
	}
})

module.exports = Search;