export class Result<T> {
  constructor(code: number, success: boolean, message: string, payload: T) {
    this.code = code;
    this.success = success;
    this.message = message;
    this.payload = payload;
    this.timestamp = Date.now();
  }

  timestamp: number;

  code: number;

  success: boolean;

  message: string;

  payload: T | null;
}

class RR {
  success<T>(payload?: T) {
    return new Result(0, true, 'OK', payload);
  }

  failure<T>(code = -1, message = 'failure', payload?: T) {
    return new Result(code, false, message, payload);
  }
}

export const R = new RR();
