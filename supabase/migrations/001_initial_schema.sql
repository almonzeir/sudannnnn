-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'pharmacist', 'patient');
CREATE TYPE pharmacist_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE question_status AS ENUM ('pending', 'answered', 'closed');

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  role user_role DEFAULT 'patient',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pharmacists table
CREATE TABLE public.pharmacists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  license_number TEXT UNIQUE NOT NULL,
  university TEXT NOT NULL,
  graduation_year INTEGER NOT NULL,
  specialization TEXT,
  status pharmacist_status DEFAULT 'pending',
  approved_by UUID REFERENCES public.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medications table
CREATE TABLE public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  generic_name TEXT,
  category TEXT NOT NULL,
  description TEXT,
  dosage TEXT,
  side_effects TEXT[],
  contraindications TEXT[],
  price DECIMAL(10,2),
  availability BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  pharmacist_id UUID REFERENCES public.users(id),
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  is_urgent BOOLEAN DEFAULT false,
  status question_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answered_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_pharmacists_status ON public.pharmacists(status);
CREATE INDEX idx_pharmacists_user_id ON public.pharmacists(user_id);
CREATE INDEX idx_questions_patient_id ON public.questions(patient_id);
CREATE INDEX idx_questions_pharmacist_id ON public.questions(pharmacist_id);
CREATE INDEX idx_questions_status ON public.questions(status);
CREATE INDEX idx_medications_category ON public.medications(category);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Pharmacists policies
CREATE POLICY "Anyone can view approved pharmacists" ON public.pharmacists
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Pharmacists can view their own data" ON public.pharmacists
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND id = pharmacists.user_id
    )
  );

CREATE POLICY "Admins can view all pharmacists" ON public.pharmacists
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update pharmacist status" ON public.pharmacists
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Medications policies
CREATE POLICY "Anyone can view medications" ON public.medications
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage medications" ON public.medications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Questions policies
CREATE POLICY "Patients can view their own questions" ON public.questions
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Pharmacists can view assigned questions" ON public.questions
  FOR SELECT USING (auth.uid() = pharmacist_id);

CREATE POLICY "Patients can create questions" ON public.questions
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Pharmacists can answer questions" ON public.questions
  FOR UPDATE USING (
    auth.uid() = pharmacist_id AND 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'pharmacist'
    )
  );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')::user_role
  );
  
  -- If user is registering as pharmacist, create pharmacist record
  IF NEW.raw_user_meta_data->>'role' = 'pharmacist' THEN
    INSERT INTO public.pharmacists (user_id, license_number, university, graduation_year, specialization)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'license_number',
      NEW.raw_user_meta_data->>'university',
      (NEW.raw_user_meta_data->>'graduation_year')::INTEGER,
      NEW.raw_user_meta_data->>'specialization'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data

-- Insert sample medications
INSERT INTO public.medications (name, generic_name, category, description, dosage, side_effects, contraindications, price) VALUES
('بنادول', 'Paracetamol', 'مسكنات', 'مسكن للألم وخافض للحرارة', '500mg كل 6 ساعات', ARRAY['غثيان خفيف'], ARRAY['حساسية للباراسيتامول'], 15.00),
('أسبرين', 'Aspirin', 'مسكنات', 'مسكن ومضاد للالتهاب', '325mg يومياً', ARRAY['اضطراب المعدة', 'نزيف'], ARRAY['قرحة المعدة', 'الحمل'], 8.50),
('أموكسيسيلين', 'Amoxicillin', 'مضادات حيوية', 'مضاد حيوي واسع المجال', '500mg كل 8 ساعات', ARRAY['إسهال', 'طفح جلدي'], ARRAY['حساسية البنسلين'], 25.00),
('أوميبرازول', 'Omeprazole', 'أدوية الجهاز الهضمي', 'مثبط مضخة البروتون', '20mg يومياً', ARRAY['صداع', 'إمساك'], ARRAY['حساسية للدواء'], 30.00),
('ميتفورمين', 'Metformin', 'أدوية السكري', 'دواء السكري من النوع الثاني', '500mg مرتين يومياً', ARRAY['اضطراب المعدة', 'إسهال'], ARRAY['أمراض الكلى الشديدة'], 20.00);

-- Create admin user (you'll need to sign up with this email first)
-- This is just a placeholder - the actual admin will be created through the trigger