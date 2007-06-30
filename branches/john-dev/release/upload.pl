#!/usr/bin/perl -w

# This software code is made available "AS IS" without warranties of any
# kind.  You may copy, display, modify and redistribute the software
# code either by itself or as incorporated into your code; provided that
# you do not remove any proprietary notices.  Your use of this software
# code is at your own risk and you waive any claim against Amazon
# Digital Services, Inc. or its affiliates with respect to your use of
# this software code. (c) 2006 Amazon Digital Services, Inc. or its
# affiliates.

# Modified by John Resig

use strict;
use POSIX;

# you might need to use CPAN to get these modules.
# run perl -MCPAN -e "install <module>" to get them.

use Digest::HMAC_SHA1;
use MIME::Base64 qw(encode_base64);
use Getopt::Long qw(GetOptions);

use Sys::Hostname;
use File::Type;

# begin customizing here
my $CURL = "curl";

# stop customizing here

my $url = "code.jquery.com";
my $keyId = "CHANGE ME";
my $secretKey = "CHANGE ME";
my $acl = "public-read";
my $doDelete;

foreach my $fileToPut ( @ARGV ) {
#GetOptions('id=s' => \$keyId, 'key=s' => \$secretKey, 'contentType=s' => \$contentType, 'acl=s' => \$acl, 'put=s' => \$fileToPut, 'delete' => \$doDelete);

print "Uploading $fileToPut ... ";

my $contentType = File::Type->new()->mime_type($fileToPut);

$contentType = "text/plain" if ( $fileToPut =~ /js$/ );

my $method = "";
if (defined $fileToPut) {
    $method = "PUT";
} elsif (defined $doDelete) {
    $method = "DELETE";
} else {
    $method = "GET";
}

my $contentMD5 = "";
my $resource = "/$url/$fileToPut";
my $url = "http://s3.amazonaws.com$resource";
my $httpDate = POSIX::strftime("%a, %e %b %Y %H:%M:%S +0000", gmtime);
my $aclHeaderToSign = defined $acl ? "x-amz-acl:$acl\n" : "";
my $stringToSign = "$method\n$contentMD5\n$contentType\n$httpDate\n$aclHeaderToSign$resource";
my $hmac = Digest::HMAC_SHA1->new($secretKey);
$hmac->add($stringToSign);
my $signature = encode_base64($hmac->digest, "");

my @args = ();
push @args, "-s";
push @args, ("-H", "Date: $httpDate");
push @args, ("-H", "Authorization: AWS $keyId:$signature");
push @args, ("-H", "x-amz-acl: $acl") if (defined $acl);
push @args, ("-H", "content-type: $contentType") if (defined $contentType);
push @args, ("-T", $fileToPut) if (defined $fileToPut);
push @args, ("-X", "DELETE") if (defined $doDelete);

push @args, $url;

system($CURL, @args) == 0 
  or die "Error running $CURL: $?";

print "Done.\n";

}
