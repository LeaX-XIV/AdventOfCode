-- https://adventofcode.com/2021/day/1
import           System.IO   (readFile)
import           Text.Printf (printf)

part1 :: [Int] -> Int
part1 xs = length $ filter (uncurry (>)) $ zip (tail xs) xs

part2 :: [Int] -> Int
part2 xs = length $ filter (uncurry (>)) $ zip (tail $ tail $ tail xs) xs

main :: IO ()
main = do
    depths <- map (read :: String -> Int) . lines <$> readFile "./input.txt"

    printf "Part 1: %d\n" $ part1 depths
    printf "Part 2: %d\n" $ part2 depths
