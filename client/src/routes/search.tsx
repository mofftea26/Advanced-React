import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { experienceFiltersSchema } from "@advanced-react/shared/schema/experience";
import { trpc } from "@/router";
import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import { ExperienceList } from "@/features/experiences/components/ExperienceList";
import { ExperienceFilters } from "@/features/experiences/components/ExperienceFilters";
export const Route = createFileRoute("/search")({
  component: SearchPage,
  validateSearch: experienceFiltersSchema,
  loader: async ({ context: { trpcQueryUtils } }) => {
    await trpcQueryUtils.tags.list.ensureData();
  },
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const experiencesQuery = trpc.experiences.search.useInfiniteQuery(search, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!search.q || !!search.tags || !!search.scheduledAt,
  });
  const [tags] = trpc.tags.list.useSuspenseQuery();
  return (
    <main>
      <ExperienceFilters
        onFiltersChange={(filters) => {
          navigate({
            search: filters,
          });
        }}
        initialFilter={search}
        tags={tags}
      />
      <InfiniteScroll
        onLoadMore={
          !!search.q || !!search.tags || !!search.scheduledAt
            ? experiencesQuery.fetchNextPage
            : undefined
        }
      >
        <ExperienceList
          experiences={
            experiencesQuery.data?.pages.flatMap((page) => page.experiences) ??
            []
          }
          isLoading={
            experiencesQuery.isFetchingNextPage || experiencesQuery.isLoading
          }
          noExperiencesText={
            !!search.q ? "No experiences found" : "Search for experiences"
          }
        />
      </InfiniteScroll>
    </main>
  );
}
