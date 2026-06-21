-- Alter travel_leads table to add status and admin_notes
ALTER TABLE public.travel_leads ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Pending';
ALTER TABLE public.travel_leads ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Create site_settings table for key-value configuration
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to settings
CREATE POLICY "Allow public read to site_settings" 
ON public.site_settings 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Policy: Allow authenticated users (admin) to manage settings
CREATE POLICY "Allow authenticated manage to site_settings" 
ON public.site_settings 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users (admin) to update travel_leads (e.g. update status/notes)
CREATE POLICY "Allow authenticated update to travel_leads" 
ON public.travel_leads 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users (admin) to delete travel_leads
CREATE POLICY "Allow authenticated delete to travel_leads" 
ON public.travel_leads 
FOR DELETE 
TO authenticated 
USING (true);

-- Insert default site settings if they do not exist
INSERT INTO public.site_settings (key, value) VALUES
('hero_title', 'Elevating Your Journey') ON CONFLICT (key) DO NOTHING;

INSERT INTO public.site_settings (key, value) VALUES
('hero_desc', 'From premium corporate retreat coordination and business flights to curated luxury holiday packages, we handle every detail of your itinerary.') ON CONFLICT (key) DO NOTHING;

INSERT INTO public.site_settings (key, value) VALUES
('hero_badge', 'Bespoke Travel Solutions') ON CONFLICT (key) DO NOTHING;

INSERT INTO public.site_settings (key, value) VALUES
('hero_image_url', 'assets/travel_hero.jpg') ON CONFLICT (key) DO NOTHING;

INSERT INTO public.site_settings (key, value) VALUES
('whatsapp_number', '919999999999') ON CONFLICT (key) DO NOTHING;
