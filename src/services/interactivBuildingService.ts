export class BuildingService {
	private buildingAssetId: number;
	private buildingsToRemoveIds: number[];

	constructor() {
		this.buildingAssetId = 2738993;
		this.buildingsToRemoveIds = [
			332469316, 332469317, 235368665, 530288180, 532245203, 530288179,
		];
	}

	public getBuildingAssetId(): number {
		return this.buildingAssetId;
	}

	public getRemovalConditions(): [string, boolean][] {
		return this.buildingsToRemoveIds.map((id) => [
			`\${elementId} === ${id}`,
			false,
		]);
	}
}
