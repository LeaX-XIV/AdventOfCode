#! perl
# http://adventofcode.com/2018/day/2

local $/;
$_ = <>;
if(/.*?\b(\S*)\S(\S*)\b.*?\b\1\S\2\b.*/s) {
    print $1 . $2;  # uwfmdjxyxlbgnrotcfpvswaqh
}