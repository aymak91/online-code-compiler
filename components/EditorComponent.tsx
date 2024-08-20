"use client";
import React, { useRef, useState } from "react";
import { ModeToggleBtn } from "./mode-toggle-btn";
import SelectLanguages, { selectedLanguageOptionProps } from "./SelectLanguages";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Loader, Play, TriangleAlert } from "lucide-react";
import { codeSnippets, languageOptions } from "@/config/config";
import { compileCode } from "@/actions/compile";
import toast from "react-hot-toast";

export interface CodeSnippetsProps {
  [key: string]: string;
}

export default function EditorComponent() {
  const { theme } = useTheme();
  const [sourceCode, setSourceCode] = useState(codeSnippets["python"]);
  const [languageOption, setLanguageOption] = useState(languageOptions[0]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [err, setErr] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const editorRef = useRef(null);

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
    editor.focus();
  }

  function handleOnchange(value: string | undefined) {
    if (value) {
      setSourceCode(value);
    }
  }

  function onSelect(value: selectedLanguageOptionProps) {
    setLanguageOption(value);
    setSourceCode(codeSnippets[value.language]);
  }


  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  async function executeCode() {
    setLoading(true);
    const requestData = {
      language: languageOption.language,
      version: languageOption.version,
      files: [
        {
          content: sourceCode,
        },
      ],
    };
    try {
      const result = await compileCode(requestData);
      setOutput(result.run.output.split("\n"));
      setLoading(false);
      setErr(false);
      toast.success("Compiled Successfully");
    } catch (error) {
      setErr(true);
      setLoading(false);
      toast.error("Failed to compile the Code");
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] dark:bg-slate-900 rounded-2xl shadow-2xl py-2 px-8">
      {/* EDITOR HEADER */}
      <div className="flex items-center justify-between pb-3">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">Dijkstra</h2>
        <h3>Demo - Full site launches soon!</h3>
        <div className="flex items-center space-x-2">
          <ModeToggleBtn />
          <div className="w-[230px] pointer-events-none opacity-70">
            <SelectLanguages onSelect={onSelect} selectedLanguageOption={languageOption} />
          </div>
        </div>
      </div>
      {/* EDITOR */}
      <div className="bg-slate-400 dark:bg-slate-950 p-3 rounded-2xl" style={{ height: '90vh' }}>
        <ResizablePanelGroup direction="horizontal" className="w-full h-full rounded-lg border dark:bg-slate-900">
          {/* Left Panel for Problems */}
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className="flex-grow overflow-auto p-3 h-full">
              {/* Add your content for writing problems here */}
              <h1 className="text-lg font-bold">1. Longest Repeating Substring</h1>
              <br />
              <p>Given a string <code className="bg-gray-200 text-gray-800 rounded-md px-1 font-mono">s</code>, , return <i>the length of the longest repeating substrings</i>. If no repeating substring exists, return <code className="bg-gray-200 text-gray-800 rounded-md px-1 font-mono">0</code>.</p>
              <br />
              <h2>Example 1:</h2>
              <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-400">
                <p>Input: <code className="bg-gray-200 text-gray-800 rounded-md px-1 font-mono">s = &quot;abcd&quot;</code></p>
                <p>Output: <code className="bg-gray-200 text-gray-800 rounded-md px-1 font-mono">0</code></p>
                <p>Explanation: There is no repeating substring.</p>
              </blockquote>
              <br />
              <h2>Example 2:</h2>
              <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-400">
                <p>Input: <code className="bg-gray-200 text-gray-800 rounded-md px-1 font-mono">s = &quot;abbaba&quot;</code></p>
                <p>Output: <code className="bg-gray-200 text-gray-800 rounded-md px-1 font-mono">2</code></p>
                <p>Explanation: The longest repeating substrings are &quot;ab&quot; and &quot;ba&quot;, each of which occurs twice.</p>
              </blockquote>
              <br />
              <h2>Example 3:</h2>
              <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-400">
                <p>Input: <code className="bg-gray-200 text-gray-800 rounded-md px-1 font-mono">s = &quot;aabcaabdaab&quot;</code></p>
                <p>Output: <code className="bg-gray-200 text-gray-800 rounded-md px-1 font-mono">3</code></p>
                <p>Explanation: There is no repeating substring.</p>
              </blockquote>
              <br />
              <br />
              <br />
              <h2 onClick={toggleVisibility} className="cursor-pointer text-blue-300 hover:underline">Click to {isVisible ? "Hide" : "Show"} Constraints:</h2>
              {isVisible && (<ul className="list-disc pl-5">
                <li>
                  <code className="bg-gray-200 text-gray-800 rounded-md px-1 font-mono">1 &lt;= s.length &lt;= 2000</code>
                </li>
                <li>
                  <code className="bg-gray-200 text-gray-800 rounded-md px-1 font-mono">s</code> consists of lowercase English letters.
                </li>
              </ul>)}
              {/* Add a textarea or other components as needed */}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel with Code Editor and Output */}
          <ResizablePanel defaultSize={50} minSize={50}>
            <ResizablePanelGroup direction="vertical" className="h-full">
              <ResizablePanel defaultSize={50} minSize={35} className="h-full">
                <Editor
                  theme={theme === "dark" ? "vs-dark" : "vs-light"}
                  height="100%"
                  defaultLanguage={languageOption.language}
                  defaultValue={sourceCode}
                  onMount={handleEditorDidMount}
                  value={sourceCode}
                  onChange={handleOnchange}
                  language={languageOption.language}
                />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={50} minSize={35} className="h-full">
                <div className="flex flex-col h-full bg-slate-300 dark:bg-slate-900">
                  <div className="flex-shrink-0 flex items-center justify-between bg-slate-400 dark:bg-slate-950 px-6 py-2">
                    <h2>Output</h2>
                    {loading ? (
                      <Button
                        disabled
                        size={"sm"}
                        className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-slate-800 hover:bg-slate-900"
                      >
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        <span>Running please wait...</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={executeCode}
                        size={"sm"}
                        className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-slate-800 hover:bg-slate-900"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        <span>Run</span>
                      </Button>
                    )}
                  </div>
                  <div className="flex-grow overflow-auto px-6 space-y-2">
                    {err ? (
                      <div className="flex items-center space-x-2 text-red-500 border border-red-600 px-6 py-6">
                        <TriangleAlert className="w-5 h-5 mr-2 flex-shrink-0" />
                        <p className="text-xs">Failed to Compile the Code, Please try again!</p>
                      </div>
                    ) : (
                      <>
                        {output.map((item, i) => (
                          <p className={`text-sm ${item.includes("PASSED") ? "text-green-500" : item.includes("FAILED") ? "text-red-600" : item.toLowerCase().includes("error") ? "text-red-600" : ""}`} key={i} > {item.includes("piston") ? "" : item} </p>
                          ))}
                      </>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}