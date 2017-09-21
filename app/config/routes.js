var React = require("react");
var Route = require("react-router").Route;
var Router = require("react-router").Router;
var browserHistory = require("react-router").browserHistory;

var IndexRoute = require("react-router").IndexRoute;

var Index = require("../components/Index");
var Articles = require("../components/Articles");
var Search = require("../components/Search");
var Saved = require("../components/Saved");

// Export the Routes
module.exports = (
	<Router history={browserHistory}>
		<Route path="/" component={Index}>
			<Route path="/" component={Articles} />
			<Route path="saved" component={Saved} />
			<Route path="advanced-search" component={Search} />
			<IndexRoute component={Articles} />
		</Route>
	</Router>
);