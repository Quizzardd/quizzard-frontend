import { useState, useEffect } from 'react';
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

  const state = location.state as CreateQuizPageState;
  const { sendMessage } = useChat();
  const { data: group } = useGroupById(groupId!);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!state || !state.message || !state.selectedModules) {
      toast.error('Missing quiz generation data');
      navigate(`/groups/${groupId}`);
      return;
    }

    if (!hasInitialized && user && group) {
      const educatorName = `Dr/ ${user.firstName} ${user.lastName}`;
      console.log('selected modules: ', state.selectedModules);
      sendMessage(state.message, groupId!, educatorName, state.selectedModules, {
        resetSession: true,
      });

      setHasInitialized(true);
    }
  }, [group, groupId, hasInitialized, navigate, sendMessage, state, user]);

  return (
    <div className="min-h-screen flex">
      <div className={`flex-1 transition-all duration-300 ${isChatOpen ? 'md:mr-80' : ''}`}>
        <div className="max-w-4xl mx-auto p-6 space-y-6">
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

          {/* Waiting State */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Generating Quiz with AI</h2>
                  <p className="text-muted-foreground">
                    Please use the chat sidebar to communicate with the AI assistant.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The AI will guide you through creating your quiz.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Generation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Your Request</Label>
                <p className="mt-1">{state?.message}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Selected Modules</Label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {state?.selectedModules?.map((module) => (
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
      </div>

      {isChatOpen && user && state?.selectedModules && (
        <ChatSidebar
          onClose={() => setIsChatOpen(false)}
          groupId={groupId!}
          educatorName={`Dr/ ${user.firstName} ${user.lastName}`}
          selectedModules={state.selectedModules}
        />
      )}

      {/* Chat Toggle Button */}
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
          size="icon"
          title="Open AI Assistant"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
