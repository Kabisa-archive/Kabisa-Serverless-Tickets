import Vue from "vue";
import App from "./App";
import router from "./router";
import cognitoAuth from "./cognito";
import Vuex from "vuex";

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.config.productionTip = false;

Vue.use( Vuex );
Vue.use( VueMaterial );


const store = new Vuex.Store( {
	state: {
		user: {
			session: null,
			token: null,
			groups: []
		}
	},
	mutations: {
		userSession ( state, session ) {
			state.user.session = session;
		},
		token ( state, tokenPayload ) {
			if ( !( tokenPayload instanceof Error ) ) {
				state.user.token = tokenPayload;
				state.user.groups = tokenPayload["cognito:groups"] || [];
			}
		}
	}
} );

window.store = store;

const vm = new Vue( {
	el: "#app",
	router,
	store: store,
	components: { App },
	cognitoAuth: cognitoAuth,
	template: "<App/>"
} );

window.vue = vm;