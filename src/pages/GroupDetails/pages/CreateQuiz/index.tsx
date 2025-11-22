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
import { ChatSidebar } from '@/components/ChatSidebar';

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
  const { sendMessage, isSendingMessage, messages } = useChat();
  const { data: group, isLoading: isLoadingGroup } = useGroupById(groupId!);

  const [isChatOpen, setIsChatOpen] = useState(true);
  const initializationAttempted = useRef(false);

  // Validate state and navigate back if invalid
  useEffect(() => {
    if (!state?.message || !state?.selectedModules || !groupId) {
      toast.error('Missing quiz generation data');
      navigate(`/groups/${groupId || ''}`);
    }
  }, [state, groupId, navigate]);

  // Initialize chat session once when ready
  useEffect(() => {
    // Prevent multiple initializations
    if (initializationAttempted.current) return;

    // Wait for all required data
    if (!state || !user || !group || isLoadingGroup) return;

    const educatorName = `Dr/ ${user.firstName} ${user.lastName}`;

    console.log('Initializing quiz generation:', {
      message: state.message,
      modules: state.selectedModules,
      groupId,
      educatorName,
    });

    // Send initial message with reset session
    sendMessage(state.message, groupId, educatorName, state.selectedModules, {
      resetSession: true,
    });

    initializationAttempted.current = true;
  }, [state, user, group, isLoadingGroup, groupId, sendMessage]);

  // Early return if state is invalid
  if (!state?.message || !state?.selectedModules) {
    return null;
  }

  const hasReceivedResponse = messages.length > 0;

  return (
    <div className="min-h-screen flex">
      <div className={`flex-1 transition-all duration-300 ${isChatOpen ? 'md:mr-80' : ''}`}>
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
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

          {/* Status Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12 space-y-4">
                {isSendingMessage || !hasReceivedResponse ? (
                  <>
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold">
                        {hasReceivedResponse
                          ? 'Processing your request...'
                          : 'Generating Quiz with AI'}
                      </h2>
                      <p className="text-muted-foreground">
                        {hasReceivedResponse
                          ? 'The AI is working on your quiz. You can continue chatting in the sidebar.'
                          : 'Initializing AI assistant and loading module materials...'}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-12 w-12 mx-auto text-primary" />
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold">AI Assistant Ready</h2>
                      <p className="text-muted-foreground">
                        Use the chat sidebar to communicate with the AI assistant and refine your
                        quiz.
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
      </div>

      {/* Chat Sidebar */}
      {isChatOpen && user && (
        <ChatSidebar
          onClose={() => setIsChatOpen(false)}
          groupId={groupId!}
          educatorName={`Dr/ ${user.firstName} ${user.lastName}`}
          selectedModules={state.selectedModules}
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
