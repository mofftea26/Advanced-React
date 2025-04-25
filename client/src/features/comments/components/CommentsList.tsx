import Spinner from "@/features/shared/components/ui/Spinner";
import { CommentForList } from "../types";
import { CommentCard } from "./CommentCard";
type CommentsListProps = {
  comments: CommentForList[];
  isLoading: boolean;
  noCommentsMessage?: string;
};

export function CommentsList({
  comments,
  isLoading,
  noCommentsMessage = "no comments yet",
}: CommentsListProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
      {isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {comments.length === 0 && (
        <div className="flex justify-center">{noCommentsMessage}</div>
      )}
    </div>
  );
}
