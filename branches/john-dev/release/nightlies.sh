#!/bin/bash
# This assumes that you're in a directory that contains a directory named 'nightlies'
# which is a checked out version of trunk/jquery
# By John Resig

export CURDATE=`date +%Y-%m-%d`

cd nightlies

echo "--- Removing old files"
make clean
rm -f *build.zip *release.zip jquery-nightly* jquery-$CURDATE*
 
echo "--- Updating from SVN"
svn up

echo "--- Building the new version"
make all

echo "--- Packaging for release"
zip -r jquery-$CURDATE.build.zip GPL-LICENSE.txt MIT-LICENSE.txt Makefile README build build.xml src version.txt -x \*.svn\*
zip -r jquery-$CURDATE.release.zip dist docs test -x \*.svn\*

echo "--- Moving to the launch area"
cp -f dist/jquery.pack.js jquery-$CURDATE.pack.js
cp -f dist/jquery.lite.js jquery-$CURDATE.js

echo "--- Setting to current nightly"
cp -f jquery-$CURDATE.build.zip jquery-nightly.build.zip
cp -f jquery-$CURDATE.release.zip jquery-nightly.release.zip
cp -f jquery-$CURDATE.pack.js jquery-nightly.pack.js
cp -f jquery-$CURDATE.js jquery-nightly.js

cd ..

echo "--- Pushing up to Amazon S3"
perl upload.pl nightlies/jquery-nightly* nightlies/jquery-$CURDATE*
