import { MikroORM } from "@mikro-orm/postgresql";
import ormConfig from "../../../mikro-orm.config";

export const initOrm = async () => {
  const orm = await MikroORM.init(ormConfig);

  return orm;
};
