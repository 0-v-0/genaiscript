script({
  title: "TODOs",
  description: "Try to implement TODOs found in source code.",
  group: "samples",
  system: ["system", "system.files"],
  model: "large",
  files: "src/fib.ts",
  tests: {
    files: "src/fib.ts",
  },
});

def("CODE", env.files, { lineNumbers: true });

$`In <CODE>, when you encounter a comment starting by "TODO", 
generate code for the TODO comment.
Remove implemented TODOs from <CODE>.
Do not regenerate unmodified files.
`;
