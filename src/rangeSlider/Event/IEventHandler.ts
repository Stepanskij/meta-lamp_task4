import EventArgs from "./EventArgs";

interface IEventHandler<TData> {
  (args?: EventArgs<TData>): void;
}

export default IEventHandler;
