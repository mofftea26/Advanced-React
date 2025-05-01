import { ExperienceList } from "@/features/experiences/components/ExperienceList";
import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import { trpc } from "@/router";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  component: Index,
  loader: async ({ context: { trpcQueryUtils } }) => {
    await trpcQueryUtils.experiences.feed.prefetchInfinite({});
  },
});

export function Index() {
  const [{ pages }, experienceQuery] =
    trpc.experiences.feed.useSuspenseInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  return (
    <InfiniteScroll onLoadMore={experienceQuery.fetchNextPage}>
      <ExperienceList
        experiences={pages.flatMap((page) => page.experiences)}
        isLoading={experienceQuery.isFetchingNextPage}
      />
    </InfiniteScroll>
  );
}
