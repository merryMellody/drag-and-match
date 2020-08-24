import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";

const wordBoxStyle = {
  display: "flex",
  border: "4px dashed black",
  width: "200px",
  height: "50px",
  marginBottom: "25px",
  marginTop: "25px",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  backgroundColor: "white",
};

const targetBoxStyle = {
  ...wordBoxStyle,
  border: "4px solid black",
  width: "250px",
  height: "75px",
  fontSize: "48px",
};

type WordBoxProps = { word: string };
type TargetBoxProps = { word: string, onDrop: any, isSolved: boolean }

const ItemTypes = {
  BOX: "BOX",
};

function WordBox({ word }: WordBoxProps) {
  const [{ isDragging, opacity, cursor }, drag] = useDrag({
    item: { name: word, type: ItemTypes.BOX },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
      opacity: monitor.isDragging() ? 0.4 : 1,
      cursor: monitor.isDragging() ? "grabbing" : "grab",
      visibility: monitor.isDragging() ? "hidden" : "visible",
    }),
  });

  return (
    <div
      ref={drag}
      style={{ ...wordBoxStyle, opacity, cursor }}
      className={`word-box${isDragging ? " hidden" : ""}`}
    >
      {word}
    </div>
  );
}

function TargetBox({ word, onDrop, isSolved }: TargetBoxProps) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: (item, monitor) => {
      const { name } = monitor.getItem();
      onDrop(name, word);
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver(),
      }
    },
  });

  let dropColor = "white";

  if (isSolved) {
    dropColor = "green";
  } else {
    if (isOver) {
      dropColor = "gold";
    }
  }

  return (
    <div
      ref={drop}
      style={{ ...targetBoxStyle, backgroundColor: dropColor }}
      className={`word-box`}
    >
      {word}
    </div>
  );
}

const WORD_BANK = ["SUP", "HOW", "U", "DÜ"];

function shuffle(array: string[]) {
  const newArray = array.sort(() => Math.random() - 0.5);
  return newArray;
}

type PictureColumnProps = { dropWords: Map<string, boolean>, onDrop: any }

function PictureColumn({ dropWords, onDrop }: PictureColumnProps) {
  return (
    <div className="picture-column">
      {Array.from(dropWords).map(([word, isSolved]) => {
        return <TargetBox word={word} onDrop={onDrop} isSolved={isSolved} />
      })}
    </div>
  )
}

function App() {
  const [words, setWords] = useState(new Set(shuffle(WORD_BANK)));
  const [dropWords, setDropWords] = useState(new Map([
    ["SUP", false],
    ["HOW", false],
    ["U", false],
    ["DÜ", false],
  ]));

  useEffect(() => {
    const dropWordList = Array.from(dropWords);

    let total = 0;

    dropWordList.forEach((dropWord) => {
      if (dropWord[1] === true) {
        total++;
      }
    });

    if (total === WORD_BANK.length) {
      alert("YOU DID THE THING!");
    }
  });

  const updateMap = (k: string, v: any) => {
    setDropWords(new Map(dropWords.set(k, v)));
  }

  const reset = () => {
    const newSet = new Set(shuffle(WORD_BANK));
    setWords(newSet);

    WORD_BANK.forEach((currentWord) => {
      updateMap(currentWord, false);
    });

    console.log(dropWords);
  }

  const onDrop = (name: string, word: string) => {
    console.log({ name, word });
    if (name === word) {
      const newSet = new Set(words);
      newSet.delete(name);
      setWords(newSet);

      const newMap = new Map(dropWords);
      newMap.set(name, true);
      setDropWords(newMap);
      console.log(words);
    }
  }

  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <div className="content">
          <div className="title">
            <h1>Insert Fun Title Here!</h1>
          </div>
          <div className="drag-drop-area">
            <div className="word-column">
              {Array.from(words).map((currentWord) => {
                return <WordBox word={currentWord} />
              })}
            </div>
            <PictureColumn dropWords={dropWords} onDrop={onDrop} />
          </div>
          <div className="button-area">
            <button type="button">Submit</button>
            <button type="button" onClick={() => reset()}>Reset</button>
          </div>
        </div>
      </DndProvider>
    </div>
  );
}

export default App;
