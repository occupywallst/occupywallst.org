#!/usr/bin/env python

from datetime import datetime, timedelta

import occupywallst.models as db
import occupywallst.telcodata as td

print db.Article.objects.count()
