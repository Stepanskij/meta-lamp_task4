import IModelData from "rangeSlider/Data/IModelData";
import IHandles from "rangeSlider/Data/IHandles";
import IScaleData from "rangeSlider/Data/IScaleData";

import scaleDataMethods from "./modelParts/scaleDataMethods";

class Model {
  private modelData: IModelData;
  private scaleDataMethods: scaleDataMethods;

  constructor(modelData: IModelData) {
    this.modelData = modelData;
    this._makeDefaultModelValues(); //Добавляет дефолтное значение значение, если то не было передано.
    this.fixMaxValue(); //Исправляет максимальное значение.
    this.getMaxSteps(); //Расчитывает колличество делений ролика.
    this._reconstructionHandlesArray(this.modelData.handles as IHandles[]); //Переделывает массив рычажков(от меньшего к большем).

    this.scaleDataMethods = new scaleDataMethods(this.modelData);
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
      this.modelData.minValue !== undefined &&
      this.modelData.maxValue !== undefined &&
      this.modelData.stepSize !== undefined &&
      this.modelData.maxSteps !== undefined
    ) {
      if (value !== undefined) {
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

  private _makeDefaultModelValues = (): void => {
    const modelData = this.modelData;
    if (modelData.minValue === undefined) modelData.minValue = -10;
    if (modelData.stepSize === undefined) modelData.stepSize = 1;
    if (modelData.maxValue === undefined) modelData.maxValue = 10;
    if (modelData.handles === undefined) modelData.handles = [{ value: 0 }];
    if (modelData.scaleData === undefined)
      modelData.scaleData = { customMark: [], numberAutoMark: 0 };
  };
}

export default Model;
