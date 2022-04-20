/*                                                                            *\
*                                                                              *
*                                                                              *
\*                                                                            */
export interface OneInput {
  i: boolean;
  o: boolean;
  input ( i:boolean ): boolean;
  processing (): void;
  output (): boolean;
}

export interface ThreeState {
  a: boolean;
  b: boolean;
  o: boolean | undefined;
  input ( a:boolean, b:boolean ): boolean | undefined;
  processing (): void;
  output (): boolean | undefined;
}

export function random_bit(){
  return Math.floor(Math.random() * 2) === 0
}
export function throw_on_NaB(...args: boolean[]){
  for (const arg of Array.from(args))
    if(typeof(arg) !== 'boolean')
      throw new Error('NaB');
}

export class Buffer implements OneInput {
  i: boolean;
  o: boolean;
  constructor() {
    this.i = random_bit();
    this.o = random_bit();
  }
  input(i: boolean) {
    throw_on_NaB(i);
    this.i = i;
    this.processing();
    return this.output();
  }
  processing() {
    this.o = this.i;
  }
  output() {
    return this.o;
  }
}

export class NOT extends Buffer implements OneInput {
  processing(){
    this.o = !this.i;
  }
}

export class TriState implements ThreeState {
  a: boolean;
  b: boolean;
  o: boolean | undefined;
  constructor() {
    this.a = random_bit();
    this.b = random_bit();
    this.processing();
  }
  input(a: boolean, b: boolean) {
    throw_on_NaB(a,b);
    this.a = a;
    this.b = b;
    this.processing();

    return this.output();
  }
  processing(){
    if(this.b)
      this.o = this.a;
    else
      this.o = undefined;
  }
  output(){
    return this.o;
  }
}
