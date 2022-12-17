import IModelData from "rangeSlider/Data/IModelData";
import IHandles from "rangeSlider/Data/IHandles";
import IHandleMouseMove from "rangeSlider/Data/IHandleMouseMove";

import scaleDataMethods from "./modelParts/scaleDataMethods";
import CustomEvent from "rangeSlider/Event/Event";
import CustomEventArgs from "rangeSlider/Event/EventArgs";
import EventArgs from "rangeSlider/Event/EventArgs";

class Model {
  data: IModelData = {};
  scaleDataMethods: scaleDataMethods;
  customEvents = {
    onUpdate: new CustomEvent<IModelData>(),
  };

  constructor(data?: IModelData) {
    if (data) this.data = data;
    this.makeDefaultModelValues(); //Добавляет дефолтное значение значение, если то не было передано.
    this.scaleDataMethods = new scaleDataMethods(this.data); //Записывает методы работы над свойстом scaleData объекта data.
  }

  loadContent = () => {
    this.getNumberRounding(); //Корректирует количество значений после запятой.
    this.fixMaxValue(); //Исправляет максимальное значение.
    this.getMaxSteps(); //Расчитывает колличество делений ролика.
    this.sortBordersFillStrips(); //Сортирует массив полос заполненности.
    this.reconstructionHandlesArray(this.data.handles as IHandles[]); //Переделывает массив рычажков(от меньшего к большем).
    this.scaleDataMethods.fixedCustomMark();
    this.scaleDataMethods.fixedNumberAutoMark();
    this.scaleDataMethods.makeMarkArray();
  };
  update = (mouseMoveArgs?: CustomEventArgs<IHandleMouseMove>): void => {
    if (mouseMoveArgs !== undefined) {
      this.newHandlePosition(mouseMoveArgs);
    }
    //Запуск методов, что выполняются при обновлении модели.
    this.customEvents.onUpdate.dispatch(new EventArgs({ ...this.data }));
  };
  //Создание массива рычажков при создании класса Model.
  private reconstructionHandlesArray = (handlesArray: IHandles[]): void => {
    const handles = handlesArray;
    this.data.handles = [];

    handles.forEach((handleObj): void => {
      this.addHandle(handleObj.value);
    });
  };
  //Добавить рычажок в конец массива. Использование value добавляет рычажок в конкретном (из возможных) месте.
  addHandle = (value?: number): void => {
    if (
      this.data.minValue !== undefined &&
      this.data.maxValue !== undefined &&
      this.data.stepSize !== undefined &&
      this.data.maxSteps !== undefined
    ) {
      if (value !== undefined) {
        //Корректировка value, учитывая размер шага stepSize (на correctValue) с расчётом номера шага рычажка.
        let correctStep;
        if (value > this.data.maxValue) {
          correctStep =
            Math.abs(this.data.maxValue - this.data.minValue) /
            this.data.stepSize;
        } else if (value < this.data.minValue) {
          correctStep = 0;
        } else {
          correctStep =
            Math.abs(value - this.data.minValue) / this.data.stepSize;
        }

        correctStep = Math.round(correctStep);
        let correctValue = Number(
          (this.data.minValue + correctStep * this.data.stepSize).toFixed(
            this.data.numberRounding
          )
        );
        //Помещение рычажка (объекта с данными) в массив.
        this.data.handles?.push({
          value: correctValue,
          step: correctStep,
        });
        //сортировка массива по возростанию handles.value.
        this.data.handles?.sort((a, b): number => {
          return a.value - b.value;
        });
      }
      //Добавление рычажка крайне справо, если не передаётся value.
      else {
        this.data.handles?.push({
          value: this.data.minValue + this.data.maxSteps * this.data.stepSize,
          step: this.data.maxSteps,
        });
      }
    }
  };
  //Убрать крайний рычажок (последний, из массива).
  removeHandle = (): void => {
    this.data.handles?.pop();
  };
  //Расчёт количества шагов (делений) слайдера.
  getMaxSteps = (): void => {
    if (
      this.data.maxValue !== undefined &&
      this.data.minValue !== undefined &&
      this.data.stepSize !== undefined
    ) {
      this.data.maxSteps = Math.round(
        (this.data.maxValue - this.data.minValue) / this.data.stepSize
      );
    }
  };
  //Расчёт количества цифр после запятой.
  getNumberRounding = (): void => {
    if (
      this.data.maxValue !== undefined &&
      this.data.minValue !== undefined &&
      this.data.stepSize !== undefined
    ) {
      let stepSizeRemainder = String(this.data.stepSize).split(".")[1];
      let minValueRemainder = String(this.data.minValue).split(".")[1];
      let maxValueRemainder = String(this.data.maxValue).split(".")[1];
      if (stepSizeRemainder === undefined) stepSizeRemainder = "";
      if (minValueRemainder === undefined) minValueRemainder = "";
      if (maxValueRemainder === undefined) maxValueRemainder = "";
      this.data.numberRounding = Math.max(
        stepSizeRemainder.length,
        minValueRemainder.length,
        maxValueRemainder.length
      );
    }
  };
  //Исправляет максимальное значение слайдера, по отношению к неизменным минимальному зачению и шагу.
  fixMaxValue = (): void => {
    if (
      this.data.maxValue !== undefined &&
      this.data.minValue !== undefined &&
      this.data.stepSize !== undefined
    ) {
      let remainder =
        (this.data.maxValue - this.data.minValue) % this.data.stepSize;
      if (remainder)
        this.data.maxValue = Number(
          (this.data.maxValue + this.data.stepSize - remainder).toFixed(
            this.data.numberRounding
          )
        );
    }
  };
  //Сортировать массив bordersFillStrips на некорректные значения.
  sortBordersFillStrips = (): void => {
    if (this.data.bordersFillStrips) {
      //Округляем выходящие за пределы ролика значения.
      this.data.bordersFillStrips = this.data.bordersFillStrips.map(
        (number): number => {
          let leftBorder = number;
          if (leftBorder > (this.data.handles as IHandles[]).length)
            leftBorder = (this.data.handles as IHandles[]).length;
          if (leftBorder < 0) leftBorder = 0;
          return leftBorder;
        }
      );
      //Выкидываем из массива повторяющиеся элементы.
      this.data.bordersFillStrips = this.data.bordersFillStrips.filter(
        (number, index, array) => {
          return array.indexOf(number) === index;
        }
      );
      //сортировка по возростанию.
      this.data.bordersFillStrips = this.data.bordersFillStrips.sort((a, b) => {
        return a - b;
      });
    }
  };
  //Задать значения свойствам модели, если те не были переданы User-ом.
  private makeDefaultModelValues = (): void => {
    const data = this.data;
    if (data.minValue === undefined) data.minValue = -10;
    if (data.stepSize === undefined) data.stepSize = 1;
    if (data.maxValue === undefined) data.maxValue = 10;
    if (data.handles === undefined) data.handles = [{ value: 0 }];
    if (data.handlesCanPushed === undefined) data.handlesCanPushed = false;
    if (data.isVertical === undefined) data.isVertical = false;
    if (data.scaleData === undefined) {
      data.scaleData = {};
      if (data.scaleData.customMarkArray === undefined)
        data.scaleData.customMarkArray = [];
      if (data.scaleData.numberAutoMark === undefined)
        data.scaleData.numberAutoMark = 0;
    }
    if (data.bordersFillStrips === undefined) data.bordersFillStrips = [0];
    if (data.numberRounding === undefined) data.numberRounding = 0;
  };
  //Изменение позиции рычажка.
  private newHandlePosition = (
    handleMoveArgs: CustomEventArgs<IHandleMouseMove>
  ): void => {
    if (
      this.data.handles &&
      this.data.maxSteps &&
      this.data.minValue &&
      this.data.stepSize
    ) {
      let stepNow: number = 0;
      const stepWidth = handleMoveArgs.data.rollerWidth / this.data.maxSteps;
      const stepHeight = handleMoveArgs.data.rollerHeight / this.data.maxSteps;
      const handleIndex = handleMoveArgs.data.eventElementIndex;
      const handleObj = this.data.handles[handleIndex];

      if (!this.data.isVertical) {
        stepNow = Math.round(handleMoveArgs.data.rightShiftX / stepWidth);
      } else if (this.data.maxSteps)
        stepNow =
          this.data.maxSteps -
          Math.round(handleMoveArgs.data.upShiftY / stepHeight);

      if (handleObj) {
        //Невозможность перескочить соседние рычажки (когда отсутствует толкание).
        if (!this.data.handlesCanPushed && this.data.handles) {
          //Невозможность перескочить правый рычажок.
          if (
            handleIndex < this.data.handles.length - 1 &&
            this.data.handles[handleIndex + 1].step !== undefined
          ) {
            if (stepNow > (this.data.handles[handleIndex + 1].step as number)) {
              stepNow = this.data.handles[handleIndex + 1].step as number;
            }
          }
          //Невозможность перескочить левый рычажок.
          if (
            handleIndex !== 0 &&
            this.data.handles[handleIndex - 1].step !== undefined
          ) {
            if (stepNow < (this.data.handles[handleIndex - 1].step as number)) {
              stepNow = this.data.handles[handleIndex - 1].step as number;
            }
          }
        }

        //Невозможность выйти за границы ролика.
        if (stepNow < 0) {
          stepNow = 0;
        } else if (
          stepNow > (this.data.maxSteps as number) &&
          this.data.maxSteps
        ) {
          stepNow = this.data.maxSteps;
        }
        //Смена позиции данного рычажка.
        handleObj.step = stepNow;
        handleObj.value = Number(
          (this.data.minValue + stepNow * this.data.stepSize).toFixed(
            this.data.numberRounding
          )
        );
        //Возможность толкать рычажки на своём пути.
        if (this.data.handlesCanPushed && this.data.handles) {
          this.data.handles.forEach((handleObj, index) => {
            //Шаг проверяемого рычажка.
            const stepHandle = (this.data.handles as IHandles[])[index];
            //Толкание влево.
            if (
              index < handleIndex &&
              (stepHandle.step as number) > stepNow &&
              handleObj
            ) {
              stepHandle.step = stepNow;
              stepHandle.value = handleObj.value;
            }
            //Толкание вправо.
            if (
              index > handleIndex &&
              (stepHandle.step as number) < stepNow &&
              handleObj
            ) {
              stepHandle.step = stepNow;
              stepHandle.value = handleObj.value;
            }
          });
        }
      }
    }
  };
}

export default Model;
