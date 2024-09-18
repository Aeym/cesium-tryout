<template>
	<div id="cesium-container">
		<FlightTracker />
	</div>
</template>

<script>
	import FlightTracker from "@/components/FlightTracker.vue";

	export default {
		name: "App",
		components: {
			FlightTracker,
		},
	};
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
	}
</style>
