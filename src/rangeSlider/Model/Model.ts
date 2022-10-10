import IModelData from "rangeSlider/Data/IModelData";

class Model {
  modelData: IModelData;

  constructor(
    modelData: IModelData = { maxValue: 100, minValue: 0, stepSize: 5 }
  ) {
    this.modelData = modelData;
    this.fixMaxValue();
    this.getNumberSteps();
  }

  //Расчёт количества шагов(делений) слайдера.
  getNumberSteps = (): void => {
    if (
      this.modelData.maxValue !== undefined &&
      this.modelData.minValue !== undefined &&
      this.modelData.stepSize !== undefined
    ) {
      this.modelData.numberSteps =
        this.modelData.maxValue / this.modelData.stepSize;
    }
  };

  //Исправляет максимальное значение слайдера, по отношению к неизменным минимальному зачению и шагу.
  fixMaxValue = (): void => {
    if (
      this.modelData.maxValue !== undefined &&
      this.modelData.minValue !== undefined &&
      this.modelData.stepSize !== undefined
    ) {
      let remainder =
        (this.modelData.maxValue - this.modelData.minValue) %
        this.modelData.stepSize;
      if (remainder)
        this.modelData.maxValue =
          this.modelData.maxValue + this.modelData.stepSize - remainder;
    }
  };
}

export default Model;
