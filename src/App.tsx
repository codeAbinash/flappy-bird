import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import GameComponent from './components/GameComponent';

function GamePage() {
    const location = useLocation();
    const isBlackHumorPage = location.pathname === '/black-humor';

    return (
        <>
            <Helmet>
                <title>{isBlackHumorPage ? 'Flight Simulator' : 'Flappy Bird Game'}</title>
                <meta
                    name="description"
                    content={
                        isBlackHumorPage
                            ? 'Flight simulator game'
                            : 'Play the classic Flappy Bird game - Test your skills and beat your high score in this addictive arcade game!'
                    }
                />
                <meta name="robots" content={isBlackHumorPage ? 'noindex, nofollow' : 'index, follow'} />
            </Helmet>
            <GameComponent />
        </>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<GamePage />} />
                <Route path="/black-humor" element={<GamePage />} />
            </Routes>
        </Router>
    );
}

export default App;
