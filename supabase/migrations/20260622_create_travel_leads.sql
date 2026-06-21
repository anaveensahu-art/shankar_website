-- Create travel_leads table
CREATE TABLE IF NOT EXISTS public.travel_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    destination TEXT,
    guests INTEGER,
    accommodation TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.travel_leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (public submission)
CREATE POLICY "Allow public inserts to travel_leads" 
ON public.travel_leads 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Create policy to allow authenticated users to read leads (admin review)
CREATE POLICY "Allow authenticated read access" 
ON public.travel_leads 
FOR SELECT 
TO authenticated 
USING (true);
