import { Lube } from "./lube";
import { ConnectOptions, IDbProvider } from "./types";

export class Context extends Lube {
  constructor(provider: IDbProvider) {
    super(provider)
  }
}
