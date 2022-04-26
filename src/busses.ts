import * as buffer from './buffers';

export interface IBussable {
  bus ( d:(boolean | undefined)[] ): (boolean | undefined)[];
}
export interface IBus {
  d: (boolean | undefined)[];
  member_name: string[];
  member: IBussable[];
  propagate (): void;
}
export class Bus implements IBus{
  d: (boolean | undefined)[];
  member_name: string[];
  member: IBussable[];
  constructor() {
    this.d = buffer.random_bits(8);
    this.member_name = [];
    this.member = [];
  }
  propagate(){
    for(const m of this.member){
      const out = m.bus(this.d)
      for(const i in out)
        if(typeof out[i] === 'boolean')
           this.d[i] = out[i]
    }
  }
}
