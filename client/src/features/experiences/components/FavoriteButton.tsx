import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Button } from "@/features/shared/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { trpc } from "@/router";
import { Experience } from "@advanced-react/server/database/schema";
import { Heart } from "lucide-react";
import { useExperienceMutations } from "../hooks/useExperienceMutations";
type ExperienceFavoriteButtonProps = {
  experienceId: Experience["id"];
  isFavorited: boolean;
  favoriteCount: number;
};

export function ExperienceFavoriteButton({
  experienceId,
  isFavorited,
  favoriteCount,
}: ExperienceFavoriteButtonProps) {
  const { currentUser } = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  const { favoriteMutation, unfavoriteMutation } = useExperienceMutations();

  return (
    <Button
      variant="link"
      onClick={() => {
        if (isFavorited) {
          unfavoriteMutation.mutate({ id: experienceId });
        } else {
          favoriteMutation.mutate({ id: experienceId });
        }
      }}
      disabled={favoriteMutation.isPending || unfavoriteMutation.isPending}
    >
      <Heart
        className={cn("h-6 w-6", isFavorited && "fill-red-500 text-red-500")}
      />
      <span>{favoriteCount}</span>
    </Button>
  );
}
