insert into public.profiles (id, display_name)
select u.id, coalesce(u.raw_user_meta_data->>'display_name', u.raw_user_meta_data->>'full_name', '')
from auth.users u left join public.profiles p on p.id = u.id where p.id is null
on conflict do nothing;