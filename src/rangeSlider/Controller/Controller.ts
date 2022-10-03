import Model from "../Model/Model";
import View from "../View/View";

class Controller {
  model: Model;
  view: View;

  constructor(public DOMDiv: HTMLDivElement) {
    this.DOMDiv = DOMDiv;

    this.model = new Model();
    this.view = new View();
  }

  makeSlider = (): void => {
    this.view.createHTMLelements(this.DOMDiv);
  };

  
}

export default Controller;
