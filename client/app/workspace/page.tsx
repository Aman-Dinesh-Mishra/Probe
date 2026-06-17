"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";

import CodeEditor from "@/components/debug/CodeEditor";
import ErrorPanel from "@/components/debug/ErrorPanel";
import FixSuggestions from "@/components/debug/FixSuggestions";

import TestResults from "@/components/validation/TestResults";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useDebug } from "@/hooks/useDebug";
import { useValidation } from "@/hooks/useValidation";

export default function WorkspacePage() {
  useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState("typescript");
  const [code, setCode] = useState("");
  const [errorLog, setErrorLog] = useState("");
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);

  const { loading: debugLoading, data: agentData, analyzeAndFix } = useDebug();

  const {
    loading: validateLoading,
    result: validationResult,
    validate,
  } = useValidation();

  const handleAnalyzeClick = async () => {
    setExecutionOutput(null);

    await analyzeAndFix({
      originalCode: code,
      errorMessage: errorLog,
      language,
    });
  };

  const handleValidateClick = async () => {
    await validate({
      buggyCode: code,
      fixedCode: agentData?.fix?.fixedCode || code,
      language,
    });

    if (validationResult) {
      const output =
        validationResult.stdout ||
        validationResult.stderr ||
        validationResult.message ||
        JSON.stringify(validationResult, null, 2);

      setExecutionOutput(output);

      if (validationResult.success) {
        setErrorLog("");
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar sidebarOpen={sidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          language={language}
          setLanguage={setLanguage}
        />

        <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Workspace</h1>

            <p className="text-sm text-muted-foreground">
              AI-powered debugging, validation and code analysis
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-4">
            <div className="space-y-4 xl:col-span-3">
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle>Code Editor</CardTitle>

                    <Button
                      onClick={handleAnalyzeClick}
                      disabled={debugLoading || validateLoading}
                    >
                      {debugLoading ? "Analyzing..." : "Analyze Code"}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <CodeEditor
                    code={code}
                    setCode={setCode}
                    language={language}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Error Log Console
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <textarea
                    value={errorLog}
                    onChange={(e) => setErrorLog(e.target.value)}
                    placeholder="Paste stack traces, compiler logs or runtime errors..."
                    className="min-h-[120px] w-full resize-none rounded-md border bg-muted p-3 font-mono text-xs text-rose-400 outline-none"
                  />
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-6">
                <CardHeader className="border-b">
                  <CardTitle>AI Analysis</CardTitle>
                </CardHeader>

                <CardContent className="pt-4">
                  <Tabs defaultValue="errors">
                    <TabsList className="w-full">
                      <TabsTrigger value="errors" className="flex-1">
                        Errors
                      </TabsTrigger>

                      <TabsTrigger value="fixes" className="flex-1">
                        Fixes
                      </TabsTrigger>

                      <TabsTrigger value="results" className="flex-1">
                        Results
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="errors" className="mt-4">
                      <ErrorPanel error={agentData?.analysis} />
                    </TabsContent>

                    <TabsContent value="fixes" className="mt-4">
                      <FixSuggestions
                        fix={agentData?.fix}
                        language={language}
                      />
                    </TabsContent>

                    <TabsContent value="results" className="mt-4 space-y-4">
                      <TestResults result={validationResult} />

                      {executionOutput && (
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Execution Output
                          </label>

                          <div className="max-h-[180px] overflow-y-auto rounded-md border bg-black p-3 font-mono text-xs text-emerald-400 whitespace-pre-wrap">
                            {executionOutput}
                          </div>
                        </div>
                      )}

                      <Button
                        className="w-full bg-emerald-600 text-white hover:bg-emerald-500"
                        onClick={handleValidateClick}
                        disabled={debugLoading || validateLoading || !agentData}
                      >
                        {validateLoading ? "Verifying..." : "Validate Fix"}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
