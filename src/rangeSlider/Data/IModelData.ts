import IHandles from "./IHandles";

interface IModelData {
  maxValue?: number;
  minValue?: number;
  stepSize?: number;  
  maxSteps?: number;
  handles?: IHandles[];
}

export default IModelData;

