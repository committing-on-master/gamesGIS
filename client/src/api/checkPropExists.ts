export type CheckPropExists<T extends {[x:string]:any},Prop extends string> = T[Prop] extends undefined ? false : true;
