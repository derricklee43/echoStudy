export class Stack<T> {
  private _stack: T[];
  constructor(items?: T[]) {
    this._stack = items ?? [];
  }

  public pop() {
    if (this._stack.length === 0) {
      throw Error('unable to pop empty stack');
    }
    const top = this._stack[0];
    this._stack = this._stack.slice(1);
    return top;
  }

  public push(item: T) {
    this._stack = [item, ...this._stack];
  }

  public get top() {
    return this._stack[0];
  }
  public toArray() {
    return this._stack;
  }
}
