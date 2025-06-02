import * as React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ExperienceList } from "@/features/experiences/components/ExperienceList";
import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import { trpc } from "@/router";

export const Route = createFileRoute("/favorites/")({
  loader: async ({ context: { trpcQueryUtils } }) => {
    const { currentUser } = await trpcQueryUtils.auth.currentUser.ensureData();

    if (!currentUser) {
      return redirect({ to: "/login" });
    }
    await trpcQueryUtils.experiences.favorites.prefetchInfinite({});
  },
  component: FavoritesPage,
});

function FavoritesPage() {
  const [{ pages }, experiencesQuery] =
    trpc.experiences.favorites.useSuspenseInfiniteQuery(
      {},
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

  return (
    <main className="flex flex-col gap-4">
      <InfiniteScroll
        onLoadMore={experiencesQuery.fetchNextPage}
        hasNextPage={experiencesQuery.hasNextPage}
      >
        <ExperienceList
          experiences={pages.flatMap((page) => page.experiences)}
          isLoading={experiencesQuery.isFetchingNextPage}
        />
      </InfiniteScroll>
    </main>
  );
}
