-- Migration: 20260720044500_add_expires_at_to_enrollment_requests.sql
-- Description: Add expires_at column to enrollment_requests table

ALTER TABLE public.enrollment_requests
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
