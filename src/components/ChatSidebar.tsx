import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/useChat';
import { Send, Loader2, Bot, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface ChatSidebarProps {
  onClose?: () => void;
  groupId: string;
  educatorName: string;
  selectedModules: Array<{ id: string; title: string }>;
  sharedSessionId?: string;
  sharedSendMessage?: (message: string, groupId?: string, educatorName?: string, selectedModules?: Array<{ id: string; title: string }>) => void;
  sharedMessages?: Array<{ content: string; sender: 'user' | 'bot'; timestamp: Date }>;
  sharedIsSendingMessage?: boolean;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  onClose,
  groupId,
  educatorName,
  selectedModules,
  sharedSessionId,
  sharedSendMessage,
  sharedMessages,
  sharedIsSendingMessage,
}) => {
  // Use shared state from parent if available, otherwise use own useChat instance
  const fallbackChat = useChat();
  const messages = sharedMessages || fallbackChat.messages;
  const sendMessage = sharedSendMessage || fallbackChat.sendMessage;
  const isSendingMessage = sharedIsSendingMessage !== undefined ? sharedIsSendingMessage : fallbackChat.isSendingMessage;
  const startNewConversation = fallbackChat.startNewConversation;

  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    console.log('🎯 ChatSidebar sending message, sharedSessionId:', sharedSessionId);
    sendMessage(messageInput, groupId, educatorName, selectedModules);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enterr' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="
        fixed
        top-16
        right-0
        h-[calc(100vh-4rem)] 
        w-full md:w-96
        bg-sidebar
        text-sidebar-foreground
        border-l border-sidebar-border
        shadow-sm
        transition-colors
      "
    >
      <div className="p-0 flex flex-col h-full">
        {/* Header with action buttons */}
        <div className="p-4 border-b border--sidebar-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">AI Assistant</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={startNewConversation}
                className="h-8"
                title="Start new conversation"
              >
                New Chat
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="h-full p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                {isSendingMessage ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                    <p className="text-xs px-4 text-muted-foreground">Waiting for AI response.</p>
                  </div>
                ) : (
                  <>
                    <Bot className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-sm font-medium">Build with Agent</p>
                    <p className="text-xs mt-2 px-4">AI responses may be inaccurate.</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex gap-3',
                      message.sender === 'user' ? 'justify-end' : 'justify-start',
                    )}
                  >
                    {message.sender === 'bot' && (
                      <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[75%] rounded-lg p-3',
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted',
                      )}
                    >
                      <div className="text-sm prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                        {message.sender === 'bot' ? (
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        ) : (
                          <p className="whitespace-pre-wrap break-word">{message.content}</p>
                        )}
                      </div>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator when waiting for bot response */}
                {isSendingMessage && (
                  <div className="flex gap-3 justify-start">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="max-w-[75%] rounded-lg p-3 bg-muted">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex gap-2 items-end">
            <Textarea
              placeholder="Describe what to build next... (Shift+Enter for new line)"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isSendingMessage}
              className="flex-1 text-sm min-h-[60px] max-h-[200px] resize-none"
              rows={2}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || isSendingMessage}
              size="icon"
              className="h-10 w-10 shrink-0"
            >
              {isSendingMessage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
