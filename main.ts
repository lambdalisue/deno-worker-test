import { workerio, io } from "./deps.ts";

const worker = new Worker(new URL("./worker.ts", import.meta.url).href, {
  type: "module",
});
worker.postMessage({ args: ["./external/alice.ts"] });
//worker.postMessage({ args: ["./external/bob.ts"] });

const reader = new workerio.WorkerReader(worker);
const writer = new workerio.WorkerWriter(worker);

const encoder = new TextEncoder();
const decoder = new TextDecoder();

await writer.write(encoder.encode("Hello"));
await writer.write(encoder.encode("World"));

for await (const data of io.iter(reader)) {
  const text = decoder.decode(data);
  console.log(text);
}
worker.terminate();
