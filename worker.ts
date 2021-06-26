import { workerio, unknownutil } from "./deps.ts";

// deno-lint-ignore no-explicit-any
const worker = self as any as Worker;

async function main(args: string[]): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`Invalid arguments: '${args}'`);
  }
  const reader = new workerio.WorkerReader(worker);
  const writer = new workerio.WorkerWriter(worker);
  const mod = await import(args[0]);
  await mod.main(reader, writer);
}

// Wait startup arguments
worker.addEventListener("message", async ({ data }) => {
  if (!data.args) {
    throw new Error("No arguments is given");
  }
  const args: unknown = data.args;
  unknownutil.ensureArray(args, unknownutil.isString);
  await main(args);
  worker.terminate();
}, { once: true });
