"use client";

import React from "react";

import Comment from "../Comment";
import TextArea from "../inputs/TextArea";
import { toast } from "react-hot-toast";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../Button";
import { SafeComment, SafeUser } from "@/app/types";

interface ListingCommentProps {
  onComment: (commentText: string) => void;
  listingComments?:
    | (SafeComment & {
        user: SafeUser;
      })[]
    | null;
}

const ListingComment: React.FC<ListingCommentProps> = ({
  onComment,
  listingComments,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      comment: "",
    },
  });

  const onsubmit: SubmitHandler<FieldValues> = (data) => {
    if (
      data.comment.trim() === "" ||
      data.comment === "" ||
      data.comment === null ||
      data.comment === undefined ||
      data.comment.length === 0
    ) {
      toast.error("You cannot post an empty comment");
    } else {
      onComment(data.comment);
      reset();
    }
  };

  return (
    <div className="mt-10">
      <form onSubmit={handleSubmit(onsubmit)}>
        <TextArea
          id="comment"
          rows={4}
          label="Type Your Comment Here"
          register={register}
          errors={errors}
          required
        />

        <Button outline type="submit" label="Add Your Comment" />
      </form>

      <div className="md:grid md:grid-cols-2 gap-10 justify-between mt-6 sm:p-2">
        {listingComments &&
          Object.keys(listingComments).map((key) => (
            <Comment key={key} comment={listingComments[Number(key)]} />
          ))}
      </div>
    </div>
  );
};

export default ListingComment;
