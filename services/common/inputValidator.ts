import { Space } from "./Space";

export class MissingInputError extends Error {};
const inputValidator = (arg: any) => {

  if (!(arg as Space).name) {
    throw new MissingInputError('name must be provided!');
  }
  if (!(arg as Space).location) {
    throw new MissingInputError('location must be provided!');
  }
  if (!(arg as Space).spaceId) {
    throw new MissingInputError('spaceId must be provided!');
  }
  
}

export { inputValidator }