import React from 'react';
// import FillInTheBlank from '../components/FillBlankQuestion/FillBlankQuestion';
// import MultipleChoiceQuestion from '../components/MultipleChoiceQuestion/MultipleChoiceQuestion';
// import WordMatchQuestion from '../components/WordMatchQuestion/WordMatchQuestion';
// import ListeningQuestion from '../components/ListeningQuestion/ListeningQuestion';
// import exampleAudio from '../assets/example.mp3';
// import RearrangementQuestion from '../components/RearrangeQuestion/RearrangeQuestion';
// import SpeakingQuestion from '../components/SpeakingQuestion/SpeakingQuestion';
// import { questions } from "../../questionSample";

const TestingPage: React.FC = () => {
    // const blankQ1 = questions.questions[3];
    // const rearQ1 = questions.questions[2];
    // const rearQ2 = questions.questions[1];
    // const matchQ1 = questions.questions[0];
    // const speaQ1 = questions.questions[6]
    return (
        <div className='px-60'>
            {/* <div className='p-4 border-2 border-gray-400 rounded-xl'>
                <FillInTheBlank 
                question={blankQ1}
                />
            </div>
            <div className='p-4 mt-2 border-2 border-gray-400 rounded-xl'>
                <MultipleChoiceQuestion 
                text='How old are you?' 
                options={[
                    "I have been playing guitar for 3 years", 
                    "I am 13 years old", 
                    "My name is Harman", 
                    "I like to play with toys"]} 
                    answer={1}
                    />
            </div>
            <div className='p-4 mt-2 border-2 border-gray-400 rounded-xl'>
                <WordMatchQuestion 
                question={matchQ1}
                />
            </div>
            <div className='p-4 mt-2 border-2 border-gray-400 rounded-xl'>
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
            </div>
            <div className='p-4 mt-2 border-2 border-gray-400 rounded-xl'>
                <RearrangementQuestion 
                question={rearQ1}
                />
            </div>
            <div className='p-4 mt-2 border-2 border-gray-400 rounded-xl'>
                <RearrangementQuestion 
                question={rearQ2}
                />
            </div>
            <div className='p-4 mt-2 border-2 border-gray-400 rounded-xl'>
                <SpeakingQuestion 
                questionObj={speaQ1}
                />
            </div> */}
            <h1>Testing Page</h1>
            <p>This is a boilerplate testing page component.</p>
        </div>
    );
};

export default TestingPage;