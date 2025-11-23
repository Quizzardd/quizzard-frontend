import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, MessageSquare, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGroupById } from '@/hooks/UseGroup';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { useQuizPreview } from '@/hooks/useQuizPreview';
import { ChatSidebar } from '@/components/ChatSidebar';
import { QuizPreview } from '@/components/QuizPreview';

interface CreateQuizPageState {
  message: string;
  selectedModules: Array<{ id: string; title: string }>;
  groupId: string;
}

export default function CreateQuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();

  const state = location.state as CreateQuizPageState | null;
  const { sendMessage, isSendingMessage, messages, sessionId, latestQuizId, setOnQuizDetected } = useChat();
  const { data: group, isLoading: isLoadingGroup } = useGroupById(groupId!);
  const { quiz, quizAction, isLoading: isLoadingQuiz, error: quizError, updateQuizId } = useQuizPreview();

  const [isChatOpen, setIsChatOpen] = useState(true);
  const hasInitialized = useRef(false);
  const processedQuizIdRef = useRef<string | null>(null);

  // Poll sessionStorage for quiz updates (since useChat instances don't share state)
  useEffect(() => {
    console.log('🔔 Setting up sessionStorage polling for quiz detection');
    
    const checkForQuiz = () => {
      try {
        const storedQuizId = sessionStorage.getItem('latestQuizId');
        
        if (storedQuizId && storedQuizId.trim() !== '' && storedQuizId !== processedQuizIdRef.current) {
          console.log('🎯 Quiz detected from sessionStorage:', storedQuizId);
          console.log('📝 Processing new quiz:', storedQuizId);
          console.log('🎯 Calling updateQuizId with:', storedQuizId, 'created');
          updateQuizId(storedQuizId, 'created');
          processedQuizIdRef.current = storedQuizId;
          toast.success('Quiz generated successfully!');
          
          // Clear after processing
          sessionStorage.removeItem('latestQuizId');
          console.log('🧹 Cleared latestQuizId from sessionStorage');
        }
      } catch (err) {
        console.error('Error reading sessionStorage:', err);
      }
    };

    // Check immediately
    checkForQuiz();

    // Then poll every second for updates
    const interval = setInterval(checkForQuiz, 1000);

    return () => {
      console.log('🧹 Cleaning up sessionStorage polling');
      clearInterval(interval);
    };
  }, [updateQuizId]);

  // Validate state and navigate back if invalid
  useEffect(() => {
    if (!state?.message || !state?.selectedModules || !groupId) {
      toast.error('Missing quiz generation data');
      navigate(`/groups/${groupId || ''}`);
    }
  }, [state, groupId, navigate]);

  // Initialize chat session once when ready (AFTER listener is set up)
  useEffect(() => {
    // Only initialize once
    if (hasInitialized.current) return;

    // Wait for required data
    if (!state || !user || !group || isLoadingGroup) return;

    const educatorName = `Dr/ ${user.firstName} ${user.lastName}`;

    console.log('🚀 Initializing quiz generation - using existing or creating new session');

    // Send initial message (will use existing session or create new one)
    // NO resetSession - we want to keep the same session for WebSocket room consistency
    sendMessage(state.message, groupId, educatorName, state.selectedModules);

    hasInitialized.current = true;
  }, [state, user, group, isLoadingGroup, groupId, sendMessage]);

  // Early return if state is invalid
  if (!state?.message || !state?.selectedModules) {
    return null;
  }

  const hasReceivedResponse = messages.length > 0;

  return (
    <div className="min-h-screen flex">
      <div className={`flex-1 transition-all duration-300 ${isChatOpen ? 'md:mr-80' : ''}`}>
        <div className="max-w-7xl mx-auto p-6">
          <div className={`grid gap-6 ${quiz ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
            {/* Header */}
            <div className={`flex items-center justify-between ${quiz ? 'lg:col-span-2' : ''}`}>
              <Button
                variant="ghost"
                onClick={() => navigate(`/groups/${groupId}`)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Group
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">AI Quiz Generation</span>
              </div>
            </div>

            {/* Left Column - Status & Details */}
            <div className="space-y-6">
              {/* Status Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 space-y-4">
                    {isSendingMessage || !hasReceivedResponse ? (
                      <>
                        <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
                        <div className="space-y-2">
                          <h2 className="text-lg font-semibold">
                            {hasReceivedResponse
                              ? 'Processing your request...'
                              : 'Generating Quiz with AI'}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {hasReceivedResponse
                              ? 'The AI is working on your quiz.'
                              : 'Initializing AI assistant and loading module materials...'}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-10 w-10 mx-auto text-primary" />
                        <div className="space-y-2">
                          <h2 className="text-lg font-semibold">AI Assistant Ready</h2>
                          <p className="text-sm text-muted-foreground">
                            Chat with the AI to refine your quiz.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quiz Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Generation Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Your Request</Label>
                    <p className="mt-1 text-sm">{state.message}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Selected Modules</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {state.selectedModules.map((module) => (
                        <span
                          key={module.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                        >
                          {module.title}
                        </span>
                      ))}
                    </div>
                  </div>
                  {hasReceivedResponse && (
                    <div className="pt-2 border-t">
                      <Label className="text-muted-foreground">Conversation</Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {messages.length} message{messages.length !== 1 ? 's' : ''} exchanged
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Quiz Preview */}
            {quiz && (
              <div className="lg:row-span-2">
                <div className="sticky top-6 h-[calc(100vh-8rem)]">
                  <QuizPreview
                    quiz={quiz}
                    isLoading={isLoadingQuiz}
                    error={quizError}
                    quizAction={quizAction}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      {isChatOpen && user && (
        <ChatSidebar
          onClose={() => setIsChatOpen(false)}
          groupId={groupId!}
          educatorName={`Dr/ ${user.firstName} ${user.lastName}`}
          selectedModules={state.selectedModules}
          sharedSessionId={sessionId}
          sharedSendMessage={sendMessage}
          sharedMessages={messages}
          sharedIsSendingMessage={isSendingMessage}
        />
      )}

      {/* Floating Chat Toggle Button */}
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
          size="icon"
          title="Open AI Assistant"
        >
          <MessageSquare className="h-6 w-6" />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs flex items-center justify-center text-white">
              {messages.length}
            </span>
          )}
        </Button>
      )}
    </div>
  );
}
