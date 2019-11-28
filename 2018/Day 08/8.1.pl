#! perl
# https://adventofcode.com/2018/day/8
use strict;
use warnings;
our $i = 0;
sub exploreNode {
    my @numbers = @_;
    my $metaSum = 0;
    my $nChilds = $numbers[$i++];
    my $nMetadata = $numbers[$i++];
    # print "nChild = $nChilds\n";
    # print "nMeta = $nMetadata\n";
    for(0..$nChilds-1) {
        # print "Child $_\n";
        $metaSum += &exploreNode(@numbers);
    }
    for(0..$nMetadata-1) {
        # print "Metadata $numbers[0]\n";
        $metaSum += $numbers[$i++];
    }
    $metaSum;
}

my $data = <>;
my @numbers = split /\s+/, $data;
print &exploreNode(@numbers);   # 44338
