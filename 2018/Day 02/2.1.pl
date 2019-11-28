#! perl
# http://adventofcode.com/2018/day/2

local $/;
$_ = <>;
@s = map {join "", sort split //} split /\n/;

$two = (grep{/(?:^|(.)(?!\1))(.)\2(?!\2)/} @s);
$three = (grep{/(?:^|(.)(?!\1))(.)\2\2(?!\2)/} @s);

print $two * $three;    #5727