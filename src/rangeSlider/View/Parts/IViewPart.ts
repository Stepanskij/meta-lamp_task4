import View from "../View";

import IModelData from "rangeSlider/Data/IModelData";

interface IViewPart {
  view: View;
  DOMRoot: HTMLDivElement | undefined;

  build: ({ DOMContainer }: { DOMContainer: HTMLDivElement }) => void;

  calculateStyles: ({ modelData }: { modelData: IModelData }) => void;

  render: ({ modelData }: { modelData: IModelData }) => void;

  loadContent: () => void;
}

export type { IViewPart };
