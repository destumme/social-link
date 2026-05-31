int-test: export DATABASE_URL=postgresql://test:test@localhost:5432/social_links_test?schema=public
int-test:
	docker compose up -d
	sleep 10 
	yarn prisma db push
	yarn test:int