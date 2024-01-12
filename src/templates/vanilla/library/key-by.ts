import { keyBy as _keyBy } from "lodash";

export const keyBy = (...args: Parameters<typeof _keyBy>) => _keyBy(...args);
