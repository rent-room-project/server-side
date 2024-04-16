import _ from "lodash";

export default function cleanNullishValue<T>(payload: T): T {
  return _.omitBy(payload as any, _.isEmpty) as T;
}
