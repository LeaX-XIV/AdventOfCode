-- https://adventofcode.com/2021/day/3
import           Data.Bits   (Bits (shiftL, xor))
import           System.IO   (readFile)
import           Text.Printf (printf)

type Binary = [Int]

parseBinary :: String -> Binary
parseBinary = map (\c -> read [c] :: Int)

(^+^) :: [Int] -> [Int] -> [Int]
(^+^) = zipWith (+)

toDec :: Binary -> Int
toDec = foldl (\acc d -> acc `shiftL` 1 + d) 0

countOnes :: [Binary] -> [Int]
countOnes xs = foldr (^+^) init xs
    where
        init = replicate (length $ head xs) 0

gammaRate :: [Binary] -> Int
gammaRate xs = toDec $ map (fromEnum . (> length xs) . (* 2)) $ countOnes xs

epsilonRate :: [Binary] -> Int
epsilonRate xs = gammaRate xs `xor` ((1 `shiftL` length (head xs)) - 1)

powerConsumption :: [Binary] -> Int
powerConsumption xs = gammaRate xs * epsilonRate xs

oxygenGeneratorRating :: [Binary] -> Int -> Int
oxygenGeneratorRating [x] _ = toDec x
oxygenGeneratorRating xs pos = oxygenGeneratorRating (filter (bitCriteria (>=) xs pos) xs) (pos + 1)

co2ScrubberRating :: [Binary] -> Int -> Int
co2ScrubberRating [x] _ = toDec x
co2ScrubberRating xs pos = co2ScrubberRating (filter (bitCriteria (<) xs pos) xs) (pos + 1)

bitCriteria :: (Int -> Int -> Bool) -> [Binary] -> Int -> Binary -> Bool
bitCriteria sign bs pos b = fromEnum ((2 * countOnes bs !! pos) `sign` length bs) == (b !! pos)

lifeSupportRating :: [Binary] -> Int
lifeSupportRating xs = oxygenGeneratorRating xs 0 * co2ScrubberRating xs 0

main :: IO ()
main = do
    diagnostic <- map parseBinary . lines <$> readFile "./input.txt"

    printf "Part 1: %d\n" $ powerConsumption diagnostic
    printf "Part 2: %d\n" $ lifeSupportRating diagnostic
