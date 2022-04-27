export function random_bit(): boolean{
  return Math.floor(Math.random() * 2) === 0;
}

export function random_bits(i: number){
  return new Array(i).fill(undefined).map(() => {
    return random_bit()});
}

export function bits_to_num(bits: boolean[]){
  let out = 0;
  for (const i in bits){
    const ri = bits.length - +i - 1; //endian
    out += (( bits[ri] ? 1 : 0) << +i );
  }

  return out;
}

export function num_to_bits(num: number, bits: number, ar?: boolean[]): boolean[]{
  if(typeof ar === 'undefined')
    ar = [];
  if(num === 0){
    for(let i=0;i < bits; i+=1)
      ar.unshift(false);
    return ar;
  }
  (num % 2 === 0) ? ar.unshift(false) : ar.unshift(true); //endian

  bits -= 1; 

  return num_to_bits(Math.floor(num / 2), bits, ar);
}

export function is_bits(bits: (boolean | undefined)[]): bits is boolean[]{
  return bits.every(i => typeof i === "boolean")
}

export function throw_on_NaB(...args: boolean[]){
  for (const arg of Array.from(args))
    if(typeof(arg) !== 'boolean')
      throw new Error('NaB');
}
