import IModelData from "rangeSlider/Data/IModelData";
import IScaleData from "rangeSlider/Data/IScaleData";

class scaleDataMethods {
  private scaleData: IScaleData;

  constructor(private modelData: IModelData) {
    this.scaleData = this.modelData.scaleData as IScaleData;
  }
  //Исправляет значение кастомной метки, приравнивая значение к ближайшему возможному значению.
  fixedCustomMark = (): void => {
    if (
      this.scaleData.customMarkArray !== undefined &&
      this.scaleData.customMarkArray.length
    ) {
      this.scaleData.customMarkArray = this.scaleData.customMarkArray.map(
        (markValue): number => {
          let fixValue = 0;
          if (
            this.modelData.maxValue !== undefined &&
            this.modelData.stepSize !== undefined &&
            this.modelData.minValue !== undefined
          ) {
            const stepOfMark = Math.round(
              (markValue - this.modelData.minValue) / this.modelData.stepSize
            );

            fixValue =
              this.modelData.minValue + stepOfMark * this.modelData.stepSize;
          }
          return fixValue;
        }
      );
    }
  };
  fixedNumberAutoMark = (): void => {
    if (
      this.scaleData.numberAutoMark !== undefined &&
      this.modelData.maxSteps !== undefined
    ) {
      if (this.scaleData.numberAutoMark > this.modelData.maxSteps + 1) {
        this.scaleData.numberAutoMark = this.modelData.maxSteps + 1;
      }
    }
  };
  //Создание массива меток, исходя из числа автоматически создоваемых меток.
  private makeAutoMarkArray = (numberAutoMark: number): number[] => {
    let markArray: number[] = [];
    if (
      this.modelData.minValue !== undefined &&
      this.modelData.maxSteps !== undefined &&
      this.modelData.stepSize !== undefined
    ) {
      if (numberAutoMark >= 1) markArray.push(this.modelData.minValue); //Добавить метку начала.
      if (numberAutoMark >= 2)
        markArray.push(this.modelData.maxValue as number); //Добавить метку конца.
      if (numberAutoMark >= 3)
        markArray.push(
          this.modelData.minValue +
            Math.round(this.modelData.maxSteps / 2) * this.modelData.stepSize
        ); //Добавить метку середины.
      //Добавление оставшихся меток между началом, центром и концом.
      if (numberAutoMark > 3) {
        if (
          markArray[2] !== undefined && //markArray[2] - центр
          markArray[1] !== undefined && //markArray[1] - конец
          markArray[0] !== undefined //markArray[0] - начало
        ) {
          const numberOtherAutoMark = numberAutoMark - 3;

          const numberAutoMarkLeftPart =
            Math.trunc(numberOtherAutoMark / 2) + (numberOtherAutoMark % 2); //Количество делений слева от центра.
          const lengthLeft = markArray[2] - markArray[0]; //Середина минус начало = левая длина.
          const lengthLeftOnePart = lengthLeft / numberAutoMarkLeftPart; //Длина одной части слева.
          //Добавление всех меток слева от центра.
          for (let i = 1; i <= numberAutoMarkLeftPart; i++) {
            const centerOfPart =
              markArray[0] +
              lengthLeftOnePart * (i - 1) +
              lengthLeftOnePart / 2;
            const stepOfCenterPath = Math.round(
              (centerOfPart - markArray[0]) / this.modelData.stepSize
            );
            const valueOfCenterPath: number =
              markArray[0] + stepOfCenterPath * this.modelData.stepSize;
            markArray.push(valueOfCenterPath);
          }
          if (numberAutoMark > 4) {
            const numberAutoMarkRightPart = Math.trunc(numberOtherAutoMark / 2); //Количество делений справа от центра.
            const lengthRight = markArray[1] - markArray[2]; //Конец минус середина = правая длина.
            const lengthRightOnePart = lengthRight / numberAutoMarkRightPart; //Длина одной части справа.
            //Добавление всех меток справа от центра.
            for (let i = 1; i <= numberAutoMarkRightPart; i++) {
              const centerOfPart =
                markArray[2] +
                lengthRightOnePart * (i - 1) +
                lengthRightOnePart / 2;
              const stepOfCenterPath = Math.round(
                (centerOfPart - markArray[2]) / this.modelData.stepSize
              );
              const valueOfCenterPath: number =
                markArray[2] + stepOfCenterPath * this.modelData.stepSize;
              markArray.push(valueOfCenterPath);
            }
          }
        }
      }
    }
    return markArray;
  };

  makeMarkArray = (): void => {
    const autoMarkArray = this.makeAutoMarkArray(
      this.scaleData.numberAutoMark as number
    );
    if (this.scaleData.customMarkArray !== undefined) {
      //Объединение кастомного и автоматически созданного массива.
      this.scaleData.markArray = autoMarkArray.concat(
        this.scaleData.customMarkArray
      );
      //Выкидывание, выхдящих за пределы ролика, значений.
      this.scaleData.markArray = this.scaleData.markArray.filter((number) => {
        return (
          this.modelData.maxValue !== undefined &&
          this.modelData.minValue !== undefined &&
          !(
            number > this.modelData.maxValue || number < this.modelData.minValue
          )
        );
      });
      //Выкидываем из массива повторяющиеся элементы.
      this.scaleData.markArray = this.scaleData.markArray.filter(
        (number, index, array) => {
          return array.indexOf(number) === index;
        }
      );
      //Сортировка значений по возростанию.
      this.scaleData.markArray.sort((a, b) => {
        return a - b;
      });
      //Округление значений.
      this.scaleData.markArray = this.scaleData.markArray.map((number) => {
        return Number(number.toFixed(this.modelData.numberRounding));
      });
    }
  };
}

export default scaleDataMethods;
