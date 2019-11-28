#! perl
# http://adventofcode.com/2018/day/5
use strict;
use warnings;
use Storable qw(dclone);
use 5.010;

sub react {
    for (my $i = @_ - 1; $i >= 0; $i--) {
        my $c1 = $_[$i--] // next;
        my $c2 = $_[$i] // next;
        if(abs (ord($c1) - ord($c2)) == 32) {
            # print "Removing ${c1}${c2}\t Now length " . $#_ . "\n";
            splice @_, $i, 2;
            # $i += 2;
        }
        $i++;
    }
    $#_
}

my $line = <>;
my @polymer =  split "", $line;

my $record = $#polymer;
foreach my $c ('A'..'Z') {
    my @p = grep !m/($c)/gi, @polymer;
    my $attempt = &react(@p);
    $record = $attempt if($attempt < $record);
    my @polymer =  split "", $line;
}

print "$record\n";   # 4952
