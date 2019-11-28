#! perl
# https://adventofcode.com/2018/day/8
use strict;
use warnings;
use List::Util qw(sum);

our $i = 0;
sub computeChildValue {
    my @numbers = @_;
    my $nChilds = $numbers[$i++];
    my $nMetadata = $numbers[$i++];
    my @childValue = ();
    my @metadata = ();
    my $value = 0;
    # print "nChild = $nChilds\n";
    # print "nMeta = $nMetadata\n";
    for(0..$nChilds-1) {
        # print "Child $_\n";
        push @childValue, &computeChildValue(@numbers);
    }
    for(0..$nMetadata-1) {
        # print "Metadata $numbers[0]\n";
        push @metadata, $numbers[$i++];
    }
    if($nChilds > 0) {
        for(@metadata) {
            if($_ <= $nChilds && $_ > 0) {
                $value += $childValue[$_ - 1];
            }
        }
    } else {
        $value = sum @metadata;
    }
    $value;
}

my $data = <>;
my @numbers = split /\s+/, $data;
print &computeChildValue(@numbers);   # 37560
