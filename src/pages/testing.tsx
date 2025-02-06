import React from 'react';
import FillInTheBlank from '../components/BlankQuestion/BlankQuestion';
import MultipleChoiceQuestion from '../components/MultipleChoiceQuestion/MultipleChoiceQuestion';

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
            <h1>Testing Page</h1>
            <p>This is a boilerplate testing page component.</p>
        </div>
    );
};

export default TestingPage;