export interface OneInput {
  inputed: boolean;
  input ( i:boolean ): boolean;
  output (): boolean;
}

export function random_bit(){
  return Math.floor(Math.random() * 2) === 0
}

export class Buffer implements OneInput {
  inputed: boolean;
  constructor() {
    this.inputed = random_bit();
  } 
  input(i: boolean) { 
    if(typeof(i) !== 'boolean')
      throw new Error('NaB')
    this.inputed = i;
    return this.output();
  }
  output() {
    return this.inputed;
  }
}

export class NOT extends Buffer implements OneInput {
  output(){
    return !this.inputed;
  }
}

