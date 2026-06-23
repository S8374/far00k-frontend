"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Trash2,
  Pencil,
  FileText,
  Eye,
} from "lucide-react";
import { Message } from "@/types/message";
import { format } from "date-fns";

function MessageBubble({
  msg,
  onEdit,
  onDelete,
  onZoomImage,
}: {
  msg: Message;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onZoomImage: (url: string) => void;
}) {
  console.log('msg',msg);
  const messageTime = msg.createdAt ? format(new Date(msg.createdAt), "h:mm a") : "";
  const senderName = msg.sender?.fullName || "User";

  return (
    <div className={`flex ${msg.isYou ? "justify-end" : "justify-start"} group`}>
      <div className={`max-w-[88%] sm:max-w-[80%] ${msg.isYou ? "ml-auto" : ""}`}>
        {!msg.isYou && (
          <p className="text-xs text-gray-400 mb-1 ml-2">{senderName}</p>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className={`p-2.5 sm:p-3 rounded-2xl text-sm sm:text-[15px] leading-relaxed relative cursor-pointer ${msg.isYou
                  ? "bg-emerald-600 text-white rounded-br-none"
                  : "bg-gray-200/10 text-gray-100 rounded-bl-none"
                }`}
            >
              {msg.content && <p className="whitespace-pre-wrap wrap-anywhere">{msg.content}</p>}

              {msg.attachmentUrl && (
                <div className="mt-2 overflow-hidden rounded-lg group/attach relative">
                  {msg.attachmentType === "IMAGE" ? (
                    <div className="relative max-h-72 w-full bg-black/20 overflow-hidden flex items-center justify-center">
                      <img
                        src={msg.attachmentUrl}
                        alt="Attachment"
                        className="max-h-72 w-auto object-contain cursor-zoom-in"
                        onClick={(e) => {
                          e.stopPropagation();
                          onZoomImage(msg.attachmentUrl!);
                        }}
                      />
                      <a
                        href={msg.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover/attach:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye size={20} /> View Full
                      </a>
                    </div>
                  ) : (
                    <a
                      href={msg.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-black/20 rounded-lg hover:bg-black/40 transition-all group/doc"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2 bg-emerald-500/20 rounded-lg group-hover/doc:bg-emerald-500/40 transition-colors">
                        <FileText className="text-emerald-400" size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover/doc:text-emerald-400 transition-colors">Document</p>
                        <p className="text-[10px] text-gray-500 truncate">Click to view</p>
                      </div>
                      <div className="text-gray-500 group-hover/doc:text-white transition-colors">
                        <Eye size={20} />
                      </div>
                    </a>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-1.5 mt-1 text-xs text-gray-300/70">
                <span>{messageTime}</span>
                {msg.isYou && (
                  <span>{msg.readAt ? "✓✓" : "✓"}</span>
                )}
              </div>
            </div>
          </DropdownMenuTrigger>

          {msg.isYou && (
            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700 text-gray-200">
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => onEdit(msg.id)}
              >
                <Pencil size={16} /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-400 cursor-pointer"
                onClick={() => onDelete(msg.id)}
              >
                <Trash2 size={16} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </div>
  );
}

export default MessageBubble;