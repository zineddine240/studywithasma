-- Add recording_url to live_classes

ALTER TABLE "public"."live_classes" 
ADD COLUMN "recording_url" TEXT;
