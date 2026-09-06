-- TerraTrust AI — Supabase Database Schema
-- Run this script in the Supabase SQL Editor to initialize all 4 database tables 
-- required for the n8n orchestrator workflow and Vercel app persistence.

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Verification Runs Table
CREATE TABLE IF NOT EXISTS public.verification_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT NOT NULL,
  passport_id TEXT NOT NULL,
  workflow_id TEXT,
  status TEXT NOT NULL,
  confidence_score NUMERIC,
  fraud_score NUMERIC,
  risk_score NUMERIC,
  result JSONB,
  correlation_id TEXT,
  idempotency_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_verification_runs_property_id ON public.verification_runs(property_id);
CREATE INDEX IF NOT EXISTS idx_verification_runs_passport_id ON public.verification_runs(passport_id);
CREATE INDEX IF NOT EXISTS idx_verification_runs_status ON public.verification_runs(status);

-- 2. Valuations Table (INR Only)
CREATE TABLE IF NOT EXISTS public.valuations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  confidence_low NUMERIC,
  confidence_high NUMERIC,
  factors JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_valuations_property_id ON public.valuations(property_id);

-- 3. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT NOT NULL,
  event TEXT NOT NULL,
  actor_role TEXT,
  request_id TEXT,
  correlation_id TEXT,
  detail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_property_id ON public.audit_logs(property_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_request_id ON public.audit_logs(request_id);

-- 4. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT NOT NULL,
  passport_id TEXT,
  type TEXT NOT NULL,
  recipient_role TEXT,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_property_id ON public.notifications(property_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_role ON public.notifications(recipient_role);

-- Enable Row Level Security (RLS) & default policies (allow read/write for service role & authenticated users)
ALTER TABLE public.verification_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Default permissive policies for service/anon access in demo/prod build
CREATE POLICY "Allow service role full access to verification_runs" ON public.verification_runs FOR ALL USING (true);
CREATE POLICY "Allow service role full access to valuations" ON public.valuations FOR ALL USING (true);
CREATE POLICY "Allow service role full access to audit_logs" ON public.audit_logs FOR ALL USING (true);
CREATE POLICY "Allow service role full access to notifications" ON public.notifications FOR ALL USING (true);
