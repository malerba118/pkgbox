"use client";
import Image from "next/image";
import { Button } from "../components/ui/button";
import { ProjectManager } from "../state/app";
import { nanoid } from "nanoid";

const project = new ProjectManager({ id: nanoid(), name: "project" });

project.library.createFile({ name: "index.ts", contents: `foo` });
const tests = project.library.createFolder({ name: "tests" });
tests.createFile({
  name: "math.test.ts",
  contents: "bar",
});

console.log(project.library.root);

export default function Home() {
  return (
    <main className="">
      <Button>Hello</Button>
    </main>
  );
}
