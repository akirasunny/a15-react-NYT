var React = require("react");
var Link = require("react-router").Link;

var Articleholder = React.createClass({
	render: function() {
		return (
			<div id="container">
			{this.props.data.message &&
				<div className="message">
					<h2>{this.props.data.message}</h2>
				</div>}
			{!this.props.data.message && this.props.data.map(function(data, i) {
				return (
					<div className="story-body" key={data._id}>
						<h2><a href={data.link} target="_blank">{data.title}</a>
						<form action={"/save/" + data._id} method="POST">
							<button type="submit" className="status" value={data.status}>{data.status}</button>
						</form>
						</h2>
						<summary>{data.summary}</summary>
						<img className="media" src={data.img} />
					</div>
				)
			})}
			</div>
		)
	}
});

module.exports = Articleholder;

// {data.note !== undefined &&
// 	<Link to="notes" className="notes"><button type="button" className="addnote-button" value={data._id}>Edit Notes</button></Link>
// }
// {data.note === undefined &&
// 	<Link to="notes" className="notes"><button type="button" className="addnote-button" value={data._id}>Add Notes</button></Link>
// }