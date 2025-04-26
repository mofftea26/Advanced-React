import { Comment } from "@advanced-react/server/database/schema";
import { commentValidationSchema } from "@advanced-react/shared/schema/comment";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Card from "@/features/shared/components/ui/Card";
import { Form, FormItem } from "@/features/shared/components/ui/Form";
import { FormControl } from "@/features/shared/components/ui/Form";
import { TextArea } from "@/features/shared/components/ui/TextArea";
import { FormField } from "@/features/shared/components/ui/Form";
import { FormMessage } from "@/features/shared/components/ui/Form";
import { Button } from "@/features/shared/components/ui/Button";
import { trpc } from "@/trpc";
import { useToast } from "@/features/shared/hooks/useToast";

type CommentEditFormProps = {
  comment: Comment;
  setIsEditing: (isEditing: boolean) => void;
};
type CommentEditFormData = z.infer<typeof commentValidationSchema>;
export function CommentEditForm({
  comment,
  setIsEditing,
}: CommentEditFormProps) {
  const form = useForm<CommentEditFormData>({
    resolver: zodResolver(commentValidationSchema),
    defaultValues: {
      content: comment.content,
    },
  });

  const utils = trpc.useUtils();
  const { toast } = useToast();

  const editMutation = trpc.comments.edit.useMutation({
    onSuccess: async ({ experienceId }) => {
      await utils.comments.byExperienceId.invalidate({
        experienceId,
      });
      setIsEditing(false);
      toast({
        title: "Comment updated",
        description: "Your comment has been updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to edit comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    editMutation.mutate({
      id: comment.id,
      content: data.content,
    });
  });

  return (
    <Form {...form}>
      <Card>
        <form onSubmit={handleSubmit}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextArea {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <Button type="submit" disabled={editMutation.isPending}>
              {editMutation.isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="link"
              disabled={editMutation.isPending}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </Form>
  );
}
