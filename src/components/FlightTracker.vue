<script lang="ts">
	import {
		Cartesian3,
		Color,
		createOsmBuildingsAsync,
		Math as CesiumMath,
		Terrain,
		Viewer,
		JulianDate,
		SampledPositionProperty,
		TimeIntervalCollection,
		TimeInterval,
		PathGraphics,
		IonResource,
		VelocityOrientationProperty,
		Ion,
	} from "cesium";
	import "cesium/Build/Cesium/Widgets/widgets.css";
	import { defineComponent } from "vue";
	import { flightData } from "@/services/flightDataService";

	export default defineComponent({
		async mounted() {
			const viewer = new Viewer("cesium-container", {
				terrain: Terrain.fromWorldTerrain(),
			});

			const timeStepInSeconds = 30;
			const totalSeconds = timeStepInSeconds * (flightData.length - 1);
			const start = JulianDate.fromIso8601("2020-03-09T23:10:00Z");
			const stop = JulianDate.addSeconds(start, totalSeconds, new JulianDate());
			viewer.clock.startTime = start.clone();
			viewer.clock.stopTime = stop.clone();
			viewer.clock.currentTime = start.clone();
			viewer.timeline.zoomTo(start, stop);
			viewer.clock.multiplier = 50;
			viewer.clock.shouldAnimate = true;

			const positionProperty = new SampledPositionProperty();

			for (let i = 0; i < flightData.length; i++) {
				const dataPoint = flightData[i];

				const time = JulianDate.addSeconds(
					start,
					i * timeStepInSeconds,
					new JulianDate()
				);
				const position = Cartesian3.fromDegrees(
					dataPoint.longitude,
					dataPoint.latitude,
					dataPoint.height
				);

				positionProperty.addSample(time, position);

				viewer.entities.add({
					description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
					position: position,
					point: { pixelSize: 10, color: Color.RED },
				});
			}

			async function loadModel() {
				const airplaneUri = await IonResource.fromAssetId(2738531);
				const airplaneEntity = viewer.entities.add({
					availability: new TimeIntervalCollection([
						new TimeInterval({ start: start, stop: stop }),
					]),
					position: positionProperty,
					model: { uri: airplaneUri },
					orientation: new VelocityOrientationProperty(positionProperty),
					path: new PathGraphics({ width: 3 }),
				});

				viewer.trackedEntity = airplaneEntity;
			}

			loadModel();

			// Add Cesium OSM Buildings, a global 3D buildings layer.
			// const buildingTileset = await createOsmBuildingsAsync();
			// viewer.scene.primitives.add(buildingTileset);
		},
	});
</script>

<style scoped>
	#cesium-container {
		height: 100%;
		width: 100%;
		margin: 0;
		padding: 0;
	}
</style>
