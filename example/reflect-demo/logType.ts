import 'reflect-metadata';

export function logType(target : any, key : string) {
  var t = Reflect.getMetadata("design:type", target, key);
  console.log(`${target.constructor.name}.${key} type: ${t?.name}`);
}

export default logType;
