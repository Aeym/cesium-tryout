<template>
	<div id="app">
		<div class="controls">
			<button @click="currentComponent = 'FlightTracker'">
				Flight Tracker
			</button>
			<button @click="currentComponent = 'InteractiveBuilding'">
				Interactive Building
			</button>
		</div>

		<FlightTracker v-if="currentComponent === 'FlightTracker'" />
		<InteractiveBuilding v-if="currentComponent === 'InteractiveBuilding'" />
	</div>
</template>

<script>
	import FlightTracker from "@/components/FlightTracker.vue";
	import InteractiveBuilding from "@/components/InteractiveBuilding.vue";
	import { defineComponent } from "vue";

	export default defineComponent({
		name: "App",
		components: {
			FlightTracker,
			InteractiveBuilding,
		},
		data() {
			return {
				currentComponent: "FlightTracker", // Default to FlightTracker
			};
		},
	});
</script>

<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		height: 100vh;
		width: 100vw;
		position: relative;
	}

	.controls {
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 10;
	}

	button {
		margin: 5px;
		padding: 10px;
		font-size: 14px;
	}

	#cesium-container {
		height: 100%;
		width: 100%;
		margin: 0;
		padding: 0;
	}
</style>
