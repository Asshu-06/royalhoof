-- Clear cached Benefits, Offerings, and CSR settings to force reload from new defaults
-- This will make the website use the updated image URLs from the default data files

-- Clear Benefits section cache
DELETE FROM site_settings WHERE key = 'site_benefits_en';

-- Clear Offerings/Services section cache  
DELETE FROM site_settings WHERE key = 'site_offerings';
DELETE FROM site_settings WHERE key = 'site_offerings_header';

-- Clear CSR section cache
DELETE FROM site_settings WHERE key = 'csr_section_en';

-- Verify deletion
SELECT key, updated_at FROM site_settings 
WHERE key IN ('site_benefits_en', 'site_offerings', 'site_offerings_header', 'csr_section_en')
ORDER BY key;

-- After running this script:
-- 1. Refresh your website (Ctrl+F5 or Cmd+Shift+R to hard refresh)
-- 2. The website will now load images from the updated default data files
-- 3. The new contextually-appropriate images will display
