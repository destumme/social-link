truncate-db:
	@echo "Truncating social_links..."
	DATABASE_URL="postgresql://social:links@localhost:5432/social_links?schema=public" npx tsx scripts/truncate-db.ts
	@echo "Truncating social_links_test..."
	DATABASE_URL="postgresql://test:test@localhost:5432/social_links_test?schema=public" npx tsx scripts/truncate-db.ts
	@echo "Done."

int-test: export DATABASE_URL=postgresql://test:test@localhost:5432/social_links_test?schema=public
int-test: export PORT=3002
int-test: export BETTER_AUTH_URL=http://localhost:$(PORT)
int-test:
	docker compose up -d
	sleep 10
	yarn prisma db push
	yarn dev -p $(PORT) &
	sleep 5
	yarn run vitest run --project integration
