client:
	cd Frontend && npm run dev

server:
	python3 Backend/main.py

.PHONY: client server
