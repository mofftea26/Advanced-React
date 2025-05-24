import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/features/shared/components/ui/Form";
import { trpc } from "@/router";
import { Experience } from "@advanced-react/server/database/schema";
import { commentValidationSchema } from "@advanced-react/shared/schema/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TextArea } from "@/features/shared/components/ui/TextArea";
import { Button } from "@/features/shared/components/ui/Button";
import { useToast } from "@/features/shared/hooks/useToast";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
type CommentCreateFormProps = {
  experienceId: Experience["id"];
};

type CommentCreateFormData = z.infer<typeof commentValidationSchema>;

export function CommentCreateForm({ experienceId }: CommentCreateFormProps) {
  const form = useForm<CommentCreateFormData>({
    resolver: zodResolver(commentValidationSchema),
    defaultValues: {
      content: "",
    },
  });

  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { currentUser } = useCurrentUser();
  const addCommentMutation = trpc.comments.add.useMutation({
    onSuccess: async ({ experienceId }) => {
      await Promise.all([
        utils.comments.byExperienceId.invalidate({ experienceId }),
        utils.experiences.feed.invalidate({}),
      ]);
      form.reset();
      toast({
        title: "Comment added",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    addCommentMutation.mutate({
      content: data.content,
      experienceId,
    });
  });

  if (!currentUser) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-muted-foreground text-sm">
          Please login to add a comment
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextArea {...field} placeholder="Add a comment..." />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={addCommentMutation.isPending}>
          Add Comment
        </Button>
      </form>
    </Form>
  );
}
