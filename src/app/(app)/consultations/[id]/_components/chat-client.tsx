'use client';

import { useState } from 'react';
import type { Consultation, Message, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Bot, Send, User as UserIcon, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { summarizeConsultationChat } from '@/ai/flows/consultation-chat-summarization';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ChatClientProps {
  consultation: Consultation;
  student?: User;
  consultant?: User;
}

export function ChatClient({ consultation, student, consultant }: ChatClientProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(consultation.messages);
  const [newMessage, setNewMessage] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);

  const getInitials = (name = '') => name.split(' ').map((n) => n[0]).join('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;

    const msg: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const handleSummarize = async () => {
    setIsLoadingSummary(true);
    const chatHistory = messages.map(msg => {
        const senderName = msg.senderId === student?.id ? student.name : consultant?.name || 'User';
        return `${senderName}: ${msg.text}`;
    }).join('\n');
    
    try {
        const result = await summarizeConsultationChat({ chatHistory });
        setSummary(result.summary);
        setIsSummaryDialogOpen(true);
    } catch (error) {
        console.error("Error summarizing chat:", error);
        setSummary("Failed to generate summary.");
    } finally {
        setIsLoadingSummary(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const sender = message.senderId === student?.id ? student : consultant;
            const isCurrentUser = message.senderId === user?.id;

            return (
              <div key={message.id} className={cn('flex items-end gap-2', isCurrentUser ? 'justify-end' : 'justify-start')}>
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={sender?.avatarUrl} />
                    <AvatarFallback>{getInitials(sender?.name)}</AvatarFallback>
                  </Avatar>
                )}
                <div className={cn('max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2', 
                    isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                  <p className="text-sm">{message.text}</p>
                  <p className={cn('text-xs mt-1', isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground/70')}>
                    {format(new Date(message.timestamp), 'p')}
                  </p>
                </div>
                 {isCurrentUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={sender?.avatarUrl} />
                    <AvatarFallback>{getInitials(sender?.name)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
           {consultation.status === 'PENDING' && (
                <Alert>
                    <UserIcon className="h-4 w-4" />
                    <AlertTitle>Pending Assignment</AlertTitle>
                    <AlertDescription>
                        An admin will assign a consultant to this request soon. The chat will be enabled once a consultant is assigned.
                    </AlertDescription>
                </Alert>
            )}
            {consultation.status === 'ASSIGNED' && messages.length === 0 && (
                 <Alert variant="default" className="border-primary/50 text-primary">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <AlertTitle>Consultant Assigned!</AlertTitle>
                    <AlertDescription>
                        {consultant?.name} has been assigned to this consultation. You can now begin your conversation.
                    </AlertDescription>
                </Alert>
            )}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        {user?.role === 'consultant' && (
             <Button onClick={handleSummarize} disabled={isLoadingSummary} className="mb-2 w-full" variant="outline">
                <Bot className="mr-2 h-4 w-4" />
                {isLoadingSummary ? 'Generating Summary...' : 'Summarize Chat'}
            </Button>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={consultation.status === 'PENDING' || consultation.status === 'COMPLETED'}
          />
          <Button type="submit" size="icon" disabled={consultation.status === 'PENDING' || consultation.status === 'COMPLETED'}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

       <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">Chat Summary</DialogTitle>
            <DialogDescription>
              An AI-generated summary of the conversation so far.
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-h-[60vh] overflow-y-auto rounded-md border p-4">
             <p>{summary}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
