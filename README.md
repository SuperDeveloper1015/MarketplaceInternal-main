1. Install latest Ubuntu (20+)
2. apt install postgresql nginx redis-server supervisor python3-dev python3-virtualenv python3-pip vim
3. Create this folder: /var/www/lofcrypto
4. cd /var/www/lofcrypto
4. virtualenv -p python3 venv
5. source venv/bin/activate
6. pip install pipenv
7. pipenv install
8. pipenv install psycopg2-binary uwsgi
9. cp example.env .env
10. nano .env  # change DJANGO_ALLOWED_HOSTS to yours
11. su postgres -c 'createuser lofcrypto -lP'  # password: lofcrypto
12. su postgres -c 'createdb lofcrypto -O lofcrypto -E utf8 -l en_US.UTF-8 -T template0'
13. ./manage.py migrate
14. ./manage.py createsuperuser # create user for admin panel
15. ./manage.py collectstatic --noinput
16. cp nginx.conf /etc/nginx/sites-enabled/lofcrypto.conf
17. nano /etc/nginx/sites-enabled/lofcrypto.conf  # change server_name to your domain
18. cp supervisor.conf /etc/supervisor/conf.d/lofcrypto.conf
19. systemctl enable nginx postgresql supervisor redis-server
20. systemctl restart nginx postgresql supervisor redis-server
