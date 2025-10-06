import {boolean, index, pgEnum, pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {DAYS_OF_WEEK_IN_ORDER} from "@/constants";
import {relations} from "drizzle-orm";

const createdAt = timestamp("created_at").notNull().defaultNow();
const updatedAt = timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date());

export const EventTable = pgTable(
    "events",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        description: text("description"),
        durationInMinutes: text("duration_in_minutes").notNull(),
        clerkUserId: text("clerk_user_id").notNull(),
        isActive: boolean("is_active").notNull().default(true),
        createdAt,
        updatedAt,
    },
    table => ([
        index('clerk_user_id_idx').on(table.clerkUserId)
    ])
)

export const ScheduleTable = pgTable(
    "schedules",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        timezone: text("timezone").notNull(),
        clerkUserId: text("clerk_user_id").notNull().unique(),
        createdAt,
        updatedAt,
    },
)

export const scheduleRelations = relations(ScheduleTable, ({many}) => ({
    availabilities: many(ScheduleAvailabilityTable),
}));

export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER);

export const ScheduleAvailabilityTable = pgTable(
    "schedule_availabilities",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        dayOfWeek: scheduleDayOfWeekEnum("day_of_week").notNull(),
        startTime: text("start_time").notNull(),
        endTime: text("end_time").notNull(),
        scheduleId: uuid("schedule_id")
            .notNull()
            .references(() => ScheduleTable.id, {onDelete: "cascade", onUpdate: "cascade"}),
        createdAt,
        updatedAt,
    },
    table => ([
        index('schedule_id_idx').on(table.scheduleId)
    ])
)

export const ScheduleAvailabilityRelations = relations(ScheduleAvailabilityTable, ({one}) => ({
    schedule: one(ScheduleTable, {
        fields: [ScheduleAvailabilityTable.scheduleId],
        references: [ScheduleTable.id],
    }),
}));
