SHELL   := /bin/bash
DEST    ?= /home/nginx/occupywallst.org

build: compile
	jekyll build -d $(DEST)

watch: compile
	jekyll build -d $(DEST) --watch

import:
	sudo -u ows \
		DJANGO_SETTINGS_MODULE=occupywallst.settings \
		/home/ows/ows/bin/python \
		_bin/import.py

lint:
	gjslint --strict -r assets/js/occu

lint:
	fixjsstyle --strict -r assets/js/occu

compile: lint
	python assets/closure-library/closure/bin/build/depswriter.py \
		--root_with_prefix="assets/js/occu ../../../js/occu" \
		--output_file=assets/js/deps.js
	python assets/closure-library/closure/bin/build/closurebuilder.py \
		--namespace=occu.share \
		--root=assets/js/occu \
		--root=assets/closure-library \
		--compiler_jar=_bin/compiler.jar \
		--output_mode=compiled \
		--output_file=assets/js/compiled.js \
		--compiler_flags="--flagfile=assets/js/closure.flags"
	sed -i -e 's/assets/\/assets/g' assets/js/source.map
	echo '//@ sourceMappingURL=/assets/js/source.map' >>assets/js/compiled.js

.PHONY: build import
