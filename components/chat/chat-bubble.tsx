"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputTextarea,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? 'smooth' : 'auto',
      block: 'end'
    });
  }, []);

  const handleSubmit = async (message: PromptInputMessage, event: FormEvent) => {
    event.preventDefault();
    
    const userMessage = message.text?.trim();
    if (!userMessage) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Blur textarea to close mobile keyboard temporarily
    if (textareaRef.current) {
      textareaRef.current.blur();
      
      // Re-focus after keyboard animation completes (mobile)
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 400);
    }

    // Scroll to show user message
    setTimeout(() => scrollToBottom(true), 100);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantContent += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsg.id
                ? { ...msg, content: assistantContent }
                : msg
            )
          );

          // Auto-scroll as content streams in
          scrollToBottom(true);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request aborted");
      } else {
        console.error("Error:", error);
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Lo siento, ocurrió un error. Por favor, intenta de nuevo.",
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Auto-scroll when messages change (for initial render and message additions)
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollToBottom(true), 50);
    }
  }, [messages.length, scrollToBottom]);

  return (
    <>
      <style jsx global>{`
        .chat-content ::selection {
          background-color: #B91F2E;
          color: white;
        }
        
        .chat-content ::-moz-selection {
          background-color: #B91F2E;
          color: white;
        }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 35,
                mass: 0.6
              }}
              className={cn(
                "chat-content flex flex-col bg-background/80 backdrop-blur-xl overflow-hidden",
                "fixed inset-4 md:relative md:inset-auto",
                "md:w-[480px] md:h-[700px] md:max-h-[85vh]",
                "sm:w-[calc(100vw-2rem)] sm:h-[calc(100vh-2rem)]",
                "shadow-2xl shadow-black/10"
              )}
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="flex items-center justify-end px-3 py-1.5 shrink-0 border-b border-border/10"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="size-6 hover:bg-accent/30 transition-colors"
                  aria-label="Cerrar chat"
                >
                  <X className="size-3 text-muted-foreground/50" />
                </Button>
              </motion.div>

              <Conversation className="flex-1 px-2 py-4">
                <ConversationContent>
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground/60 text-sm">¿En qué puedo ayudarte?</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            delay: index * 0.02,
                            type: "spring",
                            stiffness: 400,
                            damping: 25
                          }}
                        >
                          <Message from={message.role}>
                            <MessageContent
                              variant={message.role === "user" ? "contained" : "flat"}
                              className={cn(
                                message.role === "user" &&
                                  "bg-[#B91F2E] text-white transition-all duration-150"
                              )}
                            >
                              <Response>{message.content}</Response>
                            </MessageContent>
                          </Message>
                        </motion.div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </ConversationContent>
                <ConversationScrollButton />
              </Conversation>

              <div className="p-3 border-t border-border/30 bg-background/40 backdrop-blur-sm shrink-0">
                <PromptInput onSubmit={handleSubmit} className="w-full">
                  <PromptInputTextarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pregunta sobre el hackathon..."
                    className="min-h-[44px] max-h-32 resize-none text-sm border-0 focus:ring-0"
                  />
                  <PromptInputFooter>
                    <div className="text-xs text-muted-foreground/70">
                      Enter para enviar
                    </div>
                    <PromptInputSubmit
                      status={isLoading ? "streaming" : undefined}
                      onClick={isLoading ? handleStop : undefined}
                      className="bg-[#B91F2E] hover:bg-[#A01A28] text-white transition-all duration-150"
                    />
                  </PromptInputFooter>
                </PromptInput>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <AnimatePresence>
            {showTooltip && !isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96 }}
                transition={{ duration: 0.1 }}
                className="absolute right-0 bottom-full mb-2 px-3 py-2 bg-background/95 backdrop-blur-xl border border-border/30 rounded-lg shadow-lg text-sm text-foreground whitespace-nowrap"
              >
                ¿Necesitas ayuda?
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-border/30"></div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={cn(
              "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium",
              "disabled:pointer-events-none disabled:opacity-50",
              "[&_svg]:pointer-events-none [&_svg]:shrink-0",
              "outline-none focus-visible:ring-2 focus-visible:ring-[#B91F2E]/20 focus-visible:ring-offset-2",
              "cursor-pointer",
              "h-12 w-12 rounded-lg",
              "bg-background/90 backdrop-blur-xl",
              "shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-xl hover:shadow-[#B91F2E]/20",
              "transition-all duration-200",
              "border border-border/20 hover:border-[#B91F2E]/30",
              isOpen && "scale-0 opacity-0 pointer-events-none md:scale-100 md:opacity-100 md:pointer-events-auto"
            )}
            aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
          >
            <MessageCircle className="h-5 w-5 text-[#B91F2E]" aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </>
  );
}
