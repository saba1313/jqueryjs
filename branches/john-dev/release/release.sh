#!/bin/sh
# Create a new jQuery Relase
# Run like so:
#  ./release.sh VERSION
# Run inside a full SVN checkout.
# By John Resig

echo $1 > trunk/jquery/version.txt
svn cp trunk/jquery tags/$1
svn commit -m "Tagging the $1 release."

cd tags/$1

rm -f *.zip
make clean
make all

zip -r jquery-$1-build.zip GPL-LICENSE.txt MIT-LICENSE.txt Makefile README build build.xml src version.txt -x \*.svn\*
zip -r jquery-$1-release.zip dist docs test -x \*.svn\*
cp -f dist/jquery.pack.js jquery-$1.pack.js
cp -f dist/jquery.min.js jquery-$1.min.js
cp -f dist/jquery.lite.js jquery-$1.js

perl ../../upload.pl jquery-$1*

cp -f jquery-$1-build.zip jquery-latest-build.js
cp -f jquery-$1-release.zip jquery-latest-release.js
cp -f jquery-$1.pack.js jquery-latest.pack.js
cp -f jquery-$1.min.js jquery-latest.min.js
cp -f jquery-$1.js jquery-latest.js
cp -f jquery-$1.js jquery.js

perl ../../upload.pl jquery-latest* jquery.js

python ../../googlecode_upload.py -s "jQuery $1" -p jqueryjs -u jeresig -l Type-Source,Featured jquery-$1.js
python ../../googlecode_upload.py -s "jQuery $1 (Minifed)" -p jqueryjs -u jeresig -l Type-Source,Featured jquery-$1.min.js
python ../../googlecode_upload.py -s "jQuery $1 (Packed)" -p jqueryjs -u jeresig -l Type-Source,Featured jquery-$1.pack.js
python ../../googlecode_upload.py -s "jQuery $1 (Source Code, Test Suite)" -p jqueryjs -u jeresig -l Type-Archive,Featured jquery-$1-release.zip
