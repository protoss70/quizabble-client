import React from 'react';
import FillInTheBlank from '../components/FillBlankQuestion/FillBlankQuestion';
import MultipleChoiceQuestion from '../components/MultipleChoiceQuestion/MultipleChoiceQuestion';
import WordMatchQuestion from '../components/WordMatchQuestion/WordMatchQuestion';
import ListeningQuestion from '../components/ListeningQuestion/ListeningQuestion';
import exampleAudio from '../assets/example.mp3';

const TestingPage: React.FC = () => {
    return (
        <div>
            <FillInTheBlank text='In my free time I like to _ the guitar and _ television' answers={["play", "watch"]} options={[["play", "watch"], ["eat", "sleep"]]} />
            <MultipleChoiceQuestion 
            text='How old are you?' 
            options={[
                "I have been playing guitar for 3 years", 
                "I am 13 years old", 
                "My name is Harman", 
                "I like to play with toys"]} 
                answer={1}
                />
            <WordMatchQuestion 
            originalWords={["Song", "Introduction", "Performance"]} 
            translatedWords={["Tanıtım", "Şarkı", "Performans"]}
            answer={[
                ["Song", "Şarkı"], ["Introduction", "Tanıtım"], ["Performance", "Performans"]]}
            />
            <ListeningQuestion 
            audioSrc={exampleAudio}
            options={[
                "The weather is beautiful.",
                "Thanks, I had a wonderfull time!",
                "I had to leave as my house was on fire.",
                "I am Dan, what is your name?"
            ]}
            answer={2}
            />
            <h1>Testing Page</h1>
            <p>This is a boilerplate testing page component.</p>
        </div>
    );
};

export default TestingPage;