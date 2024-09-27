let cardOne = 7;
let cardTwo = 5;
let sum = cardOne + cardTwo;

let cardOneBank = 7;
let cardTwoBank = 5;
let cardThreeBank = 6;
let cardFourBank = 3;

let cardThree = 7;
sum += cardThree;


if (sum > 21) {
 console.log('You lose');
}

console.log(`You have ${sum} points`);

let bankSum = cardOneBank + cardTwoBank

while (bankSum < 17) {
    // 추가 카드 선택 (여기서는 cardThreeBank와 cardFourBank 중에서 선택)
    if (bankSum < 17) {
        bankSum += cardThreeBank; // 첫 번째 추가 카드
        console.log(`Dealer have ${bankSum} points`);
    }
    if (bankSum < 17) {
        bankSum += cardFourBank; // 두 번째 추가 카드
        console.log(`Dealer have ${bankSum} points`);
    }
}


if (bankSum > 21 || (sum <= 21 && sum > bankSum)) {
 console.log('You win');
} 
else if(sum == bankSum) {
    console.log('Draw');
}
else {
 console.log('Bank win');
}
