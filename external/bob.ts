import { WorkerReader, WorkerWriter, io } from "./deps.ts";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function main(reader: WorkerReader, writer: WorkerWriter) {
  for await (const data of io.iter(reader)) {
    const text = decoder.decode(data);
    await writer.write(encoder.encode(`${text}. This is bob.`));
  }
}
