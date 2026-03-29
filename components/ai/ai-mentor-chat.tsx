"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, X, Send } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "ai" | "user"
  text: string
}

const INITIAL_MESSAGES: Message[] = [
  { id: "1", role: "ai", text: "Olá! Sou a CreIA, sua assistente técnica. Como posso ajudar no seu orçamento hoje?" }
]

export function AiMentorChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Rolagem automática para a última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping, isOpen])

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const text = inputValue.trim()
    if (!text) return

    const userMsg: Message = { id: Date.now().toString(), role: "user", text }
    setMessages((prev) => [...prev, userMsg])
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await fetch("https://rafinhatajra.app.n8n.cloud/webhook/chat-orcamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: "user-crea-demo", mensagem: text }),
      })
      
      if (!response.ok) throw new Error("Erro na requisição n8n")

      const contentType = response.headers.get("content-type")
      let respostaTexto = ""

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json()
        respostaTexto = data.output || data.resposta || data.text || data.message || data[0]?.output || JSON.stringify(data)
      } else {
        // Se não for JSON, lê como texto puro (comum em webhooks do n8n dependendo da config)
        respostaTexto = await response.text()
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: respostaTexto
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      console.error("Erro no chat IA:", err)
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "Desculpe, meus servidores estão analisando muitos orçamentos agora. Pode repetir?"
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Janela do Chat */}
      {isOpen && (
        <Card className="w-80 sm:w-96 p-0 gap-0 h-[650px] max-h-[85vh] shadow-2xl flex flex-col border-primary/20 animate-in slide-in-from-bottom-5 fade-in duration-300 overflow-hidden">
          <CardHeader className="p-3 border-b bg-gradient-to-r from-primary to-emerald-600 text-primary-foreground rounded-t-xl flex flex-row items-center justify-between space-y-0 shrink-0">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Bot className="w-5 h-5" />
              CreIA
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10 text-sm" ref={scrollRef}>
            {messages.map((m) => (
              <div key={m.id} className={cn("flex w-full", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2",
                  m.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-tr-sm" 
                    : "bg-muted border text-foreground rounded-tl-sm shadow-sm"
                )}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex w-full justify-start">
                <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-muted border text-muted-foreground rounded-tl-sm flex items-center gap-1.5 shadow-sm">
                  <span className="flex space-x-1">
                    <span className="block w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="block w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="block w-1.5 h-1.5 bg-current rounded-full animate-bounce"></span>
                  </span>
                  <span className="text-xs ml-1">IA digitando...</span>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="p-3 border-t bg-card rounded-b-xl shrink-0">
            <form onSubmit={handleSend} className="flex w-full items-center gap-2">
              <Input 
                placeholder="Pergunte sobre orçamento..." 
                className="flex-1 text-sm h-9"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
              />
              <Button type="submit" size="icon" className="h-9 w-9 shrink-0 shadow-sm" disabled={!inputValue.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      {/* Botão Flutuante */}
      <Button 
        size="icon" 
        className={cn("h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-105", isOpen ? "bg-primary" : "animate-bounce hover:animate-none")}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Mentor"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
      </Button>
    </div>
  )
}
