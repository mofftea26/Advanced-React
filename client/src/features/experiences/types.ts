import { Experience, User } from "@advanced-react/server/database/schema";

type ExperienceWithUser = Experience & {
  user: User;
};

type ExperienceWithCommentsCount = Experience & {
  commentsCount: number;
};

type ExperienceWithUserContext = Experience & {
  isAttending: boolean;
};

export type ExperienceForList = ExperienceWithCommentsCount &
  ExperienceWithUserContext &
  ExperienceWithUser;

export type ExperienceForDetails = Experience &
  ExperienceWithUserContext &
  ExperienceWithCommentsCount;
