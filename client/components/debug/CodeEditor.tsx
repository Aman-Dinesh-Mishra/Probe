import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface CodeEditorProps {
  code: string;
  setCode: (value: string) => void;
  language: string;
}

const placeholderSnippets: Record<string, string> = {
  javascript: `function greet(name) {\n  return "Hello " + name;\n}\nconsole.log(greet("Probe"));`,
  typescript: `function greet(name: string): string {\n  return "Hello " + name;\n}\nconsole.log(greet("Probe"));`,
  python: `def greet(name: str) -> str:\n    return f"Hello {name}"\n\nprint(greet("Probe"))`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Probe");\n    }\n}`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello Probe\\n");\n    return 0;\n}`,
  cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello Probe" << std::endl;\n    return 0;\n}`,
  r: `greet <- function(name) {\n  return(paste("Hello", name))\n}\nprint(greet("Probe"))`
};

export default function CodeEditor({ code, setCode, language }: CodeEditorProps) {
  const lineCount = code.length > 0 ? code.split("\n").length : 1;
  const currentPlaceholder = placeholderSnippets[language.toLowerCase()] || placeholderSnippets.typescript;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-md border px-3 py-2">
        <Badge variant="outline" className="uppercase font-mono text-xs tracking-wider">
          {language}
        </Badge>
        <span className="text-xs text-muted-foreground">{lineCount} lines</span>
      </div>

      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={currentPlaceholder}
        className="
          min-h-[650px]
          resize-none
          border
          font-mono
          text-sm
          leading-6
          shadow-transparent
        "
      />
    </div>
  );
}