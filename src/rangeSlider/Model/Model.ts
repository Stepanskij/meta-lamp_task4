import IModelData from "rangeSlider/Data/IModelData";

class Model {
  maxValue: number = 100;
  minValue: number = 0;
  stepSize: number = 1;
  numberSteps: number;

  constructor() {
    this.minValue;
    this.maxValue;
    this.stepSize;
    this.numberSteps = this._getNumberSteps(
      this.minValue,
      this.maxValue,
      this.stepSize
    );
  }

  private _getNumberSteps = (
    minValue: number,
    maxValue: number,
    stepSize: number
  ): number => {
    return (maxValue - minValue) / stepSize;
  };

  getModelData = (): IModelData => {
    return {
      maxValue: this.minValue,
      minValue: this.maxValue,
      stepSize: this.stepSize,
      numberSteps: this.numberSteps,
    };
  };
}

export default Model;
