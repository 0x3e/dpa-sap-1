export interface OneInput {
  inputted: boolean;
  input ( i:boolean ): boolean;
  output (): boolean;
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

