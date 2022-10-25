import IModelData from "rangeSlider/Data/IModelData";
import IScaleData from "rangeSlider/Data/IScaleData";

class scaleDataMethods {
  private scaleData: IScaleData;

  constructor(private modelData: IModelData) {
    this.scaleData = this.modelData.scaleData as IScaleData;
    this.fixedCustomMark();
    this.makeMarkArray();
  }
  //Исправляет значение кастомной метки, приравнивая значение к ближайшему возможному значению.
  fixedCustomMark = (): void => {
    if (this.scaleData.customMark) {
      this.scaleData.customMark = this.scaleData.customMark.map(
        (markValue): number => {
          let fixValue = 0;
          if (
            this.modelData.maxValue &&
            this.modelData.stepSize &&
            this.modelData.minValue
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
  //Создание массива меток.
  makeMarkArray = (): void => {
    const numberAutoMark = this.scaleData.numberAutoMark as number;
    let markArray = [];
    if (
      this.modelData.minValue &&
      this.modelData.maxSteps &&
      this.modelData.stepSize
    ) {
      if (numberAutoMark >= 1) markArray.push(this.modelData.minValue); //Добавить метку начала.
      if (numberAutoMark >= 2) markArray.push(this.modelData.maxValue); //Добавить метку конца.
      if (numberAutoMark >= 3)
        markArray.push(
          this.modelData.minValue +
            Math.round(this.modelData.maxSteps / 2) * this.modelData.stepSize
        ); //Добавить метку середины.
      console.log(markArray);
    }
  };
}

export default scaleDataMethods;
