import IModelData from "rangeSlider/Data/IModelData";
import IScaleData from "rangeSlider/Data/IScaleData";

class scaleDataMethods {
  private scaleData: IScaleData;

  constructor(private modelData: IModelData) {
    this.scaleData = this.modelData.scaleData as IScaleData;
  }

  makeMarkArray = (): void => {
    this.scaleData.markArray = [];
    //Запись возможных марок в массив.
    if (
      this.scaleData.numberGaps &&
      this.modelData.minValue !== undefined &&
      this.modelData.maxValue !== undefined &&
      this.modelData.maxSteps !== undefined &&
      this.modelData.stepSize !== undefined
    ) {
      if (this.scaleData.numberGaps > 0) {
        this.scaleData.markArray?.push(this.modelData.minValue);
        this.scaleData.markArray?.push(this.modelData.maxValue);
      }
      if (this.scaleData.numberGaps > 1) {
        for (let i = 1; i <= this.scaleData.numberGaps - 1; i++) {
          const newMarkStep = Math.round(
            this.modelData.maxSteps * (i / this.scaleData.numberGaps)
          );
          this.scaleData.markArray?.push(
            this.modelData.minValue + newMarkStep * this.modelData.stepSize
          );
        }
      }
    }
    //
    //Выкидывание, выхдящих за пределы ролика, значений.
    this.scaleData.markArray = this.scaleData.markArray.filter((number) => {
      return (
        this.modelData.maxValue !== undefined &&
        this.modelData.minValue !== undefined &&
        !(number > this.modelData.maxValue || number < this.modelData.minValue)
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
  };
}

export default scaleDataMethods;
