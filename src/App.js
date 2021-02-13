import logo from './hearts/heart.svg';
import './App.css';
import {useState, useEffect, useCallback} from "react";
import song from './song.m4a';
import useSound from 'use-sound';
import heart1 from './hearts/heart1.png';
import heart2 from './hearts/heart2.png';
import heart3 from './hearts/heart3.png';
import heart4 from './hearts/heart4.png';
import heart5 from './hearts/heart5.png';
import heart6 from './hearts/heart6.png';
import heart7 from './hearts/heart7.png';
import heart8 from './hearts/heart8.png';

const titleInEnglish = [
    "Fly me to the Moon",
    "Let me sing among those stars",
    "Let me see what spring is like",
    "On Jupiter and Mars",
    "In other words, hold my hand",
    "In other words, darling kiss me",
    "Fill my heart with song",
    "Let me sing for ever more",
    "You are all I long for",
    "All I worship and adore",
    "In other words, please be true",
    "In other words, I love you"
];

const titleInRussian = [
    "Унеси меня на Луну",
    "Позволь мне петь среди далеких звезд.",
    "Позволь мне увидеть весну",
    "На Юпитере или Марсе.",
    "Другими словами, возьми меня за руку",
    "Другими словами, милый, поцелуй меня.",
    "Наполни мое сердце песней",
    "Позволь мне петь беспрестанно.",
    "Ты — это все, что я страстно желаю",
    "Все, чем я восхищаюсь и что боготворю.",
    "Другими словами, пожалуйста, пусть это будет правдой",
    "Другими словами, я люблю тебя..."
]

let gameLevels = {
   1: {
       score: 0,
       img: heart1
   },
    2: {
       score: 50,
        img: heart2
    },
    3: {
        score: 110,
        img: heart3
    },
    4: {
        score: 180,
        img: heart4
    },
    5: {
        score: 260,
        img: heart5
    },
    6: {
        score: 350,
        img: heart6
    },
    7: {
        score: 450,
        img: heart7
    },
    8: {
        score: 560,
        img: heart8
    },

}

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}


const Hearts = ({x, y, level}) => {
    const [littleHearts, setLittleHearts] = useState([]);
    const [image, setImage] = useState(gameLevels[1].img);
    console.log(x);
    console.log(y);
    const createArray = () => {
        let rand = Math.floor(Math.random()*5+1);
        let array = [];
        for(let i = 0; i < rand; i++) {
            array.push(
                {
                    top: Math.floor(Math.random()*12-12)*10,
                    left: Math.floor(Math.random()*12-12)*10,
                }
            );
        }
        return array
    }
    useEffect(() => {
        setImage(gameLevels[level].img)
        setLittleHearts(createArray());

    }, []);
    return (
        <>
            {littleHearts.map((h) =>  <img
                           src={image} alt="logo"
                           className={`littleHearts littleHeartsAnimate`}
                           style={{top: y+h.top, left: x+h.left}}
                    />
            )}
        </>
)
}

function App() {
    const [heartBeat, setHeartBeat] = useState(false);
    const { height, width } = useWindowDimensions();
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [littleHearts, setLittleHearts] = useState([]);
    const [darkMode, setDarkMode] = useState(false);

    const [play, { pause }] = useSound(song);
    const onClickHeart = () => {
        setHeartBeat(!heartBeat);
        !heartBeat ? play() : pause();
    }

    const addHearts = useCallback((e) => {
        e.preventDefault();
        if ((e.screenX > (width/2-150) && e.screenX < (width/2+150)) 
        && (e.screenY > (height/2-150) && e.screenY < (height/2+150)) 
        && ((e.screenX < (190) && e.screenY < (70)))) return

        setLittleHearts((prev) => {
            return [...prev, {
                x: e.screenX,
                y: e.screenY,

            }]
        });
        setScore((score) => score+1);
        if(level < 8) {
            if(score == gameLevels[level+1].score) {
                setLevel(level+1);
            }
        }

    }, [littleHearts])

    return (
        <div className={darkMode ? "AppDark" : "AppLight"} onClick={addHearts}>
            <div className="score" onClick={() => setDarkMode(!darkMode)}>Score: {score}</div>
            <div className={ heartBeat ? "heartBlock heartAnimate" : "heartBlock"}
                 onClick={onClickHeart}
            >
                <img src={logo} className="heart" alt="logo" />
            </div>
            {littleHearts.map(h => <Hearts x={h.x} y={h.y} level={level}  />)}
        </div>
    );
}



export default App;

