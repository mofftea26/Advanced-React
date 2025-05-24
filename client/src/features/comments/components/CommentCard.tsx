import Card from "@/features/shared/components/ui/Card";
import { CommentForList } from "../types";
import { useState } from "react";
import { CommentEditForm } from "./CommentEditForm";
import { Button } from "@/features/shared/components/ui/Button";
import {
  Dialog,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/Dialog";
import { DialogTrigger } from "@/features/shared/components/ui/Dialog";
import { DialogContent } from "@/features/shared/components/ui/Dialog";
import { trpc } from "@/router";
import { useToast } from "@/features/shared/hooks/useToast";
import { UserAvatar } from "@/features/users/components/UserAvatar";
import { Link } from "@tanstack/react-router";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
type CommentCardProps = {
  comment: CommentForList;
};

export function CommentCard({ comment }: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  if (isEditing) {
    return <CommentEditForm comment={comment} setIsEditing={setIsEditing} />;
  }
  return (
    <Card className="space-y-4">
      <CommentCardHeader comment={comment} />
      <CommentCardContent comment={comment} />
      <CommentCardButtons setIsEditing={setIsEditing} comment={comment} />
    </Card>
  );
}

type CommentCardHeaderProps = Pick<CommentCardProps, "comment">;

function CommentCardHeader({ comment }: CommentCardHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <Link to="/users/$userId" params={{ userId: comment.user.id }}>
        <UserAvatar user={comment.user} />
      </Link>
      <time className="text-sm text-neutral-500">
        . {new Date(comment.createdAt).toLocaleDateString()}
      </time>
    </div>
  );
}

type CommentCardContentProps = Pick<CommentCardProps, "comment">;

function CommentCardContent({ comment }: CommentCardContentProps) {
  return <p className="text-sm">{comment.content}</p>;
}

type CommentCardButtonsProps = Pick<CommentCardProps, "comment"> & {
  setIsEditing: (value: boolean) => void;
};

function CommentCardButtons({
  setIsEditing,
  comment,
}: CommentCardButtonsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { toast } = useToast();
  const utils = trpc.useUtils();

  const deleteCommentMutation = trpc.comments.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.comments.byExperienceId.invalidate({
          experienceId: comment.experienceId,
        }),
        utils.experiences.feed.invalidate({}),
      ]);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Comment deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting comment",
        description: error.message,
      });
    },
  });
  const { currentUser } = useCurrentUser();
  const isCommentOwner = currentUser?.id === comment.user.id;
  const isExperienceOwner = currentUser?.id === comment.experience.userId;

  if (!isCommentOwner && !isExperienceOwner) {
    return null;
  }
  return (
    <div className="flex gap-4">
      {isCommentOwner && (
        <Button variant="link" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
      )}
      {isExperienceOwner && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Delete</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Delete Comment</DialogHeader>
            <DialogDescription>
              Are you sure you want to delete this comment?
            </DialogDescription>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => deleteCommentMutation.mutate({ id: comment.id })}
                disabled={deleteCommentMutation.isPending}
              >
                {deleteCommentMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
