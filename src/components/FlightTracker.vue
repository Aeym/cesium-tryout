<script lang="ts">
	import { defineComponent } from "vue";
	import {
		Cartesian3,
		Color,
		Viewer,
		JulianDate,
		SampledPositionProperty,
		TimeIntervalCollection,
		TimeInterval,
		PathGraphics,
		IonResource,
		VelocityOrientationProperty,
	} from "cesium";
	import "cesium/Build/Cesium/Widgets/widgets.css";

	import { flightData, planeAssetId } from "@/services/flightService";
	import {
		createViewer,
		destroyViewer,
		calculateEndTime,
		configureClock,
	} from "@/services/cesiumUtils";

	export default defineComponent({
		data() {
			return {
				viewer: null as null | Viewer,
			};
		},
		async mounted() {
			this.viewer = createViewer("cesium-container");

			const start = JulianDate.fromIso8601("2020-03-09T23:10:00Z");
			const stop = calculateEndTime(start, flightData.length, 30);
			configureClock(this.viewer, start, stop);

			const positionProperty = this.generateFlightPath(start, flightData, 30);
			await this.loadModel(positionProperty, start, stop);
		},
		unmounted() {
			destroyViewer(this.viewer);
		},
		methods: {
			generateFlightPath(
				start: JulianDate,
				flightData: Array<{
					longitude: number;
					latitude: number;
					height: number;
				}>,
				timeStepInSeconds: number
			): SampledPositionProperty {
				const positionProperty = new SampledPositionProperty();

				flightData.forEach((dataPoint, index) => {
					const time = JulianDate.addSeconds(
						start,
						index * timeStepInSeconds,
						new JulianDate()
					);
					const position = Cartesian3.fromDegrees(
						dataPoint.longitude,
						dataPoint.latitude,
						dataPoint.height
					);
					positionProperty.addSample(time, position);

					// Add a point entity to the viewer for each data point
					this.viewer?.entities.add({
						description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
						position: position,
						point: { pixelSize: 10, color: Color.RED },
					});
				});

				return positionProperty;
			},

			// Load and add the airplane model to the viewer
			async loadModel(
				positionProperty: SampledPositionProperty,
				start: JulianDate,
				stop: JulianDate
			): Promise<void> {
				const airplaneUri = await IonResource.fromAssetId(planeAssetId);
				const airplaneEntity = this.viewer?.entities.add({
					availability: new TimeIntervalCollection([
						new TimeInterval({ start, stop }),
					]),
					position: positionProperty,
					model: { uri: airplaneUri },
					orientation: new VelocityOrientationProperty(positionProperty),
					path: new PathGraphics({ width: 3 }),
				});

				if (this.viewer) {
					this.viewer.trackedEntity = airplaneEntity;
				}
			},
		},
	});
</script>

<template>
	<div id="cesium-container"></div>
</template>
