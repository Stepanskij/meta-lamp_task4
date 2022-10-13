import IModelData from "rangeSlider/Data/IModelData";

class Model {
  modelData: IModelData;

  constructor(
    modelData: IModelData = {
      maxValue: 100,
      minValue: -10,
      stepSize: 2,
      handles: [],
    }
  ) {
    this.modelData = modelData;
    this.fixMaxValue();
    this.getMaxSteps();
    this.addHandle(121);
    this.addHandle(-57);
  }

  //Добавить/убрать рычажок. Добавить можно любое value.
  addHandle = (value: number): void => {
    if (
      this.modelData.maxValue !== undefined &&
      this.modelData.minValue !== undefined &&
      this.modelData.stepSize !== undefined
    ) {
      //Корректировка value, учитывая размер шага stepSize (на correctValue) с расчётом номера шага рычажка.
      let correctStep;
      if (value > this.modelData.maxValue) {
        correctStep =
          (this.modelData.maxValue - this.modelData.minValue) /
          this.modelData.stepSize;
      } else if (value < this.modelData.minValue) {
        correctStep = 0;
      } else correctStep = this.modelData.maxValue / value;
      correctStep = Math.round(correctStep);
      let correctValue =
        this.modelData.minValue + correctStep * this.modelData.stepSize;

      //Помещение рычажка (объекта с данными) в массив.
      this.modelData.handles?.push({ value: correctValue, step: correctStep });
    }
  };
  //Убрать крайний рычажок (последний, из массива).
  removeHandle = (): void => {
    this.modelData.handles?.pop();
  };

  //Расчёт количества шагов (делений) слайдера.
  getMaxSteps = (): void => {
    if (
      this.modelData.maxValue !== undefined &&
      this.modelData.minValue !== undefined &&
      this.modelData.stepSize !== undefined
    ) {
      this.modelData.maxSteps = Math.round(
        (this.modelData.maxValue - this.modelData.minValue) /
          this.modelData.stepSize
      );
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
