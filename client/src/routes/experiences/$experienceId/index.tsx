import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { isTRPCClientError, trpc } from "@/router";
import { CommentsSection } from "@/features/comments/components/CommentsSection";
import { ExperienceDetails } from "@/features/experiences/components/ExperienceDetails";

export const Route = createFileRoute("/experiences/$experienceId/")({
  params: {
    parse: (params) => {
      return {
        experienceId: z.coerce.number().parse(params.experienceId),
      };
    },
  },
  loader: async ({ params, context: { trpcQueryUtils } }) => {
    try {
      await trpcQueryUtils.experiences.byId.ensureData({
        id: params.experienceId,
      });
    } catch (error) {
      if (isTRPCClientError(error) && error.data?.code === "NOT_FOUND") {
        throw notFound();
      }
      throw error;
    }
  },
  component: ExperiencePage,
});

function ExperiencePage() {
  const { experienceId } = Route.useParams();
  const [experience] = trpc.experiences.byId.useSuspenseQuery({
    id: experienceId,
  });
  return (
    <main className="space-y-40 pb-20">
      <ExperienceDetails experience={experience} />
      <CommentsSection
        experienceId={experienceId}
        commentsCount={experience.commentsCount}
      />
    </main>
  );
}
