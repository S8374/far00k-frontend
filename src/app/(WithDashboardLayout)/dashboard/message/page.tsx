"use client";

import MessageBubble from "@/components/message/MessageBubble";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, Conversation } from "@/types/message";
import {
  ArrowLeft,
  MessageSquare,
  Search,
  Send,
  Shield,
  X,
  Image as ImageIcon,
  FileText,
  Loader2,
  PlusCircle,
} from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useGetConversationsQuery, useGetHistoryQuery, useUpdateMessageMutation, useDeleteMessageMutation } from "@/redux/api/messageApi";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useSocket } from "@/provider/SocketProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { useUploadImagesMutation } from "@/redux/api/uploade.api";
import Image from "next/image";
import { toast } from "sonner";

export default function MessagesPage() {
  const { data: userData } = useGetMeQuery({});
  const currentUser = userData?.data?.data || userData?.data;
  const currentUserId = currentUser?.id;

  const { data: conversationsData, isLoading: isLoadingConversations, refetch: refetchConversations } = useGetConversationsQuery({});
  const [updateMessage] = useUpdateMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const conversations: Conversation[] = Array.isArray(conversationsData) ? conversationsData : [];

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [typingConversations, setTypingConversations] = useState<Record<string, boolean>>({});
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [enlargeImage, setEnlargeImage] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'IMAGE' | 'DOCUMENT' | null>(null);
  const [pendingAttachment, setPendingAttachment] = useState<{ url: string; type: 'IMAGE' | 'DOCUMENT' } | null>(null);
  
  const [uploadImages] = useUploadImagesMutation();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const { socket, isConnected, onlineUsers, refreshOnlineUsers } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const { data: historyData, isLoading: isLoadingHistory, refetch: refetchHistory } = useGetHistoryQuery(selectedChatId!, {
    skip: !selectedChatId,
  });

  // Refetch history when socket reconnects or chat is selected to ensure we have missed messages
  useEffect(() => {
    if (isConnected && selectedChatId) {
      refetchHistory();
    }
  }, [isConnected, selectedChatId, refetchHistory]);

  const selectedConversation = conversations.find(c => c.id === selectedChatId);

  // Initialize messages from history
  useEffect(() => {
    if (Array.isArray(historyData)) {
      const messagesWithIsYou = historyData.map((m: any) => ({
        ...m,
        isYou: m.senderId === currentUserId,
      }));
      setLocalMessages(messagesWithIsYou);
    }
  }, [historyData, currentUserId]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    if (selectedChatId) {
      socket.emit("joinConversation", { conversationId: selectedChatId });
      socket.emit("markRead", { conversationId: selectedChatId });
    }

    socket.on("newMessage", (message: Message) => {
      console.log("Received newMessage:", message);
      if (message.conversationId === selectedChatId) {
        setLocalMessages((prev) => [...prev, { ...message, isYou: message.senderId === currentUserId }]);
        socket.emit("markRead", { conversationId: selectedChatId });
      }
      
      // OPTIMISTIC SIDEBAR UPDATE
      refetchConversations(); // Still refetch to be safe, but we could manually update state here
    });

    socket.on("userTyping", (data: { userId: string, conversationId: string, isTyping: boolean }) => {
      if (data.userId !== currentUserId) {
        setTypingConversations((prev) => ({
          ...prev,
          [data.conversationId]: data.isTyping,
        }));
      }
    });

    socket.on("messageUpdated", (updatedMessage: Message) => {
      console.log("Received messageUpdated:", updatedMessage);
      setLocalMessages((prev) => 
        prev.map((msg) => (msg.id === updatedMessage.id ? { ...updatedMessage, isYou: updatedMessage.senderId === currentUserId } : msg))
      );
      refetchConversations();
    });

    socket.on("messageDeleted", (data: { messageId: string }) => {
      console.log("Received messageDeleted:", data);
      setLocalMessages((prev) => prev.filter((msg) => msg.id !== data.messageId));
      refetchConversations();
    });

    return () => {
      socket.off("newMessage");
      socket.off("userTyping");
      socket.off("messageUpdated");
      socket.off("messageDeleted");
    };
  }, [socket, selectedChatId, currentUserId, refetchConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const handleTyping = (text: string) => {
    setMessageText(text);
    if (!socket || !selectedChatId) return;

    socket.emit("typing", {
      conversationId: selectedChatId,
      isTyping: text.length > 0,
    });
  };

  const sendMessage = async () => {
    if ((!messageText.trim() && !pendingAttachment) || !socket || !selectedChatId) return;

    if (editingMessageId) {
      console.log("Updating message via API:", editingMessageId);
      try {
        await updateMessage({ id: editingMessageId, content: messageText.trim() }).unwrap();
        socket.emit("updateMessage", { messageId: editingMessageId, content: messageText.trim() });
      } catch (err) {
        console.error("Failed to update message:", err);
      }
      setEditingMessageId(null);
    } else {
      console.log("Sending message with payload:", {
        content: messageText.trim(),
        attachmentUrl: pendingAttachment?.url,
        attachmentType: pendingAttachment?.type,
      });
      
      socket.emit("sendMessage", {
        conversationId: selectedChatId,
        content: messageText.trim() || undefined,
        attachmentUrl: pendingAttachment?.url,
        attachmentType: pendingAttachment?.type,
      });
    }

    setMessageText("");
    setPendingAttachment(null);
    socket.emit("typing", {
      conversationId: selectedChatId,
      isTyping: false,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'IMAGE' | 'DOCUMENT') => {
    const file = e.target.files?.[0];
    if (!file || !selectedChatId || !socket) return;

    setIsUploading(true);
    setUploadType(type);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await uploadImages(formData).unwrap();
      console.log("Upload response:", response);
      
      // Handle both { data: { urls: [] } } and { data: { data: { urls: [] } } } formats
      const urls = response?.data?.urls || response?.data?.data?.urls;
      const fileUrl = urls?.[0];

      if (!fileUrl) {
        throw new Error("No URL found in response");
      }

      setPendingAttachment({
        url: fileUrl,
        type: type
      });

    } catch (err) {
      console.error("Upload error detail:", err);
      alert("Failed to upload. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadType(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (docInputRef.current) docInputRef.current.value = "";
    }
  };

  const handleEdit = (id: string) => {
    console.log("Edit requested for ID:", id);
    const msgToEdit = localMessages.find((m) => m.id === id);
    if (msgToEdit) {
      setMessageText(msgToEdit.content || "");
      setEditingMessageId(id);
    }
  };

  const performDeleteMessage = async (id: string) => {
    if (!socket) {
      console.error("Socket not connected");
      toast.error("Socket not connected");
      return;
    }

    // OPTIMISTIC DELETE: Remove from local UI immediately
    setLocalMessages((prev) => prev.filter((msg) => msg.id !== id));

    try {
      await deleteMessage(id).unwrap();
      socket.emit("deleteMessage", { messageId: id, conversationId: selectedChatId });
      toast.success("Message deleted");
    } catch (err) {
      console.error("Failed to delete message:", err);
      toast.error("Failed to delete message");
      // If it truly fails, refetch to restore the message
      refetchConversations();
    }
  };

  const handleDelete = (id: string) => {
    console.log("Delete requested for ID:", id);

    toast("Delete this message?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          void performDeleteMessage(id);
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          toast.message("Delete canceled");
        },
      },
      duration: 7000,
    });
  };

  const otherParticipant = useMemo(() => {
    return selectedConversation?.participants.find(p => p.id !== currentUserId);
  }, [selectedConversation, currentUserId]);

  const isOtherOnline = otherParticipant ? onlineUsers.has(otherParticipant.id) : false;
  const isActiveTyping = Boolean(selectedChatId && typingConversations[selectedChatId]);
  const activeTypingName = otherParticipant?.fullName || "Md Sabbir Mridha";

  if (isLoadingConversations) {
    return (
      <div className="h-[calc(100dvh-9rem)] flex flex-col text-gray-100 overflow-hidden min-h-0 bg-stone-950/20 rounded-xl">
        <div className="flex h-full">
          {/* Sidebar Skeleton */}
          <div className="w-80 border-r border-white/5 p-4 space-y-4 hidden lg:block">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3 items-center opacity-40 animate-pulse">
                <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24 bg-white/10" />
                  <Skeleton className="h-3 w-40 bg-white/10" />
                </div>
              </div>
            ))}
          </div>
          {/* Main Area Skeleton */}
          <div className="flex-1 flex flex-col p-4 space-y-6">
             <div className="flex gap-3 opacity-20 animate-pulse">
                <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                <Skeleton className="h-16 w-64 rounded-2xl rounded-tl-none bg-white/10" />
             </div>
             <div className="flex gap-3 justify-end opacity-20 animate-pulse">
                <Skeleton className="h-16 w-56 rounded-2xl rounded-tr-none bg-emerald-500/10" />
                <Skeleton className="h-10 w-10 rounded-full bg-emerald-500/10" />
             </div>
             <div className="flex gap-3 opacity-20 animate-pulse">
                <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                <Skeleton className="h-12 w-48 rounded-2xl rounded-tl-none bg-white/10" />
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-9rem)] flex flex-col text-gray-100 overflow-hidden min-h-0">
      <div className="px-1 sm:px-2">
        <h1 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Messages</h1>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Chat List */}
        <div
          className={`rounded-xl bg-stone-800/70 w-full lg:w-80 overflow-y-auto shrink-0 min-h-0 lg:mr-4 ${
            selectedChatId ? "hidden lg:block" : "block"
          }`}
        >
          <div className="relative w-full max-w-md my-2 px-4 border-b pb-2">
            <Search className="absolute left-7 top-5 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-stone-900 text-gray-200 rounded-lg h-10 border-0 focus-visible:ring-emerald-600/50"
            />
          </div>
          {conversations.map((chat) => {
            const other = chat.participants.find(p => p.id !== currentUserId);
            const lastMsg = chat.messages?.[0];
            const isOnline = other ? onlineUsers.has(other.id) : false;

            return (
              <div
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`p-3 flex items-center gap-3 border-b border-gray-700/40 hover:bg-emerald-900/20 cursor-pointer ${selectedChatId === chat.id ? "bg-emerald-950/40" : ""
                  }`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12 text-black">
                    <AvatarImage src={other?.avatarUrl || ""} />
                    <AvatarFallback className="bg-emerald-800 text-white">
                      {other?.fullName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-gray-950" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-medium truncate">{other?.fullName}</p>
                    <span className="text-xs text-gray-400">
                      {chat.updatedAt ? format(new Date(chat.updatedAt), "p") : ""}
                    </span>
                  </div>
                  {typingConversations[chat.id] && chat.id !== selectedChatId ? (
                    <p className="text-sm text-emerald-400 italic mt-0.5">Typing...</p>
                  ) : (
                    <p className="text-sm text-gray-400 truncate mt-0.5">
                      {lastMsg?.content || "No messages yet"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Area */}
        <div
          className={`rounded-xl bg-stone-800/70 flex-1 flex flex-col min-h-0 overflow-hidden ${selectedChatId ? "block" : "hidden lg:block"
            }`}
        >
          {selectedChatId ? (
            <>
              {/* Header */}
              <div className="bg-emerald-900/60 px-2.5 py-2.5 sm:p-3 flex items-center rounded-t-xl justify-between gap-2 sm:gap-3 shrink-0 sticky top-0 z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-emerald-400/10 hover:bg-emerald-400/30 shrink-0 h-8 w-8 sm:h-9 sm:w-9"
                    onClick={() => setSelectedChatId(null)}
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                  <Avatar className="h-9 w-9 sm:h-10 sm:w-10 text-black shrink-0">
                    <AvatarImage src={otherParticipant?.avatarUrl || ""} />
                    <AvatarFallback className="bg-emerald-800 text-white">
                      {otherParticipant?.fullName?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <h2 className="font-medium text-sm sm:text-base truncate">{otherParticipant?.fullName}</h2>
                    <div className="min-h-5 flex items-center">
                      {isActiveTyping ? (
                        <p className="text-xs text-emerald-400 italic truncate">
                          {activeTypingName} is typing...
                        </p>
                      ) : (
                        <p className={`text-xs ${isOtherOnline ? "text-emerald-400" : "text-gray-400"}`}>
                          {isOtherOnline ? "Online" : "Offline"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <Badge className="bg-emerald-800/70 border-0 hidden sm:inline-flex shrink-0">
                  <Shield size={14} className="mr-1" /> Verified
                </Badge>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 min-h-0 p-2 sm:p-4 bg-transparent">
                <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
                  {isLoadingHistory ? (
                    <div className="space-y-3">
                      <Skeleton className="h-12 w-48" />
                      <Skeleton className="h-12 w-64 ml-auto" />
                    </div>
                  ) : (
                    localMessages.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        msg={msg}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onZoomImage={setEnlargeImage}
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 shrink-0 transition-all">
                {/* PREVIEW AREA */}
                {pendingAttachment && (
                  <div className="mb-3 flex animate-in slide-in-from-bottom-2 duration-300">
                    <div className="relative group/preview rounded-xl overflow-hidden border border-emerald-500/30 bg-emerald-950/20 p-2 pr-10 flex items-center gap-3">
                       {pendingAttachment.type === 'IMAGE' ? (
                          <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-white/10">
                            <Image src={pendingAttachment.url} alt="Preview" fill className="object-cover" />
                          </div>
                       ) : (
                          <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center">
                            <FileText size={24} className="text-emerald-400" />
                          </div>
                       )}
                       <div className="min-w-0 pr-4">
                          <p className="text-xs font-medium text-emerald-400 tracking-wide uppercase">Attached {pendingAttachment.type}</p>
                          <p className="text-[10px] text-gray-500 truncate max-w-37.5">Ready to send...</p>
                       </div>
                       <button 
                         onClick={() => setPendingAttachment(null)}
                         className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-red-400 transition-colors"
                       >
                          <X size={18} />
                       </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 bg-[#2A2A2A] rounded-full px-4 py-1 border border-white/5 shadow-inner">
                  {/* Hidden Inputs */}
                  <input
                    type="file"
                    ref={imageInputRef}
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'IMAGE')}
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={docInputRef}
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileUpload(e, 'DOCUMENT')}
                    className="hidden"
                  />

                  {/* Attachment Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-emerald-400 transition-colors"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isUploading}
                      title="Send Image"
                    >
                      {isUploading && uploadType === 'IMAGE' ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <ImageIcon size={20} />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-emerald-400 transition-colors"
                      onClick={() => docInputRef.current?.click()}
                      disabled={isUploading}
                      title="Send Document"
                    >
                      {isUploading && uploadType === 'DOCUMENT' ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <FileText size={20} />
                      )}
                    </Button>
                  </div>

                  <div className="w-px h-6 bg-white/10 mx-1 shrink-0" />

                  <Input
                    value={messageText}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="Type a message..."
                    className="bg-transparent border-0 focus-visible:ring-0 text-sm sm:text-base placeholder:text-gray-500 h-9 sm:h-10 min-w-0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                      if (e.key === "Escape" && editingMessageId) {
                        setEditingMessageId(null);
                        setMessageText("");
                      }
                    }}
                  />

                  {editingMessageId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                      onClick={() => {
                        setEditingMessageId(null);
                        setMessageText("");
                      }}
                    >
                      <X size={16} />
                    </Button>
                  )}

                  <Button
                    size="icon"
                    className="rounded-full bg-emerald-600 hover:bg-emerald-700 w-8 h-8 sm:w-9 sm:h-9 shrink-0"
                    onClick={sendMessage}
                    disabled={!messageText.trim()}
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4">
              <div className="bg-stone-900/50 p-8 rounded-full shadow-2xl">
                <MessageSquare className="w-20 h-20 text-emerald-600 opacity-50" />
              </div>
              <p className="text-xl">Your Inbox</p>
              <p className="text-sm max-w-xs text-center opacity-70 italic">
                Select a conversation from the left or start a new one by visiting a property page.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
