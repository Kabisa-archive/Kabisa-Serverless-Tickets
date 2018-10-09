<template>
  <md-card class="md-layout-item md-size-50 md-small-size-100 md-center">
    <md-card-header>
      <div class="md-title">Order your Tickets</div>
    </md-card-header>


    <md-card-content>
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-small-size-100">
          <md-field 
            v-for="(availability, index) in availabilities"
            :key="index"
            class="task">
            <md-input
              v-model="availability.Amount"
              type="number"
              placeholder="Place your amount here!"/>
            <span class="md-helper-text">{{ availability.Name }} ( Last {{ availability.Available }} )</span>
          </md-field>

        </div>
      </div>
    </md-card-content>
    <md-card-actions>
      <md-button 
        class="md-raised md-primary"
        @click="orderTickets(availabilities)">Order Now!</md-button>
    </md-card-actions>

    <md-snackbar :md-active.sync="ordered">
      You ordered this:
      <ul>
        <li
          v-for="(availability, index) in availabilities"
          :key="index">
          {{ availability.Name }}: {{ availability.Amount }}
        </li>
      </ul>

    </md-snackbar>

  </md-card>

</template>

<script>
import cognitoAuth from "@/cognito";
import getConfig from "../config/config";

const config = getConfig();

export default {
	data () {
		return {
			ordered: false,
			availabilities: [],
			Amount: null,
		};
	},
	beforeMount() {
		this.loadAvailabilities();
	},
	methods: {
		orderTickets( availabilities ) {
			cognitoAuth.getIdToken( async ( error, token ) => {
				// eslint-disable-next-line no-undef
				const url = config.ServiceEndpoint + "/order";
				const orderItems = Object.assign( ...availabilities.map( ( item ) => {return {
					[item.SeatTypeId]: item.Amount === undefined ? 0 : ~~item.Amount
				};} ) );

				fetch( url, {
					body: JSON.stringify( orderItems ),
					method: "POST",
					headers: {
						"Authorization": token,
						"Content-Type": "application/json"
					}
				} ).then( () => {
					this.ordered = true;
				} );
			} );
		},
		loadAvailabilities() {
			cognitoAuth.getIdToken( async ( error, token ) => {
				// eslint-disable-next-line no-undef
				const url = config.ServiceEndpoint + "/availability";
				const response = await fetch( url, {
					headers: {
						"Authorization": token
					}
				} );

				const json = await response.json();
				let availabilities = JSON.parse( json.body ).Items;
				availabilities = availabilities.map( ( item ) => {
					item.Amount = 0;
					return item;
				} );

				this.availabilities = availabilities;

			} );
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
