<script lang="ts">
	import { defineComponent } from "vue";
	import {
		Viewer,
		GeoJsonDataSource,
		IonResource,
		ClassificationType,
		Cesium3DTileset,
		Cesium3DTileStyle,
		Property,
	} from "cesium";
	import "cesium/Build/Cesium/Widgets/widgets.css";

	import {
		addOsmBuildings,
		createViewer,
		destroyViewer,
	} from "@/services/cesiumUtils";
	import { BuildingService } from "@/services/interactivBuildingService";

	export default defineComponent({
		data() {
			return {
				newBuilding: null as Cesium3DTileset | null,
				buildingService: new BuildingService() as BuildingService,
				viewer: null as Viewer | null,
			};
		},
		async mounted() {
			this.viewer = createViewer("cesium-container");

			const buildingsTileset = await addOsmBuildings(this.viewer);

			buildingsTileset.style = new Cesium3DTileStyle({
				show: {
					conditions: [
						...this.buildingService.getRemovalConditions(),
						[true, true],
					],
				},
				color:
					"Boolean(${feature['cesium#color']}) ? color(${feature['cesium#color']}) : color('#ffffff')",
			});

			await this.addBuildingGeoJSON();

			this.newBuilding = await Cesium3DTileset.fromIonAssetId(2738993);
			this.viewer.scene.primitives.add(this.newBuilding);
			this.viewer.flyTo(this.newBuilding);
		},
		unmounted() {
			destroyViewer(this.viewer);
		},
		methods: {
			toggleBuilding() {
				if (this.newBuilding) {
					this.newBuilding.show = !this.newBuilding?.show;
				}
			},
			async addBuildingGeoJSON(): Promise<void> {
				const geoJSONURL = await IonResource.fromAssetId(2738988);
				const geoJSON = await GeoJsonDataSource.load(geoJSONURL, {
					clampToGround: true,
				});
				if (this.viewer) {
					const dataSource = await this.viewer.dataSources.add(geoJSON);
					for (const entity of dataSource.entities.values) {
						if (entity.polygon) {
							entity.polygon.classificationType = <Property>(
								(<unknown>ClassificationType.TERRAIN)
							);
						}
					}
				}
			},
		},
	});
</script>

<template>
	<div class="toggle">
		<button @click="toggleBuilding">Toggle new building</button>
	</div>
	<div id="cesium-container"></div>
</template>

<style scoped>
	.toggle {
		position: absolute;
		top: 10px;
		right: 500px;
		z-index: 10;
	}
</style>
