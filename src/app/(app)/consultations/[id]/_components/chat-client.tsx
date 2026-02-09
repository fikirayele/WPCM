'use client';

import { useState, useEffect } from 'react';
import type { Consultation, Message, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Send, User as UserIcon, CheckCircle, Hand } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ChatClientProps {
  consultation: Consultation;
  student?: User;
  consultant?: User;
}

export function ChatClient({ consultation, student, consultant }: ChatClientProps) {
  const { user, updateConsultation, acceptConsultation } = useAuth();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [testimonial, setTestimonial] = useState(consultation.testimonial || '');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;

    const msg: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };
    
    updateConsultation(consultation.id, {
        messages: [...consultation.messages, msg],
        lastMessageAt: new Date().toISOString(),
    });
    setNewMessage('');
  };
  
  const handleAccept = () => {
    if (!user) return;
    acceptConsultation(consultation.id, user.id);
  };

  const handleCompleteConsultation = () => {
    updateConsultation(consultation.id, { status: 'COMPLETED' });
    toast({ title: 'Consultation Completed', description: 'This consultation has been archived.' });
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (testimonial.trim()) {
      updateConsultation(consultation.id, { testimonial: testimonial.trim() });
      toast({ title: 'Thank You!', description: 'Your feedback has been submitted.' });
    }
  };
  
  const isChatDisabled = consultation.status !== 'ACTIVE';
  const isCurrentUserStudent = user?.id === student?.id;
  const isCurrentUserConsultant = user?.id === consultant?.id;

  const getPlaceholderText = () => {
    if (isChatDisabled) {
      switch(consultation.status) {
        case 'PENDING':
          return "Waiting for a consultant to be assigned...";
        case 'AWAITING_ACCEPTANCE':
          if (isCurrentUserStudent && !consultation.studentAccepted) return "Please accept the consultation to enable chat.";
          if (isCurrentUserStudent && consultation.studentAccepted) return "Waiting for the consultant to accept...";
          if (isCurrentUserConsultant && !consultation.consultantAccepted) return "Please accept the consultation to enable chat.";
          if (isCurrentUserConsultant && consultation.consultantAccepted) return "Waiting for the student to accept...";
          return "Waiting for both parties to accept...";
        case 'COMPLETED':
            return "This consultation is complete.";
        case 'PAUSED':
            return "This consultation is paused.";
        default:
          return "Chat is currently disabled.";
      }
    }
    return "Type your message...";
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {consultation.messages.map((message) => {
            const sender = message.senderId === student?.id ? student : consultant;
            const isCurrentUser = message.senderId === user?.id;

            return (
              <div key={message.id} className={cn('flex items-end gap-2', isCurrentUser ? 'justify-end' : 'justify-start')}>
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={sender?.avatarUrl} />
                    <AvatarFallback>
                      <UserIcon className="h-4 w-4" />
                    </AvatarFallback>
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
                    <AvatarFallback>
                      <UserIcon className="h-4 w-4" />
                    </AvatarFallback>
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
            {consultation.status === 'AWAITING_ACCEPTANCE' && (
                <Alert variant="default" className="border-blue-500/50 text-blue-600">
                    <Hand className="h-4 w-4 text-blue-600" />
                    <AlertTitle>Acceptance Required</AlertTitle>
                    <AlertDescription>
                        {isCurrentUserStudent && !consultation.studentAccepted && "Please accept the consultation to begin."}
                        {isCurrentUserStudent && consultation.studentAccepted && "Waiting for consultant to accept."}
                        {isCurrentUserConsultant && !consultation.consultantAccepted && "Please accept this consultation to begin."}
                        {isCurrentUserConsultant && consultation.consultantAccepted && "Waiting for student to accept."}
                    </AlertDescription>
                </Alert>
            )}
            {consultation.status === 'ACTIVE' && consultation.messages.length === 0 && (
                 <Alert variant="default" className="border-primary/50 text-primary">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <AlertTitle>Ready to Chat!</AlertTitle>
                    <AlertDescription>
                       Both parties have accepted. You can now begin your conversation with {isCurrentUserStudent ? consultant?.fullName : student?.fullName}.
                    </AlertDescription>
                </Alert>
            )}
            {consultation.status === 'COMPLETED' && (
                 <Alert variant="default" className="border-green-500/50 text-green-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle>Consultation Completed</AlertTitle>
                    <AlertDescription>
                       This consultation is complete. You can view the chat history above.
                    </AlertDescription>
                </Alert>
            )}
        </div>
      </ScrollArea>
      <div className="border-t p-4 space-y-4">
        {consultation.status === 'ACTIVE' && isCurrentUserConsultant && (
            <Button onClick={handleCompleteConsultation} className="w-full" variant="outline">
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Complete
            </Button>
        )}
        
        {consultation.status === 'AWAITING_ACCEPTANCE' && (
            <>
              {isCurrentUserStudent && !consultation.studentAccepted && (
                  <Button onClick={handleAccept} className="w-full">Accept Consultation</Button>
              )}
              {isCurrentUserConsultant && !consultation.consultantAccepted && (
                  <Button onClick={handleAccept} className="w-full">Accept Consultation</Button>
              )}
            </>
        )}
        
        {consultation.status !== 'COMPLETED' ? (
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={getPlaceholderText()}
              disabled={isChatDisabled}
            />
            <Button type="submit" size="icon" disabled={isChatDisabled}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <div>
            <h3 className="font-semibold text-lg mb-2">Feedback & Testimonial</h3>
            {consultation.testimonial ? (
                <blockquote className="mt-2 border-l-2 pl-4 italic text-muted-foreground">
                    "{consultation.testimonial}"
                </blockquote>
            ) : isCurrentUserStudent ? (
                <form onSubmit={handleSaveTestimonial} className="space-y-2">
                    <Label htmlFor="testimonial">Share your experience to help us improve.</Label>
                    <Textarea 
                        id="testimonial"
                        placeholder="How was your experience?"
                        value={testimonial}
                        onChange={(e) => setTestimonial(e.target.value)}
                    />
                    <Button type="submit" className="w-full">Submit Feedback</Button>
                </form>
            ) : (
                 <p className="text-sm text-muted-foreground">The student has not yet submitted feedback for this consultation.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
