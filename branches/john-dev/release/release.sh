#!/bin/sh
# Create a new jQuery Relase
# Run like so:
#  ./release.sh VERSION
# Run inside a full SVN checkout.
# By John Resig

cd tags/$1

make all

zip -r jquery-$1-build.zip GPL-LICENSE.txt MIT-LICENSE.txt Makefile README build build.xml src version.txt
zip -r jquery-$1-release.zip dist docs test
cp -f src/jquery.pack.js jquery-$1.pack.js
cp -f src/jquery.lite.js jquery-$1.js

./upload.sh jquery-$1-build.zip jquery-$1-release.zip jquery-$1.pack.js jquery-$1.js

cp -f jquery-$1-build.zip jquery-latest-build.js
cp -f jquery-$1-release.zip jquery-latest-release.js
cp -f jquery-$1.pack.js jquery-latest.pack.js
cp -f jquery-$1.js jquery-latest.js
cp -f jquery-$1.js jquery.js

perl upload.pl jquery-latest-build.zip jquery-latest-release.zip jquery-latest.pack.js jquery-latest.js jquery.js
