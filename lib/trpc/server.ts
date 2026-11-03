import { headers } from "next/headers";
import { createCaller } from "@/server/root";
import { createTRPCContext } from "@/server/trpc";

export const createServerCaller = async () => {
  const headerList = await headers();
  return createCaller(await createTRPCContext({ headers: headerList }));
};
