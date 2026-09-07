import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, ChevronRight } from 'lucide-react'
import { cn } from '../lib/utils'
import { useLanguage } from '../lib/i18n'
import { navigate } from '../lib/router'

type Message = {
  id: string
  sender: 'bot' | 'user'
  text: string
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const { t } = useLanguage()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: '1', sender: 'bot', text: t.chatbot.greeting }
      ])
    }
  }, [isOpen, messages.length, t.chatbot.greeting])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleQuickReply = (question: string, answer: string) => {
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: question }
    setMessages(prev => [...prev, userMsg])
    
    // Simulate thinking delay
    setTimeout(() => {
      const botMsg: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: answer }
      setMessages(prev => [...prev, botMsg])
    }, 600)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all duration-300 hover:scale-110 active:scale-95',
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        )}
        style={{ background: 'var(--gradient-brand)' }}
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </button>

      <div
        className={cn(
          'glass-strong fixed bottom-6 right-6 z-50 flex w-[360px] flex-col overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 ease-out sm:max-w-[calc(100vw-3rem)]',
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-10 opacity-0'
        )}
        style={{ maxHeight: 'calc(100vh - 5rem)', height: '560px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 bg-black/20 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
              <span className="font-heading text-lg font-bold text-gold">H</span>
              <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-semibold text-foreground">{t.chatbot.title}</h3>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex w-full',
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                  msg.sender === 'user'
                    ? 'bg-gold text-primary-foreground rounded-tr-sm'
                    : 'bg-white/5 text-foreground rounded-tl-sm border border-white/10'
                )}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* Quick Replies - Show only if last message is from bot */}
          {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && (
            <div className="flex flex-col gap-2 pt-2 animate-fade-up">
              <button
                onClick={() => handleQuickReply(t.chatbot.quickReplies.services, t.chatbot.quickReplies.servicesAnswer)}
                className="flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-xs text-gold transition-colors hover:bg-gold/15"
              >
                {t.chatbot.quickReplies.services}
                <ChevronRight className="h-3 w-3" />
              </button>
              <button
                onClick={() => handleQuickReply(t.chatbot.quickReplies.pricing, t.chatbot.quickReplies.pricingAnswer)}
                className="flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-xs text-gold transition-colors hover:bg-gold/15"
              >
                {t.chatbot.quickReplies.pricing}
                <ChevronRight className="h-3 w-3" />
              </button>
              <button
                onClick={() => handleQuickReply(t.chatbot.quickReplies.human, t.chatbot.quickReplies.humanAnswer)}
                className="flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-xs text-gold transition-colors hover:bg-gold/15"
              >
                {t.chatbot.quickReplies.human}
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer / Contact CTA */}
        <div className="border-t border-border/50 bg-black/20 p-4">
          <button
            onClick={() => {
              setIsOpen(false)
              navigate('/contact')
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/10"
          >
            <Send className="h-4 w-4" />
            {t.chatbot.contactUs}
          </button>
        </div>
      </div>
    </>
  )
}
