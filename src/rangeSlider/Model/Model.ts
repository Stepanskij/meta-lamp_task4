import CustomEvent from "rangeSlider/Event/Event";
import CustomEventArgs from "rangeSlider/Event/EventArgs";
import EventArgs from "rangeSlider/Event/EventArgs";

import IModelData from "rangeSlider/Data/IModelData";
import IUserModelData from "rangeSlider/Data/IUserModelData";
import IHandles from "rangeSlider/Data/IHandles";
import IDnDArgsUpdate from "rangeSlider/Data/updateArgs/IDaDHandlerArgsUpdate";
import IScaleData from "rangeSlider/Data/IScaleData";
import IScaleMarkHandlerArgsUpdate from "rangeSlider/Data/updateArgs/IScaleMarkHandlerArgsUpdate";
import IRollerHandlerArgsUpdate from "rangeSlider/Data/updateArgs/IRollerHandlerArgsUpdate";

class Model {
  data: IModelData = {
    handles: [],
    scaleData: {},
  };
  customEvents = {
    onUpdate: new CustomEvent<IModelData>(),
  };

  constructor(private userData?: IUserModelData) {
    if (this.userData) this.putUserData(this.userData);
    this.makeDefaultModelValues();
  }

  loadContent = () => {
    this.fixMaxValue();
    this.getNumberRounding();
    this.getMaxSteps();
    this.reconstructionHandlesArray(this.data.handles as IHandles[]); //Переделывает массив рычажков(от меньшего к большем).
    this.makeMarkArray();
    this.sortIdFillStrips();
  };
  update = (newModelData?: IModelData) => {
    const modelData = this.data;
    if (newModelData) {
      if (newModelData.minValue !== undefined)
        modelData.minValue = newModelData.minValue;
      if (newModelData.stepSize !== undefined)
        modelData.stepSize = newModelData.stepSize;
      if (newModelData.maxValue !== undefined)
        modelData.maxValue = newModelData.maxValue;
      if (newModelData.handles !== undefined)
        modelData.handles = newModelData.handles;
      if (newModelData.handlesCanPushed !== undefined)
        modelData.handlesCanPushed = newModelData.handlesCanPushed;
      if (newModelData.isVertical !== undefined)
        modelData.isVertical = newModelData.isVertical;
      if (newModelData.scaleData !== undefined) {
        if (modelData.scaleData === undefined) modelData.scaleData = {};
        if (newModelData.scaleData.numberGaps !== undefined)
          modelData.scaleData.numberGaps = newModelData.scaleData.numberGaps;
      }
      if (newModelData.idsFillStrip !== undefined)
        modelData.idsFillStrip = newModelData.idsFillStrip;
      if (newModelData.numberRounding !== undefined)
        modelData.numberRounding = newModelData.numberRounding;
    }
    //Запуск методов, что выполняются при обновлении модели.
    this.customEvents.onUpdate.dispatch(new EventArgs({ ...this.data }));
  };
  //
  private reconstructionHandlesArray = (handlesArray: IHandles[]) => {
    const handles = handlesArray;
    this.data.handles = [];

    handles.forEach((handleObj) => {
      this.addHandle(handleObj.value);
    });
  };
  //
  addHandle = (value?: number) => {
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

  removeHandle = () => {
    this.data.handles?.pop();
  };
  //
  private getMaxSteps = () => {
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

  private getNumberRounding = () => {
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

  private fixMaxValue = () => {
    if (
      this.data.maxValue !== undefined &&
      this.data.minValue !== undefined &&
      this.data.stepSize !== undefined
    ) {
      if (
        this.data.maxValue < this.data.minValue ||
        this.data.maxValue === this.data.minValue
      ) {
        this.data.maxValue = this.data.minValue + this.data.stepSize;
      }
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

  private sortIdFillStrips = () => {
    if (this.data.idsFillStrip) {
      //Выкидывать выходящие за пределы ролика значения.
      this.data.idsFillStrip = this.data.idsFillStrip.filter((id) => {
        return !(id > (this.data.handles as IHandles[]).length || id < 0);
      });
      //Выкидываем из массива повторяющиеся элементы.
      this.data.idsFillStrip = this.data.idsFillStrip.filter(
        (id, index, array) => {
          return array.indexOf(id) === index;
        }
      );
      //сортировка по возростанию.
      this.data.idsFillStrip = this.data.idsFillStrip.sort((a, b) => {
        return a - b;
      });
    }
  };
  //Создание массива меток мерной шкалы.
  private makeMarkArray = () => {
    if (this.data.scaleData) {
      this.data.scaleData.markArray = [];
      //Запись возможных марок в массив.
      if (
        this.data.scaleData.numberGaps &&
        this.data.minValue !== undefined &&
        this.data.maxValue !== undefined &&
        this.data.maxSteps !== undefined &&
        this.data.stepSize !== undefined
      ) {
        if (this.data.scaleData.numberGaps > 0) {
          this.data.scaleData.markArray?.push(this.data.minValue);
          this.data.scaleData.markArray?.push(this.data.maxValue);
        }
        if (this.data.scaleData.numberGaps > 1) {
          for (let i = 1; i <= this.data.scaleData.numberGaps - 1; i++) {
            const newMarkStep = Math.round(
              this.data.maxSteps * (i / this.data.scaleData.numberGaps)
            );
            this.data.scaleData.markArray?.push(
              this.data.minValue + newMarkStep * this.data.stepSize
            );
          }
        }
      }
      //
      //Выкидывание, выхдящих за пределы ролика, значений.
      this.data.scaleData.markArray = this.data.scaleData.markArray.filter(
        (number) => {
          return (
            this.data.maxValue !== undefined &&
            this.data.minValue !== undefined &&
            !(number > this.data.maxValue || number < this.data.minValue)
          );
        }
      );
      //Выкидываем из массива повторяющиеся элементы.
      this.data.scaleData.markArray = this.data.scaleData.markArray.filter(
        (number, index, array) => {
          return array.indexOf(number) === index;
        }
      );
      //Сортировка значений по возростанию.
      this.data.scaleData.markArray.sort((a, b) => {
        return a - b;
      });
      //Округление значений.
      this.data.scaleData.markArray = this.data.scaleData.markArray.map(
        (number) => {
          return Number(number.toFixed(this.data.numberRounding));
        }
      );
    }
  };
  //Поместить значения из userData в modelData.
  putUserData = (userData: IUserModelData) => {
    if (userData.minValue !== undefined) this.data.minValue = userData.minValue;
    if (userData.stepSize !== undefined) this.data.stepSize = userData.stepSize;
    if (userData.maxValue !== undefined) this.data.maxValue = userData.maxValue;
    if (userData.handles !== undefined)
      this.data.handles = userData.handles.map((valueHandle) => {
        return { value: valueHandle };
      });
    if (userData.handlesCanPushed !== undefined)
      this.data.handlesCanPushed = userData.handlesCanPushed;
    if (userData.isVertical !== undefined)
      this.data.isVertical = userData.isVertical;
    if (userData.idsFillStrip !== undefined)
      this.data.idsFillStrip = userData.idsFillStrip;
    if (userData.numberGaps !== undefined)
      (this.data.scaleData as IScaleData).numberGaps = userData.numberGaps;
    if (userData.numberRounding !== undefined)
      this.data.numberRounding = userData.numberRounding;
  };
  //Задать значения свойствам модели, если те не были переданы User-ом.
  private makeDefaultModelValues = () => {
    if (this.data.minValue === undefined) this.data.minValue = -10;
    if (this.data.stepSize === undefined) this.data.stepSize = 1;
    if (this.data.maxValue === undefined) this.data.maxValue = 10;
    if (this.data.handles === undefined || this.data.handles.length === 0)
      this.data.handles = [{ value: 0 }];
    if (this.data.handlesCanPushed === undefined)
      this.data.handlesCanPushed = false;
    if (this.data.isVertical === undefined) this.data.isVertical = false;
    if (this.data.scaleData === undefined) this.data.scaleData = {};
    if (this.data.scaleData.numberGaps === undefined)
      this.data.scaleData.numberGaps = 1;
    if (this.data.idsFillStrip === undefined) this.data.idsFillStrip = [0];
    if (this.data.numberRounding === undefined) this.data.numberRounding = 0;
  };
  //Изменение позиции рычажка мышью.
  DaDModelUpdate = (handleMoveArgs?: CustomEventArgs<IDnDArgsUpdate>) => {
    const newModelData: IModelData = {};
    if (
      handleMoveArgs &&
      this.data.handles &&
      this.data.maxSteps !== undefined &&
      this.data.minValue !== undefined &&
      this.data.stepSize
    ) {
      let stepNow: number = 0;
      const stepWidth = handleMoveArgs.data.rollerWidth / this.data.maxSteps;
      const stepHeight = handleMoveArgs.data.rollerHeight / this.data.maxSteps;
      const handleIndex = handleMoveArgs.data.eventElementId;
      const handleObjByIndex = this.data.handles[handleIndex];

      if (!this.data.isVertical) {
        stepNow = Math.round(handleMoveArgs.data.rightShiftX / stepWidth);
      } else if (this.data.maxSteps)
        stepNow =
          this.data.maxSteps -
          Math.round(handleMoveArgs.data.upShiftY / stepHeight);
      if (handleObjByIndex) {
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
        handleObjByIndex.step = stepNow;
        handleObjByIndex.value = Number(
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
              stepHandle.value = handleObjByIndex.value;
            }
            //Толкание вправо.
            if (
              index > handleIndex &&
              (stepHandle.step as number) < stepNow &&
              handleObj
            ) {
              stepHandle.step = stepNow;
              stepHandle.value = handleObjByIndex.value;
            }
          });
        }
      }
    }
    this.update(newModelData);
  };

  markerModelUpdate = (
    handleMoveArgs?: CustomEventArgs<IScaleMarkHandlerArgsUpdate>
  ) => {
    const newModelData: IModelData = {};
    let newHandlesArr: IHandles[] = [...(this.data.handles as IHandles[])];
    if (
      handleMoveArgs &&
      this.data.minValue !== undefined &&
      this.data.stepSize
    ) {
      let arrAbs: Array<number>;
      arrAbs = (newHandlesArr as IHandles[]).map((handleObj) => {
        return Math.abs(handleObj.value - handleMoveArgs.data.markerValue);
      });
      const minHandleIndex = arrAbs.indexOf(Math.min(...arrAbs)); //Индекс ближайшего к маркеру рычажка.
      newHandlesArr[minHandleIndex].value = handleMoveArgs.data.markerValue;
      newHandlesArr[minHandleIndex].step = Math.round(
        (handleMoveArgs.data.markerValue - this.data.minValue) /
          this.data.stepSize
      );
      newModelData.handles = newHandlesArr;
      this.update(newModelData);
    }
  };

  rollerModelUpdate = (
    rollerClickArgs?: CustomEventArgs<IRollerHandlerArgsUpdate>
  ) => {
    const newModelData: IModelData = {};
    let newHandlesArr: IHandles[] = [...(this.data.handles as IHandles[])];
    let nearestStep: number = 0;

    if (rollerClickArgs && this.data.maxSteps) {
      const stepWidth = rollerClickArgs.data.rollerWidth / this.data.maxSteps;
      const stepHeight = rollerClickArgs.data.rollerHeight / this.data.maxSteps;
      if (!this.data.isVertical) {
        nearestStep = Math.round(rollerClickArgs.data.rightShiftX / stepWidth);
      } else if (this.data.maxSteps)
        nearestStep =
          this.data.maxSteps -
          Math.round(rollerClickArgs.data.upShiftY / stepHeight);
    }
    if (this.data.minValue && this.data.stepSize) {
      let arrAbs: Array<number>;
      arrAbs = (newHandlesArr as IHandles[]).map((handleObj) => {
        return Math.abs((handleObj.step as number) - nearestStep);
      });
      const minHandleIndex = arrAbs.indexOf(Math.min(...arrAbs)); //Индекс ближайшего к маркеру рычажка.
      newHandlesArr[minHandleIndex].step = nearestStep;
      newHandlesArr[minHandleIndex].value = Number(
        (this.data.minValue + nearestStep * this.data.stepSize).toFixed(
          this.data.numberRounding
        )
      );
      newModelData.handles = newHandlesArr;
    }
    this.update(newModelData);
  };

  //
  getHandleValue = (numberHandle: number): number | undefined => {
    if (
      this.data.handles &&
      numberHandle < this.data.handles.length &&
      numberHandle >= 0
    )
      return this.data.handles[numberHandle].value;
  };

  setHandleValue = (numberHandle: number, valueHandle: number) => {
    if (
      this.data.handles &&
      numberHandle < this.data.handles.length &&
      numberHandle >= 0
    ) {
      this.data.handles[numberHandle].value = valueHandle;
      this.data.handles.forEach((handleObj, index) => {
        if (index > numberHandle) {
          if (handleObj.value < valueHandle) handleObj.value = valueHandle;
        }
        if (index < numberHandle) {
          if (handleObj.value > valueHandle) handleObj.value = valueHandle;
        }
      });
    }
  };
}

export default Model;
