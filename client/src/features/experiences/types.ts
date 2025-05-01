import { Experience, User } from "@advanced-react/server/database/schema";

type ExperienceWithUser = Experience & {
  user: User;
};

type ExperienceWithCommentsCount = ExperienceWithUser & {
  commentsCount: number;
};

export type ExperienceForList = ExperienceWithCommentsCount &
  ExperienceWithUser;

export type ExperienceForDetails = ExperienceWithUser &
  ExperienceWithCommentsCount;
