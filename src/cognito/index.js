import Vue from "vue";
import CognitoAuthProd from "./cognito";
import CognitoAuthDev from "./cognito.dev";

// eslint-disable-next-line no-undef
const CognitoAuth = AWS_ONLINE ? CognitoAuthProd : CognitoAuthDev;

// eslint-disable-next-line no-undef
Vue.use( CognitoAuth );

export default new CognitoAuth( this );