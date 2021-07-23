import 'reflect-metadata';


function logType(target : any, key : string) {
  var t = Reflect.getMetadata("design:type", target, key);
  console.log(t);
  console.log(`${key} type: ${t.name}`);
}

class Demo{
  @logType // apply property decorator
  // @Reflect.metadata('design:type', String)
  public attr1!: string;

  @logType
  public attr2?: number;
}
