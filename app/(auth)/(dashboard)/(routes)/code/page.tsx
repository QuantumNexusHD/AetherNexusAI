"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { UserAvatar } from "@/components/ui/user-avatar";
import axios from "axios";
import * as z from "zod";
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/loader";
import { formSchema } from "./constants";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Empty } from "@/components/empty";
import { cn } from "@/lib/utils";

// Define the message interface for DeepSeek
interface DeepSeekMessage {
  role: "user" | "assistant";
  content: string;
}

// Custom BotAvatar replacement
const CustomBotAvatar = () => (
  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
    AI
  </div>
);

const CodePage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<DeepSeekMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  const isLoading = form.formState.isSubmitting || isGenerating;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsGenerating(true);
      const userMessage: DeepSeekMessage = { role: "user", content: values.prompt };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      const response = await axios.post("/api/code", {
        messages: newMessages,
        model: "deepseek",
      });

      const assistantMessage: DeepSeekMessage = {
        role: "assistant",
        content: response.data.content,
      };

      setMessages([...newMessages, assistantMessage]);
      form.reset();
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsGenerating(false);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-cyberpunk">
      <div className="px-4 lg:px-8 pt-12">
        {/* Direct HTML instead of Heading component to ensure neon styles */}
        <div className="flex items-center gap-x-3 mb-8">
          <div className="p-2 w-fit rounded-md bg-green-700/10">
            <Code className="w-10 h-10 text-green-700" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-cyan-400 neon-title">
              AI Code Generation
            </h2>
            <p className="text-sm text-gray-300 neon-text">
              Generate code using descriptive text.
            </p>
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border border-indigo-500/50 bg-gray-800/80 backdrop-blur-sm w-full p-4 px-3 md:px-6 focus-within:shadow-md grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none text-white bg-transparent focus-visible:ring-0 focus-visible:ring-transparent placeholder-gray-400"
                        disabled={isLoading}
                        placeholder="Ask AetherNexusAI to generate code..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate"}
              </Button>
            </form>
          </Form>
          <div className="space-y-4">
            {isGenerating && (
              <div className="p-8 rounded-lg w-full flex items-center justify-center bg-gray-800/80 backdrop-blur-sm">
                <Loader />
              </div>
            )}
            {messages.length === 0 && !isLoading && (
              <Empty label="Start generating code with AetherNexusAI." />
            )}
            <div className="flex flex-col-reverse gap-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-8 w-full flex items-start gap-x-8 rounded-lg bg-gray-800/80 border border-indigo-500/50 backdrop-blur-sm",
                    message.role === "user" ? "text-white" : "text-cyan-200"
                  )}
                >
                  {message.role === "user" ? <UserAvatar /> : <CustomBotAvatar />}
                  <div className="text-sm whitespace-pre-wrap">
                    <ReactMarkdown
                      components={{
                        pre: ({ ...props }) => (
                          <div className="overflow-auto overflow-y-auto w-full my-2 bg-black/20 p-2 rounded-lg text-white">
                            <pre {...props} />
                          </div>
                        ),
                        code: ({ ...props }) => (
                          <code className="bg-black/20 rounded-lg p-1 text-white" {...props} />
                        ),
                      }}
                    >
                      {message.content || ""}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inline Styles */}
      <style jsx>{`
        .bg-cyberpunk {
          background: linear-gradient(135deg, #0d001a 0%, #1a0033 50%, #330066 100%);
        }
        .neon-title {
          text-shadow: 0 0 5px rgba(0, 255, 255, 0.8), 0 0 15px rgba(0, 255, 255, 0.6),
                       0 0 25px rgba(0, 255, 255, 0.4);
          animation: flicker 3s infinite alternate;
        }
        .neon-text {
          text-shadow: 0 0 3px rgba(0, 255, 255, 0.5), 0 0 8px rgba(0, 255, 255, 0.3);
          animation: glow 2s infinite alternate;
        }
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.8), 0 0 15px rgba(0, 255, 255, 0.6),
                         0 0 25px rgba(0, 255, 255, 0.4);
          }
          20%, 24%, 55% {
            text-shadow: 0 0 3px rgba(0, 255, 255, 0.5), 0 0 10px rgba(0, 255, 255, 0.3);
          }
        }
        @keyframes glow {
          from {
            text-shadow: 0 0 3px rgba(0, 255, 255, 0.5), 0 0 8px rgba(0, 255, 255, 0.3);
          }
          to {
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.7), 0 0 12px rgba(0, 255, 255, 0.5);
          }
        }
      `}</style>
    </div>
  );
};

export default CodePage;