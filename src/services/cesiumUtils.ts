import {
	Viewer,
	createOsmBuildingsAsync,
	Terrain,
	Cesium3DTileset,
	JulianDate,
} from "cesium";

export function createViewer(containerId: string): Viewer {
	return new Viewer(containerId, {
		terrain: Terrain.fromWorldTerrain(),
	});
}

export function destroyViewer(viewer: Viewer | null): void {
	viewer?.destroy();
}

export async function addOsmBuildings(
	viewer: Viewer
): Promise<Cesium3DTileset> {
	const buildingsTileset = await createOsmBuildingsAsync();
	viewer.scene.primitives.add(buildingsTileset);
	return buildingsTileset;
}

export function calculateEndTime(
	start: JulianDate,
	dataLength: number,
	timeStepInSeconds: number
): JulianDate {
	const totalSeconds = timeStepInSeconds * (dataLength - 1);
	return JulianDate.addSeconds(start, totalSeconds, new JulianDate());
}

export function configureClock(
	viewer: Viewer,
	start: JulianDate,
	stop: JulianDate
): void {
	const clock = viewer.clock;
	clock.startTime = start.clone();
	clock.stopTime = stop.clone();
	clock.currentTime = start.clone();
	clock.multiplier = 50;
	clock.shouldAnimate = true;
	viewer.timeline.zoomTo(start, stop);
}
