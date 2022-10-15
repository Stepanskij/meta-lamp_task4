import IModelData from "rangeSlider/Data/IModelData";
import IHandles from "rangeSlider/Data/IHandles";

class Model {
  private modelData: IModelData;

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

    this._reconstructionHandlesArray(this.modelData.handles as IHandles[]);
  }

  //Создание массива рычажков при создании класса Model.
  private _reconstructionHandlesArray = (handlesArray: IHandles[]): void => {
    const handles = handlesArray;
    this.modelData.handles = [];
    handles.forEach((handleObj): void => {
      this.addHandle(handleObj.value);
    });
  };

  //Добавить рычажок в конец массива. Использование value добавляет рычажок в конкретном (из возможных) месте.
  addHandle = (value?: number): void => {
    if (
      this.modelData.maxSteps !== undefined &&
      this.modelData.minValue !== undefined &&
      this.modelData.stepSize !== undefined &&
      this.modelData.maxValue !== undefined
    ) {
      if (value) {
        //Корректировка value, учитывая размер шага stepSize (на correctValue) с расчётом номера шага рычажка.
        let correctStep;
        if (value > this.modelData.maxValue) {
          correctStep =
            Math.abs(this.modelData.maxValue - this.modelData.minValue) /
            this.modelData.stepSize;
        } else if (value < this.modelData.minValue) {
          correctStep = 0;
        } else {
          correctStep =
            Math.abs(value - this.modelData.minValue) / this.modelData.stepSize;
        }
        correctStep = Math.round(correctStep);
        let correctValue =
          this.modelData.minValue + correctStep * this.modelData.stepSize;
        //Помещение рычажка (объекта с данными) в массив.
        this.modelData.handles?.push({
          value: correctValue,
          step: correctStep,
        });
        //сортировка массива по возростанию handles.value.
        this.modelData.handles?.sort((a, b): number => {
          return a.value - b.value;
        });
      }
      //Добавление рычажка крайне справо, если не передаётся value.
      else {
        this.modelData.handles?.push({
          value:
            this.modelData.minValue +
            this.modelData.maxSteps * this.modelData.stepSize,
          step: this.modelData.maxSteps,
        });
      }
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

  getModelData = (): IModelData => {
    return this.modelData;
  };
}

export default Model;
