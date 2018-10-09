import Vue from "vue";
import Router from "vue-router";
import cognitoAuth from "@/cognito";

Vue.use( Router );

const Login = () => {return import( /* webpackChunkName: "login" */ "@/components/Login" );};
const Signup = () => {return import( /* webpackChunkName: "signup" */ "@/components/Signup" );};
const Confirm = () => {return import( /* webpackChunkName: "confirm" */ "@/components/Confirm" );};
const Tickets = () => {return import( /* webpackChunkName: "tickets" */ "@/components/Tickets" );};
const Admin = () => {return import( /* webpackChunkName: "admin" */ "@/components/Admin" );};

function requireAuth ( to, from, next ) {
	cognitoAuth.isAuthenticated( ( err, loggedIn ) => {
		if ( !loggedIn || err ) {
			next( {
				path: "/login",
				query: { redirect: to.fullPath }
			} );
		} else {
			next();
		}
	} );
}


function requireAdmin( to, from, next ) {
	cognitoAuth.isAuthenticated( ( err, loggedIn ) => {
		const groups = window.store.state.user.groups;
		if ( !loggedIn || err || !groups.includes( "Admin" ) ) {
			next( {
				path: "/login"
			} );
		} else {
			next();
		}
	} );
}


export default new Router( {
	routes: [
		{ path: "/", name: "Tickets", component: Tickets, beforeEnter: requireAuth },
		{ path: "/login", component: Login },
		{ path: "/signup", component: Signup },
		{ path: "/confirm", component: Confirm },
		{ path: "/admin", component: Admin, beforeEnter: requireAdmin },
	]
} );
