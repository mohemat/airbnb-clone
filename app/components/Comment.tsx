"use client";

import { useState } from "react";
import Avatar from "./Avatar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { SafeComment, SafeUser } from "../types";

interface CommentProps {
  comment: SafeComment & {
    user: SafeUser;
  };
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const date = new Date(comment.createdAt);
  const monthYear = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date);

  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const charCount = comment.comment.length;

  return (
    <div className="mb-6 md:mb-0">
      <div className="col-span-4 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div
            className="
            text-l 
            font-semibold 
            flex 
            flex-row 
            items-center
            gap-2
            mb-2
          "
          >
            <Avatar src={comment.user?.image} width={40} height={40} />
            <div>
              <h3 className="font-bold">{comment.user.name}</h3>
              <div className="font-light text-neutral-500">
                <ol>
                  <li>{monthYear}</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          className={`overflow-hidden max-h-24 relative ${
            expanded ? "max-h-none" : "max-h-24"
          }`}
        >
          <p>{comment.comment}</p>
        </div>
        {charCount > 256 && (
          <div>
            {!expanded && (
              <button
                className="flex mt-2 font-bold underline"
                onClick={toggleExpanded}
              >
                Show more <FaChevronRight className="ml-1 mt-1" />
              </button>
            )}
            {expanded && (
              <button
                className="flex mt-2 font-bold underline"
                onClick={toggleExpanded}
              >
                Show less <FaChevronLeft className="ml-1 mt-1" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
