export type Message = {
    id: string;
    conversationId: string;
    senderId: string;
    content?: string;
    attachmentUrl?: string | null;
    attachmentType?: string | null;
    createdAt: string;
    readAt?: string | null;
    sender?: {
        id: string;
        fullName: string;
        avatarUrl?: string | null;
    };
    isYou?: boolean;
};

export type ConversationParticipant = {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
    isOnline: boolean;
    lastActive?: string;
};

export type Conversation = {
    id: string;
    propertyId?: string | null;
    createdAt: string;
    updatedAt: string;
    participants: ConversationParticipant[];
    messages?: Message[];
    property?: {
        id: string;
        title: string;
        price: number;
    } | null;
};