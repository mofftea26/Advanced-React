import Spinner from "@/features/shared/components/ui/Spinner";
import { CommentForList } from "../types";
import { CommentCard } from "./CommentCard";
type CommentsListProps = {
  comments: CommentForList[];
  noCommentsMessage?: string;
};

export function CommentsList({
  comments,
  noCommentsMessage = "no comments yet",
}: CommentsListProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}

      {comments.length === 0 && (
        <div className="flex justify-center">{noCommentsMessage}</div>
      )}
    </div>
  );
}
