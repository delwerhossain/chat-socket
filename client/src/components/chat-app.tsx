'use client';

import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PaperPlaneIcon, PlusCircledIcon } from '@radix-ui/react-icons';

// Define the type for your message object
interface Message {
  sender: string;
  content: string;
  time: string;
}

// Connect to your backend (replace with your backend URL if needed)
const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000');

export function ChatApp() {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]); // Specify the type here

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on('message', (newMessage: Message) => { // Specify the type here
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      // Clean up the listener when the component unmounts
      socket.off('message');
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: Message = {
        sender: 'You',
        content: message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit('message', newMessage); // Emit the message to the server
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Add the message to local state
      setMessage(''); // Clear the input field
    }
  };

  const conversations = [
    { id: 1, name: 'Alice Johnson', lastMessage: 'Hey, how are you?', time: '2m ago' },
    { id: 2, name: 'Bob Smith', lastMessage: 'Can we meet tomorrow?', time: '1h ago' },
    { id: 3, name: 'Charlie Brown', lastMessage: 'Thanks for your help!', time: '3h ago' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Chats</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          {conversations.map((conversation) => (
            <div key={conversation.id} className="p-4 hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${conversation.name}`} />
                  <AvatarFallback>{conversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{conversation.name}</p>
                  <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                </div>
                <span className="text-xs text-gray-400">{conversation.time}</span>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="p-4 border-t border-gray-200">
          <Button className="w-full">
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/6.x/initials/svg?seed=Alice Johnson" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">Alice Johnson</h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`max-w-[70%] ${msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg p-3`}>
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <PaperPlaneIcon className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
