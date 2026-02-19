-- SQL: Find client emails
SELECT business_name, business_type, au.email
FROM merchants m
JOIN auth.users au ON m.user_id = au.id