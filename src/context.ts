import { Lube } from "./lube";
import { ConnectOptions, IDbProvider } from "./types";

export class Context extends Lube {
  constructor(provider: IDbProvider, options: ConnectOptions) {
    super(provider, options)
  }
}
