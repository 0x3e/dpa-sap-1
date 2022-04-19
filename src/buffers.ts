export interface OneInput {
  inputted: boolean;
  input ( i:boolean ): boolean;
  output (): boolean;
}

export interface ThreeState {
  a: boolean;
  b: boolean;
  input ( a:boolean, b:boolean ): boolean | undefined;
  output (): boolean | undefined;
}

export function random_bit(){
  return Math.floor(Math.random() * 2) === 0
}

export class Buffer implements OneInput {
  inputted: boolean;
  constructor() {
    this.inputted = random_bit();
  } 
  input(i: boolean) { 
    if(typeof(i) !== 'boolean')
      throw new Error('NaB')
    this.inputted = i;
    return this.output();
  }
  output() {
    return this.inputted;
  }
}

export class NOT extends Buffer implements OneInput {
  output(){
    return !this.inputted;
  }
}

export class TriState implements ThreeState {
  a: boolean;
  b: boolean;
  constructor() {
    this.a = random_bit();
    this.b = random_bit();
  } 
  input(a: boolean, b: boolean) { 
    this.a = a;
    this.b = b;
    return this.output();
  }
  output(){
    if(this.b)
      return this.a;
    else
      return undefined;
  }
}
