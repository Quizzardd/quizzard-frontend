import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/useChat';
import { Send, Loader2, Bot, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  onClose?: () => void;
  groupId: string;
  educatorName: string;
  selectedModules: Array<{ id: string; title: string }>;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  onClose,
  groupId,
  educatorName,
  selectedModules,
}) => {
  const { messages, sendMessage, isSendingMessage } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug: Log when messages change
  useEffect(() => {
    console.log('💬 ChatSidebar - Messages updated:', messages.length, messages);
  }, [messages]);

  // Store the context values in refs to ensure they persist
  const groupIdRef = useRef(groupId);
  const educatorNameRef = useRef(educatorName);
  const selectedModulesRef = useRef(selectedModules);

  // Update refs when props change
  useEffect(() => {
    if (groupId) groupIdRef.current = groupId;
    if (educatorName) educatorNameRef.current = educatorName;
    if (selectedModules) selectedModulesRef.current = selectedModules;
  }, [groupId, educatorName, selectedModules]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    sendMessage(
      messageInput,
      groupIdRef.current,
      educatorNameRef.current,
      selectedModulesRef.current,
    );
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
        w-full md:w-85
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
                      <p className="text-sm whitespace-pre-wrap wrap-break-word">
                        {message.content}
                      </p>
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
          <div className="flex gap-2">
            <Input
              placeholder="Describe what to build next"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isSendingMessage}
              className="flex-1 text-sm"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || isSendingMessage}
              size="icon"
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
