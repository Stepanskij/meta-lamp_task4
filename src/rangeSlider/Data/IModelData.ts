import IHandles from "./IHandles";

interface IUserModelData {
  maxValue?: number;
  minValue?: number;
  stepSize?: number;  
  maxSteps?: number;
  handles?: IHandles[];
}

export default IUserModelData;

