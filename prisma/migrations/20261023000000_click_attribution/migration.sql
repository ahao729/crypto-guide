-- Add attribution context to outbound clicks.
ALTER TABLE "ClickLog" ADD COLUMN "source" TEXT;
ALTER TABLE "ClickLog" ADD COLUMN "placement" TEXT;

CREATE INDEX "ClickLog_source_placement_createdAt_idx"
  ON "ClickLog"("source", "placement", "createdAt");
