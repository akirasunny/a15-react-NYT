var React = require("react");
var Link = require("react-router").Link;

var helper = require("../utils/helper");

var Index = React.createClass({
	render: function() {
		return (
			<div id="container">
				<header>
					<Link to="/"><div id="sitename">NYT Scraper</div></Link>
					<Link to="/"><button id="all-articles">All Articles</button></Link>
					<Link to="/saved"><button id="saved-articles">Saved Articles</button></Link>
					<form action="/scrape" method="GET">
						<button type="submit" id="refresh-articles">Scrape For Newest Articles</button>
					</form>
					<Link to="/advanced-search"><button type="button" id="advanced-search">Search</button></Link>
				</header>
				<img id="cover" src="/assets/images/cover.jpg" />
				<div>
					{this.props.children}
				</div>
			</div>
		)
	}
});

module.exports = Index;