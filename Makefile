docs:
	cd website; \
	yarn; \
	yarn build; \
	cd ..; \
	rm -rf docs; \
	cp -r website/build ./docs
