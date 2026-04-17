-- Seed Mock Data for Exercises (Content and Exercise Items)

-- 1. Insert Workout Programs (Content)
INSERT INTO public.content (id, type, title_ar, title_en, description_ar, description_en, image_url, sort_order, is_active)
VALUES
  (
    '11111111-1111-1111-1111-111111111111', 
    'exercise', 
    'برنامج تضخيم العضلات - مستوى مبتدئ', 
    'Muscle Building Program - Beginner', 
    'برنامج مخصص للمبتدئين لبناء كتلة عضلية صافية خلال 4 أيام في الأسبوع.', 
    'A beginner-focused program to build lean muscle mass over 4 days a week.', 
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop', 
    1, 
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222', 
    'exercise', 
    'برنامج التنشيف وحرق الدهون', 
    'Fat Loss & Cutting Program', 
    'تمارين مكثفة لزيادة حرق الدهون مع المحافظة على الكتلة العضلية.', 
    'High-intensity workouts designed to maximize fat burn while preserving muscle mass.', 
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop', 
    2, 
    true
  );

-- 2. Insert The Specific Exercises For Each Program (Exercise Items)
INSERT INTO public.exercise_items (content_id, title_ar, title_en, description_ar, description_en, sets, reps, rest_seconds, sort_order)
VALUES
  -- Program 1 Exercises
  (
    '11111111-1111-1111-1111-111111111111',
    'ضغط الصدر المستوي بالبار',
    'Barbell Bench Press',
    'استلقِ على المقعد المستوي، امسك البار بقبضة أوسع من الكتفين بقليل، وانزل ببطء حتى يلامس صدرك.',
    'Lie on a flat bench, grip the barbell slightly wider than shoulder-width, lower slowly to your chest.',
    4,
    '8-10',
    90,
    1
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'سكوات (قرفصاء) بالبار',
    'Barbell Back Squat',
    'ضع البار على الجزء العلوي من الظهر، انزل للأسفل وكأنك تجلس على كرسي مع المحافظة على استقامة الظهر.',
    'Place the barbell on your upper back, lower into a squat position keeping your back straight.',
    4,
    '10-12',
    120,
    2
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'سحب ظهر ديدليفت',
    'Deadlift',
    'ارفع البار من الأرض مع المحافظة على استقامة ظهرك وتفعيل عضلات الأرجل والظهر.',
    'Lift the bar from the ground keeping your back straight and engaging legs and back muscles.',
    3,
    '6-8',
    120,
    3
  ),

  -- Program 2 Exercises
  (
    '22222222-2222-2222-2222-222222222222',
    'تمرين بيربي',
    'Burpees',
    'ابدأ من وضع الوقوف، انزل لوضع الضغط، ثم اقفز للأعلى بأقصى قوة.',
    'Start from standing, drop into a push-up position, then explosively jump upwards.',
    4,
    '15',
    60,
    1
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'قفز وفتح القدمين',
    'Jumping Jacks',
    'اقفز مع فتح القدمين واليدين للأعلى ثم العودة للوضع الطبيعي بسرعة.',
    'Jump spreading your legs and swinging arms up, then return quickly.',
    4,
    '30',
    45,
    2
  );
