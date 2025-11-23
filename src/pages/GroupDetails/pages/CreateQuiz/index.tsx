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

  // Debug: Log quiz state changes
  useEffect(() => {
    console.log('🎯 Quiz state changed:', { quiz: quiz?._id, quizAction, isLoadingQuiz, error: quizError });
  }, [quiz, quizAction, isLoadingQuiz, quizError]);

  const [isChatOpen, setIsChatOpen] = useState(true);
  const hasInitialized = useRef(false);
  const processedQuizTimestampRef = useRef<number>(0);

  // Poll sessionStorage for quiz updates (since useChat instances don't share state)
  useEffect(() => {
    console.log('🔔 Setting up sessionStorage polling for quiz detection');
    
    const checkForQuiz = () => {
      try {
        const storedQuizId = sessionStorage.getItem('latestQuizId');
        const storedAction = sessionStorage.getItem('latestQuizAction') as 'created' | 'updated' | null;
        const storedTimestamp = sessionStorage.getItem('latestQuizTimestamp');
        
        const timestamp = storedTimestamp ? Number(storedTimestamp) : Date.now();
        
        // Only process if we have a new timestamp (different from last processed)
        if (storedQuizId && storedQuizId.trim() !== '' && timestamp !== processedQuizTimestampRef.current) {
          const action = storedAction || 'created';
          console.log('🎯 Quiz detected from sessionStorage:', storedQuizId);
          console.log('🎬 Action:', action, '| Timestamp:', timestamp);
          console.log('📝 Processing quiz with action:', action);
          
          updateQuizId(storedQuizId, action);
          processedQuizTimestampRef.current = timestamp;
          
          toast.success(action === 'updated' ? 'Quiz updated successfully!' : 'Quiz generated successfully!');
          
          // Clear after processing
          sessionStorage.removeItem('latestQuizId');
          sessionStorage.removeItem('latestQuizAction');
          sessionStorage.removeItem('latestQuizTimestamp');
          console.log('🧹 Cleared quiz data from sessionStorage');
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

    console.log('🚀 Initializing quiz generation - starting fresh session');

    // Send initial message with resetSession to start fresh conversation
    // This prevents old chat messages from showing up
    sendMessage(state.message, groupId, educatorName, state.selectedModules, { resetSession: true });

    hasInitialized.current = true;
  }, [state, user, group, isLoadingGroup, groupId, sendMessage]);

  // Early return if state is invalid
  if (!state?.message || !state?.selectedModules) {
    return null;
  }

  const hasReceivedResponse = messages.length > 0;

  return (
    <div className="min-h-screen flex">
      <div className={`flex-1 transition-all duration-300 ${isChatOpen ? 'md:mr-96' : ''}`}>
        <div className="max-w-6xl mx-auto p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
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

          {/* Content */}
          {quiz ? (
            /* Quiz Preview - Full Width */
            <div className="w-full">
              <QuizPreview
                quiz={quiz}
                isLoading={isLoadingQuiz}
                error={quizError}
                quizAction={quizAction}
                groupId={groupId}
                selectedModules={state.selectedModules}
              />
            </div>
          ) : (
            /* Loading State - Show only when no quiz */
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold">Generating Quiz with AI</h2>
                      <p className="text-sm text-muted-foreground">
                        Initializing AI assistant and loading module materials...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quiz Details Card */}
              <Card className="mt-6">
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
                </CardContent>
              </Card>
            </div>
          )}
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
