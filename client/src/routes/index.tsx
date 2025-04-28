import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/router";
import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import { ExperienceList } from "@/features/experiences/components/ExperienceList";

export const Route = createFileRoute("/")({
  component: Index,
});

export function Index() {
  const experienceQuery = trpc.experiences.feed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <InfiniteScroll
      hasNextPage={!!experienceQuery.data?.pages[0].nextCursor}
      onLoadMore={experienceQuery.fetchNextPage}
    >
      <ExperienceList
        experiences={
          experienceQuery.data?.pages.flatMap((page) => page.experiences) ?? []
        }
        isLoading={
          experienceQuery.isLoading || experienceQuery.isFetchingNextPage
        }
      />
    </InfiniteScroll>
  );
}
