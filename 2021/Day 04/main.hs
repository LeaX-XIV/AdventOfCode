-- https://adventofcode.com/2021/day/4
import           Data.List
-- import           Data.List.Split (splitOn)
import           Data.Maybe  (catMaybes, fromMaybe, isJust, isNothing)
import           System.IO   (readFile)
import           Text.Printf (printf)

type Cell = Maybe Int
type Board = [Cell]

splitOn :: Eq a => a -> [a] -> [a] -> [[a]]
splitOn _ []  [] = []
splitOn _ []  r  = [r]
splitOn c (x:xs) []
    | x == c        = splitOn c xs []
    | otherwise     = splitOn c xs [x]
splitOn c (x:xs) r
    | x == c        = r : splitOn c xs []
    | otherwise     = splitOn c xs (r ++ [x])

callNumber :: ([Int], [Board]) -> [([Int], [Board], Int)]
callNumber ([], _) = []
callNumber (n:ns, bs) = (ns, newBoards, n) : callNumber (ns, newBoards)
    where
        newBoards = map (map (\m -> if m == Just n then Nothing else m)) bs

countPoints :: Board -> Int
countPoints = sum . catMaybes

isBingo :: Board -> Bool
isBingo b = any (all isNothing) rows || any (all isNothing) cols
    where
        rows = map (map fst) $ groupBy sameRow $ zip b [0..]
        cols = map (map fst) $ groupBy sameCol $ sortBy colSort $ zip b [0..]
        sameRow (_, a) (_, b) = (a `div` 5) == (b `div` 5)
        sameCol (_, a) (_, b) = (a `mod` 5) == (b `mod` 5)
        colSort (_, a) (_, b) = (a `mod` 5) `compare` (b `mod` 5)

nextBingo :: ([Int], [Board]) -> [([Int], [Board], Int, Board)]
nextBingo ([], _) = []
nextBingo (ns, bs) = (newNs, newBs, n, bingoed) : nextBingo (newNs, newBs)
    where
        (newNs, newBs, n) = head $ filter (\_ -> isJust maybeBingoed) $ callNumber (ns, bs)
        maybeBingoed = find isBingo newBs
        Just bingoed = maybeBingoed

completed :: ([Int], [Board]) -> [(Board, Int)]
completed (ns, bs) = (b, n * countPoints b) : completed (newNs, newBs)
    where
        (newNs, tempBs, n, b) = head $ nextBingo (ns, bs)
        newBs = filter isBingo tempBs

-- ranking :: [(Board, Int)]
-- ranking = completed (drawnList, boards)

main :: IO ()
main = do
    lines <- lines <$> readFile "./test1.txt"
    let
        nums = map (read :: String -> Int) (splitOn ',' (head lines) [])
        boards =  map (map (Just . (read :: String -> Int)) . words . unwords) $ splitOn "" (drop 2 lines) []
        -- pBoards = map snd $
        --           groupBy (\a b -> (fst a `div` 5) == (fst b `div` 5)) $
        --           zip [0..] $
        --           map (map (Just . (read :: String -> Int)) . words) boards

    -- ranking :: [(Board, Int)]
    let ranking = completed (nums, boards)

    -- print nums
    -- print boards
    print $ nextBingo (nums, boards)

    -- printf "Part 1: %d\n" $ snd $ head $ ranking
    -- printf "Part 2: %d\n" $ snd $ last ranking
