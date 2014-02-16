SHELL       := /bin/bash
DESTINATION ?= /home/nginx/occupywallst.org

build:
	jekyll build -d $(DESTINATION)

watch:
	jekyll build -d $(DESTINATION) --watch

import:
	sudo -u ows \
		DJANGO_SETTINGS_MODULE=occupywallst.settings \
		/home/ows/ows/bin/python \
		_bin/import.py

.PHONY: build import
