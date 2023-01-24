import View from "../View";
import RollerHandler from "../Handlers/RollerHandler";

import { IViewPart } from "./IViewPart";

class Roller implements IViewPart {
  view: View;
  DOMRoot: HTMLDivElement | undefined;
  rollerHandler: RollerHandler;

  constructor({ view }: { view: View }) {
    this.view = view;
    this.rollerHandler = new RollerHandler({ view, rollerPart: this });
  }

  build = ({ DOMContainer }: { DOMContainer: HTMLDivElement }) => {
    const DOMRoller = document.createElement("div");
    DOMRoller.className = "roller";

    DOMContainer.insertAdjacentElement("beforeend", DOMRoller);

    this.DOMRoot = DOMRoller;
  };

  calculateStyles = () => {};

  render = () => {};

  loadContent = () => {
    if (this.DOMRoot) this.rollerHandler.addEvent(this.DOMRoot);
  };
}

export default Roller;
