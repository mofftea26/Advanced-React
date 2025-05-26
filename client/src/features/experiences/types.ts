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
export type ExperienceForAttendeesCount = Experience & {
  attendeesCount: number;
};

export type ExperienceWithAttendees = Experience & {
  attendees: User[];
};
export type ExperienceForList = ExperienceWithUser &
  ExperienceWithUserContext &
  ExperienceWithCommentsCount &
  ExperienceForAttendeesCount;

export type ExperienceForDetails = Experience &
  ExperienceWithUser &
  ExperienceWithUserContext &
  ExperienceWithCommentsCount &
  ExperienceForAttendeesCount &
  ExperienceWithAttendees;
