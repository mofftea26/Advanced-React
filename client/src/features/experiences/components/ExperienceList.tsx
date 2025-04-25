import { ExperienceCard } from "@/features/experiences/components/ExperienceCard";
import Spinner from "@/features/shared/components/ui/Spinner";
import { ExperienceForList } from "../types";

type ExperienceListProps = {
  experiences: ExperienceForList[];
  isLoading?: boolean;
  noExperiencesText?: string;
};
export function ExperienceList({
  experiences,
  isLoading,
  noExperiencesText,
}: ExperienceListProps) {
  return (
    <div className="space-y-4">
      {experiences.map((experience) => (
        <ExperienceCard key={experience.id} experience={experience} />
      ))}
      {isLoading && (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      )}
      {experiences.length === 0 && !isLoading && (
        <div className="flex items-center justify-center">
          {noExperiencesText}
        </div>
      )}
    </div>
  );
}
