-- Insert default logo settings
INSERT INTO public.site_settings (key, value) VALUES
('logo_primary', 'SHANKAR') ON CONFLICT (key) DO NOTHING;

INSERT INTO public.site_settings (key, value) VALUES
('logo_secondary', 'TRAVELS') ON CONFLICT (key) DO NOTHING;
