import { ApiProperty } from '@nestjs/swagger';

export class Result<T> {
  constructor(code: number, success: boolean, message: string, payload: T) {
    this.code = code;
    this.success = success;
    this.message = message;
    this.payload = payload;
    this.timestamp = Date.now();
  }
  @ApiProperty({ description: '时间戳' })
  timestamp: number;
  @ApiProperty({ description: '状态码' })
  code: number;
  @ApiProperty({ description: '成功标记' })
  success: boolean;
  @ApiProperty({ description: '消息' })
  message: string;
  @ApiProperty({ description: '载荷' })
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
