#! perl
# http://adventofcode.com/2018/day/5
use strict;
use warnings;

sub react {
    for (my $i = @_ - 1; $i >= 0; $i--) {
        my $c1 = $_[$i--] // next;
        my $c2 = $_[$i] // next;
        if(abs (ord($c1) - ord($c2)) == 32) {
            splice @_, $i, 2;
        }
        $i++;
    }
    $#_
}

my $line = <>;
my @polymer =  split "", $line;
print &react(@polymer); # 9462
