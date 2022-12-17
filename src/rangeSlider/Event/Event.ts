import EventArgs from "./EventArgs";
import IEventHandler from "./IEventHandler";

class Event<TData> {
  private handlers = new Array<IEventHandler<TData>>();

  public subscribe = (handler: IEventHandler<TData>) => {
    this.handlers.push(handler);
  };

  public dispatch = (args?: EventArgs<TData>) => {
    this.handlers.forEach((handler) => {
      handler(args);
    });
  };
}

export default Event;
