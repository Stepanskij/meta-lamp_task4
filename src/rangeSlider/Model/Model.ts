import IModelData from "rangeSlider/Data/IModelData";
import IHandles from "rangeSlider/Data/IHandles";

import scaleDataMethods from "./modelParts/scaleDataMethods";

class Model {
  private modelData: IModelData = {};
  public scaleDataMethods: scaleDataMethods;

  constructor(modelData?: IModelData) {
    if (modelData) this.modelData = modelData;
    this._makeDefaultModelValues(); //Добавляет дефолтное значение значение, если то не было передано.
    this.getNumberRounding();
    this.fixMaxValue(); //Исправляет максимальное значение.
    this.getMaxSteps(); //Расчитывает колличество делений ролика.
    this.sortBordersFillStrips();
    this._reconstructionHandlesArray(this.modelData.handles as IHandles[]); //Переделывает массив рычажков(от меньшего к большем).
    this.scaleDataMethods = new scaleDataMethods(this.modelData); //Записывает методы работы над свойстом scaleData объекта modelData.
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
        let correctValue = Number(
          (
            this.modelData.minValue +
            correctStep * this.modelData.stepSize
          ).toFixed(this.modelData.numberRounding)
        );
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
  //Расчёт количества цифр после запятой.
  getNumberRounding = (): void => {
    if (
      this.modelData.maxValue !== undefined &&
      this.modelData.minValue !== undefined &&
      this.modelData.stepSize !== undefined
    ) {
      let stepSizeRemainder = String(this.modelData.stepSize).split(".")[1];
      let minValueRemainder = String(this.modelData.minValue).split(".")[1];
      let maxValueRemainder = String(this.modelData.maxValue).split(".")[1];
      if (stepSizeRemainder === undefined) stepSizeRemainder = "";
      if (minValueRemainder === undefined) minValueRemainder = "";
      if (maxValueRemainder === undefined) maxValueRemainder = "";
      this.modelData.numberRounding = Math.max(
        stepSizeRemainder.length,
        minValueRemainder.length,
        maxValueRemainder.length
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
        this.modelData.maxValue = Number(
          (
            this.modelData.maxValue +
            this.modelData.stepSize -
            remainder
          ).toFixed(this.modelData.numberRounding)
        );
    }
  };
  //Сортировать массив bordersFillStrips на некорректные значения.
  sortBordersFillStrips = (): void => {
    if (this.modelData.bordersFillStrips) {
      //Округляем выходящие за пределы ролика значения.
      this.modelData.bordersFillStrips = this.modelData.bordersFillStrips.map(
        (number): number => {
          let leftBorder = number;
          if (leftBorder > (this.modelData.handles as IHandles[]).length)
            leftBorder = (this.modelData.handles as IHandles[]).length;
          if (leftBorder < 0) leftBorder = 0;
          return leftBorder;
        }
      );
      //Выкидываем из массива повторяющиеся элементы.
      this.modelData.bordersFillStrips =
        this.modelData.bordersFillStrips.filter((number, index, array) => {
          return array.indexOf(number) === index;
        });
      //сортировка по возростанию.
      this.modelData.bordersFillStrips = this.modelData.bordersFillStrips.sort(
        (a, b) => {
          return a - b;
        }
      );
    }
  };
  //Получить ссылку на объект модели.
  getModelData = (): IModelData => {
    return this.modelData;
  };
  //Задать значения свойствам модели, если те не были переданы User-ом.
  private _makeDefaultModelValues = (): void => {
    const modelData = this.modelData;
    if (modelData.minValue === undefined) modelData.minValue = -10;
    if (modelData.stepSize === undefined) modelData.stepSize = 1;
    if (modelData.maxValue === undefined) modelData.maxValue = 10;
    if (modelData.handles === undefined) modelData.handles = [{ value: 0 }];
    if (modelData.handlesCanPushed === undefined)
      modelData.handlesCanPushed = false;
    if (modelData.isVertical === undefined) modelData.isVertical = false;
    if (modelData.scaleData === undefined) {
      modelData.scaleData = {};
      if (modelData.scaleData.customMarkArray === undefined)
        modelData.scaleData.customMarkArray = [];
      if (modelData.scaleData.numberAutoMark === undefined)
        modelData.scaleData.numberAutoMark = 0;
    }
    if (modelData.bordersFillStrips === undefined)
      modelData.bordersFillStrips = [0];
    if (modelData.numberRounding === undefined) modelData.numberRounding = 0;
  };
}

export default Model;
