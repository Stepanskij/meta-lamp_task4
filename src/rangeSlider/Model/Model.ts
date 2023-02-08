import CustomEvent from "rangeSlider/Event/Event";
import CustomEventArgs from "rangeSlider/Event/EventArgs";
import EventArgs from "rangeSlider/Event/EventArgs";

import IModelData from "rangeSlider/Data/IModelData";
import IUserModelData from "rangeSlider/Data/IUserModelData";
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
    this.reconstructionHandlesArray(this.data.handles as number[]); //Переделывает массив рычажков(от меньшего к большем).
    this.makeMarkArray();
    this.sortIdFillStrips();
  };

  update = (newModelData?: IModelData) => {
    const modelData = this.data;
    if (newModelData) {
      if (newModelData.minValue !== undefined)
        modelData.minValue = newModelData.minValue;
      if (newModelData.shiftStepSize !== undefined)
        modelData.shiftStepSize = newModelData.shiftStepSize;
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
  private reconstructionHandlesArray = (handlesArray: number[]) => {
    const handles = handlesArray;
    this.data.handles = [];

    handles.forEach((handleValue) => {
      this.addHandle(handleValue);
    });
  };
  //
  addHandle = (value?: number) => {
    if (
      this.data.minValue !== undefined &&
      this.data.maxValue !== undefined &&
      this.data.shiftStepSize !== undefined &&
      this.data.maxShiftSteps !== undefined
    ) {
      if (value !== undefined) {
        //Корректировка value, учитывая размер шага shiftStepSize (на correctValue) с расчётом номера шага рычажка.
        let correctStep;
        if (value > this.data.maxValue) {
          correctStep =
            Math.abs(this.data.maxValue - this.data.minValue) /
            this.data.shiftStepSize;
        } else if (value < this.data.minValue) {
          correctStep = 0;
        } else {
          correctStep =
            Math.abs(value - this.data.minValue) / this.data.shiftStepSize;
        }

        correctStep = Math.round(correctStep);
        let correctValue = Number(
          (this.data.minValue + correctStep * this.data.shiftStepSize).toFixed(
            this.data.numberRounding
          )
        );
        //Помещение рычажка (объекта с данными) в массив.
        this.data.handles?.push(correctValue);
        //сортировка массива по возростанию .
        this.data.handles?.sort((a, b): number => {
          return a - b;
        });
      }
      //Добавление рычажка крайне справо, если не передаётся value.
      else {
        this.data.handles?.push(
          this.data.minValue + this.data.maxShiftSteps * this.data.shiftStepSize
        );
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
      this.data.shiftStepSize !== undefined
    ) {
      this.data.maxShiftSteps = Math.round(
        (this.data.maxValue - this.data.minValue) / this.data.shiftStepSize
      );
    }
  };

  private getNumberRounding = () => {
    if (
      this.data.maxValue !== undefined &&
      this.data.minValue !== undefined &&
      this.data.shiftStepSize !== undefined
    ) {
      let stepSizeRemainder = String(this.data.shiftStepSize).split(".")[1];
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
      this.data.shiftStepSize !== undefined
    ) {
      if (
        this.data.maxValue < this.data.minValue ||
        this.data.maxValue === this.data.minValue
      ) {
        this.data.maxValue = this.data.minValue + this.data.shiftStepSize;
      }
      let remainder =
        (this.data.maxValue - this.data.minValue) % this.data.shiftStepSize;
      if (remainder)
        this.data.maxValue = Number(
          (this.data.maxValue + this.data.shiftStepSize - remainder).toFixed(
            this.data.numberRounding
          )
        );
    }
  };

  private sortIdFillStrips = () => {
    if (this.data.idsFillStrip) {
      //Выкидывать выходящие за пределы ролика значения.
      this.data.idsFillStrip = this.data.idsFillStrip.filter((id) => {
        return !(id > (this.data.handles as number[]).length || id < 0);
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
        this.data.maxShiftSteps !== undefined &&
        this.data.shiftStepSize !== undefined
      ) {
        if (this.data.scaleData.numberGaps > 0) {
          this.data.scaleData.markArray?.push(this.data.minValue);
          this.data.scaleData.markArray?.push(this.data.maxValue);
        }
        if (this.data.scaleData.numberGaps > 1) {
          for (let i = 1; i <= this.data.scaleData.numberGaps - 1; i++) {
            const newMarkStep = Math.round(
              this.data.maxShiftSteps * (i / this.data.scaleData.numberGaps)
            );
            this.data.scaleData.markArray?.push(
              this.data.minValue + newMarkStep * this.data.shiftStepSize
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
    if (userData.shiftStepSize !== undefined)
      this.data.shiftStepSize = userData.shiftStepSize;
    if (userData.maxValue !== undefined) this.data.maxValue = userData.maxValue;
    if (userData.handles !== undefined) this.data.handles = userData.handles;
    if (userData.handlesCanPushed !== undefined)
      this.data.handlesCanPushed = userData.handlesCanPushed;
    if (userData.isVertical !== undefined)
      this.data.isVertical = userData.isVertical;
    if (userData.idsFillStrip !== undefined)
      this.data.idsFillStrip = userData.idsFillStrip;
    if (userData.numberGaps !== undefined)
      (this.data.scaleData as IScaleData).numberGaps = userData.numberGaps;
  };
  //Задать значения свойствам модели, если те не были переданы User-ом.
  private makeDefaultModelValues = () => {
    if (this.data.minValue === undefined) this.data.minValue = -10;
    if (this.data.shiftStepSize === undefined) this.data.shiftStepSize = 1;
    if (this.data.maxValue === undefined) this.data.maxValue = 10;
    if (this.data.handles === undefined || this.data.handles.length === 0)
      this.data.handles = [0];
    if (this.data.handlesCanPushed === undefined)
      this.data.handlesCanPushed = false;
    if (this.data.isVertical === undefined) this.data.isVertical = false;
    if (this.data.scaleData === undefined) this.data.scaleData = {};
    if (this.data.scaleData.numberGaps === undefined)
      this.data.scaleData.numberGaps = 1;
    if (this.data.idsFillStrip === undefined) this.data.idsFillStrip = [0];
    if (this.data.numberRounding === undefined) this.data.numberRounding = 0;
  };
  //
  updateHandle = ({
    handleId,
    relativeValue,
  }: {
    handleId: number;
    relativeValue: number;
  }) => {
    const newModelData: IModelData = {};

    if (
      this.data.handles &&
      this.data.shiftStepSize &&
      this.data.minValue &&
      this.data.maxValue
    ) {
      let nearestCorrectValue = Number(
        (
          Math.round(relativeValue / this.data.shiftStepSize) *
          this.data.shiftStepSize
        ).toFixed(this.data.numberRounding)
      );

      if (!this.data.handlesCanPushed) {
        //Невозможность перескочить правый рычажок.
        if (handleId < this.data.handles.length - 1) {
          if (nearestCorrectValue > this.data.handles[handleId + 1])
            nearestCorrectValue = this.data.handles[handleId + 1];
        }
        //Невозможность перескочить левый рычажок.
        if (handleId > 0) {
          if (nearestCorrectValue < this.data.handles[handleId - 1])
            nearestCorrectValue = this.data.handles[handleId - 1];
        }
      }

      //Невозможность выйти за границы ролика.
      if (nearestCorrectValue < this.data.minValue) {
        nearestCorrectValue = this.data.minValue;
      } else if (nearestCorrectValue > this.data.maxValue) {
        nearestCorrectValue = this.data.maxValue;
      }

      //Возможность толкать рычажки на своём пути.
      if (this.data.handlesCanPushed) {
        this.data.handles.forEach((handleValue, index) => {
          //Толкание влево.
          if (index < handleId && nearestCorrectValue < handleValue)
            handleValue = nearestCorrectValue;
          //Толкание вправо.
          else if (index > handleId && nearestCorrectValue > handleValue)
            handleValue = nearestCorrectValue;
        });
      }

      this.data.handles[handleId] = nearestCorrectValue;

      this.update(newModelData);
    }
  };

  //Изменение позиции рычажка мышью.
  DaDModelUpdate = (handleMoveArgs?: CustomEventArgs<IDnDArgsUpdate>) => {
    if (
      handleMoveArgs &&
      this.data.handles &&
      this.data.maxShiftSteps !== undefined &&
      this.data.minValue !== undefined &&
      this.data.maxValue !== undefined &&
      this.data.shiftStepSize
    ) {
      const rollerLength = this.data.maxValue - this.data.minValue;
      let relativeValue: number = 0;
      if (!this.data.isVertical) {
        relativeValue =
          this.data.minValue +
          (rollerLength * handleMoveArgs.data.rightShiftX) /
            handleMoveArgs.data.rollerWidth;
      } else {
        relativeValue =
          this.data.minValue +
          (rollerLength * handleMoveArgs.data.upShiftY) /
            handleMoveArgs.data.rollerHeight;
      }

      this.updateHandle({
        relativeValue,
        handleId: handleMoveArgs.data.eventElementId,
      });
    }
  };

  markerModelUpdate = (
    ScaleMarkArgs?: CustomEventArgs<IScaleMarkHandlerArgsUpdate>
  ) => {
    const newModelData: IModelData = {};

    if (
      ScaleMarkArgs &&
      this.data.handles &&
      this.data.shiftStepSize !== undefined &&
      this.data.minValue !== undefined
    ) {
      let arrAbs: Array<number>;
      arrAbs = this.data.handles.map((handleValue) => {
        return Math.abs(handleValue - ScaleMarkArgs.data.markerValue);
      });
      const minHandleIndex = arrAbs.indexOf(Math.min(...arrAbs)); //Индекс ближайшего к маркеру рычажка.

      this.updateHandle({
        handleId: minHandleIndex,
        relativeValue: ScaleMarkArgs.data.markerValue,
      });

      this.update(newModelData);
    }
  };

  rollerModelUpdate = (
    rollerClickArgs?: CustomEventArgs<IRollerHandlerArgsUpdate>
  ) => {
    const newModelData: IModelData = {};
    rollerClickArgs;
    if (
      rollerClickArgs &&
      this.data.handles &&
      this.data.maxShiftSteps !== undefined &&
      this.data.minValue !== undefined &&
      this.data.maxValue !== undefined &&
      this.data.shiftStepSize
    ) {
      const rollerLength = this.data.maxValue - this.data.minValue;
      let relativeValue: number = 0;

      if (!this.data.isVertical) {
        relativeValue =
          this.data.minValue +
          (rollerLength * rollerClickArgs.data.rightShiftX) /
            rollerClickArgs.data.rollerWidth;
      } else {
        relativeValue =
          this.data.minValue +
          (rollerLength * rollerClickArgs.data.upShiftY) /
            rollerClickArgs.data.rollerHeight;
      }

      let arrAbs: Array<number>;
      arrAbs = this.data.handles.map((handleValue) => {
        return Math.abs(handleValue - relativeValue);
      });
      const minHandleIndex = arrAbs.indexOf(Math.min(...arrAbs)); //Индекс ближайшего к маркеру рычажка.

      this.updateHandle({
        relativeValue,
        handleId: minHandleIndex,
      });
    }
  };

  //
  getHandleValue = (numberHandle: number): number | undefined => {
    if (
      this.data.handles &&
      numberHandle < this.data.handles.length &&
      numberHandle >= 0
    )
      return this.data.handles[numberHandle];
  };

  setHandleValue = (numberHandle: number, valueHandle: number) => {
    if (
      this.data.handles &&
      numberHandle < this.data.handles.length &&
      numberHandle >= 0
    ) {
      this.data.handles[numberHandle] = valueHandle;
      this.data.handles.forEach((handleValue, index) => {
        if (index > numberHandle) {
          if (handleValue < valueHandle) handleValue = valueHandle;
        }
        if (index < numberHandle) {
          if (handleValue > valueHandle) handleValue = valueHandle;
        }
      });
    }
  };
}

export default Model;
